# OpenCut 本地化改造总结

## 改造目标

将 OpenCut 从需要服务器和数据库的架构改造为完全本地运行的纯前端应用。

## 核心改动

### 1. 认证系统本地化

**移除：**
- Better Auth（服务器端认证框架）
- PostgreSQL 用户表
- Redis 会话存储

**新增：**
- `src/lib/auth/local-auth.ts` - 基于 IndexedDB 的本地认证服务
- `src/lib/auth/client.ts` - 客户端认证 API
- `src/hooks/use-auth.ts` - React 认证 Hook
- `src/components/providers/auth-provider.tsx` - 认证提供者组件

**特性：**
- 自动创建匿名用户
- 会话管理（30天有效期）
- 完全在浏览器中运行
- 兼容原 better-auth 接口

### 2. 数据库依赖移除

**移除的包：**
```json
{
  "better-auth": "^1.2.7",
  "drizzle-orm": "^0.44.2",
  "postgres": "^3.4.5",
  "pg": "^8.16.2",
  "@upstash/redis": "^1.35.4",
  "@upstash/ratelimit": "^2.0.6",
  "drizzle-kit": "^0.31.4",
  "@types/pg": "^8.15.4"
}
```

**移除的文件：**
- `src/lib/db/` - 数据库连接和 schema
- `drizzle.config.ts` - Drizzle 配置
- `migrations/` - 数据库迁移文件

### 3. 环境变量简化

**移除的环境变量：**
- `DATABASE_URL` - PostgreSQL 连接
- `BETTER_AUTH_SECRET` - 认证密钥
- `UPSTASH_REDIS_REST_URL` - Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis Token

**保留的环境变量：**
- `NODE_ENV` - 运行环境
- `NEXT_PUBLIC_SITE_URL` - 站点 URL
- `NEXT_PUBLIC_MARBLE_API_URL` - CMS API
- 其他可选功能的配置（音效库、转录等）

### 4. Docker 配置更新

**可选移除：**
- `docker-compose.yml` 中的 db、redis、serverless-redis-http 服务
- 或保留用于其他用途

**本地版不需要：**
- PostgreSQL 容器
- Redis 容器
- Redis HTTP 代理

## 数据存储架构

### IndexedDB 数据库

1. **opencut-auth** (新增)
   - `users` store: 用户信息
   - `sessions` store: 会话信息

2. **video-editor-projects** (已有)
   - `projects` store: 项目元数据和场景

3. **video-editor-media-{projectId}** (已有)
   - `media-metadata` store: 媒体文件元数据

4. **video-editor-saved-sounds** (已有)
   - `saved-sounds` store: 保存的音效

### OPFS 存储 (已有)

- `media-files-{projectId}`: 媒体文件二进制数据

### localStorage (新增)

- `opencut-current-session`: 当前会话 ID

## 文件清单

### 新增文件

```
apps/web/src/lib/auth/
├── local-auth.ts              # 本地认证服务
└── client.ts                  # 客户端认证 API

apps/web/src/hooks/
└── use-auth.ts                # 认证 Hook

apps/web/src/components/providers/
└── auth-provider.tsx          # 认证提供者

apps/web/
└── .env.local.example         # 简化的环境变量示例

根目录/
├── README.LOCAL.md            # 本地版说明
├── MIGRATION_GUIDE.md         # 迁移指南
├── QUICKSTART.md              # 快速启动
└── LOCAL_VERSION_SUMMARY.md   # 本文档
```

### 修改的文件

```
apps/web/src/lib/auth/server.ts           # 简化为空实现
apps/web/src/app/api/auth/[...all]/route.ts  # 移除 better-auth
packages/env/src/web.ts                   # 移除数据库配置
apps/web/.env.example                     # 简化环境变量
apps/web/package.json                     # 移除数据库依赖
turbo.json                                # 移除数据库环境变量
README.md                                 # 更新为本地版说明
```

## 使用方式

### 开发环境

```bash
# 1. 安装依赖
bun install

# 2. 创建配置（可选）
cp apps/web/.env.local.example apps/web/.env.local

# 3. 启动
bun dev:web
```

### 生产环境

```bash
# 构建
bun build:web

# 启动
bun start
```

### 静态部署

可以部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## API 兼容性

### 认证 API

**原版（better-auth）：**
```typescript
import { useSession } from "@/lib/auth/client";
const { data: session } = useSession();
```

**本地版：**
```typescript
import { useAuth } from "@/hooks/use-auth";
const { user, isLoading, isAuthenticated } = useAuth();
```

### 服务器端

**原版：**
```typescript
import { auth } from "@/lib/auth/server";
const session = await auth.api.getSession();
```

**本地版：**
```typescript
// 不需要服务器端认证
// 所有认证在客户端完成
```

## 优势

### 1. 简化部署
- 无需数据库服务器
- 无需 Redis 缓存
- 无需 Docker 容器
- 可以纯静态部署

### 2. 隐私保护
- 所有数据存储在用户浏览器
- 不通过网络传输敏感数据
- 符合 GDPR 和隐私法规

### 3. 降低成本
- 无服务器运行成本
- 无数据库维护成本
- 无需付费托管服务

### 4. 提高性能
- 无网络延迟
- 本地存储访问快速
- 离线完全可用

## 限制

### 1. 单用户
- 每个浏览器独立的用户空间
- 无法多用户协作

### 2. 无数据同步
- 不同设备间数据不同步
- 需要手动导出/导入

### 3. 存储限制
- 受浏览器存储配额限制
- 通常为几GB到几十GB

### 4. 无服务器功能
- 无法使用需要服务器的功能
- 如：服务器端渲染、API 集成等

## 技术细节

### 认证流程

```
用户打开应用
    ↓
检查 localStorage 会话
    ↓
会话存在？
    ├─ 是 → 验证会话有效性
    │         ↓
    │      有效？
    │         ├─ 是 → 加载用户信息
    │         └─ 否 → 创建新用户
    │
    └─ 否 → 创建匿名用户
              ↓
           创建会话
              ↓
           保存到 IndexedDB
              ↓
           返回用户信息
```

### 数据持久化

- IndexedDB 数据持久化，不受页面刷新影响
- OPFS 数据独立于浏览器缓存
- localStorage 用于快速访问会话 ID

### 安全性

- Origin Private 存储空间
- 同源策略保护
- 无网络传输风险

## 测试

### 功能测试

- [x] 用户自动登录
- [x] 项目创建和保存
- [x] 媒体文件上传和存储
- [x] 时间轴编辑
- [x] 项目导出
- [x] 离线工作

### 浏览器兼容性

- [x] Chrome 86+
- [x] Firefox 111+
- [x] Safari 15.2+
- [x] Edge 86+

## 未来改进

### 可能的增强

1. **数据导出/导入**
   - 导出项目为 JSON
   - 导入项目从 JSON
   - 批量备份功能

2. **云同步（可选）**
   - 添加可选的云存储集成
   - 保持本地优先原则

3. **多用户支持（可选）**
   - 添加用户切换功能
   - 每个用户独立的数据空间

4. **存储管理**
   - 显示存储使用情况
   - 清理未使用的媒体文件
   - 压缩项目数据

## 维护

### 定期任务

- 更新依赖包
- 测试浏览器兼容性
- 优化存储性能
- 改进用户体验

### 监控

- 浏览器存储使用情况
- 性能指标
- 错误日志

## 支持

- 文档：查看 README.LOCAL.md
- 问题：提交 GitHub Issue
- 贡献：提交 Pull Request

## 许可证

MIT License - 与原项目保持一致

---

**改造完成日期**: 2026-03-06
**版本**: 0.1.0-local
**维护者**: OpenCut Community
