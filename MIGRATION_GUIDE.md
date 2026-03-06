# 本地化迁移指南

本文档说明如何将 OpenCut 从服务器版本迁移到完全本地化版本。

## 改动概览

### 移除的依赖
1. **PostgreSQL** - 用户和会话数据
2. **Redis** - 速率限制和缓存
3. **Better Auth** - 服务器端认证
4. **Drizzle ORM** - 数据库 ORM
5. **Docker** - 容器化部署

### 新增的功能
1. **本地认证系统** (`src/lib/auth/local-auth.ts`)
   - 基于 IndexedDB 的用户存储
   - 自动匿名登录
   - 会话管理

2. **客户端认证 API** (`src/lib/auth/client.ts`)
   - 兼容原 better-auth 接口
   - 完全在浏览器中运行

3. **认证 Hook** (`src/hooks/use-auth.ts`)
   - React Hook 用于访问认证状态
   - 自动初始化和会话管理

## 文件改动清单

### 新增文件
```
apps/web/src/lib/auth/local-auth.ts       # 本地认证服务
apps/web/src/lib/auth/client.ts           # 客户端认证 API
apps/web/src/hooks/use-auth.ts            # 认证 Hook
apps/web/.env.local.example               # 简化的环境变量示例
README.LOCAL.md                           # 本地版本说明文档
MIGRATION_GUIDE.md                        # 本迁移指南
```

### 修改的文件
```
apps/web/src/lib/auth/server.ts           # 简化为空实现
apps/web/src/app/api/auth/[...all]/route.ts  # 移除 better-auth
packages/env/src/web.ts                   # 移除数据库和 Redis 配置
apps/web/.env.example                     # 简化环境变量
apps/web/package.json                     # 移除数据库相关依赖
turbo.json                                # 移除数据库环境变量
```

### 可以删除的文件（可选）
```
apps/web/src/lib/db/                      # 数据库相关代码
apps/web/drizzle.config.ts                # Drizzle 配置
apps/web/migrations/                      # 数据库迁移
docker-compose.yml                        # Docker 配置（如果不需要）
```

## 迁移步骤

### 1. 更新依赖

```bash
# 删除旧依赖
cd apps/web
bun remove better-auth drizzle-orm postgres pg @upstash/redis @upstash/ratelimit drizzle-kit @types/pg

# 重新安装（会自动移除未使用的依赖）
cd ../..
bun install
```

### 2. 配置环境变量

创建 `apps/web/.env.local`：

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MARBLE_API_URL=https://api.marblecms.com
```

其他环境变量都是可选的，如果不需要相关功能可以留空。

### 3. 更新代码中的认证调用

#### 在 React 组件中

**之前（使用 better-auth）：**
```typescript
import { useSession } from "@/lib/auth/client";

function MyComponent() {
  const { data: session } = useSession();
  const user = session?.user;
  // ...
}
```

**现在（使用本地认证）：**
```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  // ...
}
```

#### 在服务器端

**之前：**
```typescript
import { auth } from "@/lib/auth/server";

export async function GET() {
  const session = await auth.api.getSession();
  // ...
}
```

**现在：**
```typescript
// 服务器端不再需要认证
// 所有认证逻辑在客户端完成
export async function GET() {
  // 直接处理请求
  // ...
}
```

### 4. 启动应用

```bash
bun dev:web
```

应用会自动：
1. 在浏览器中创建匿名用户
2. 初始化 IndexedDB 存储
3. 开始工作

## 数据存储说明

### IndexedDB 数据库

本地版本使用以下 IndexedDB 数据库：

1. **opencut-auth** - 用户和会话
   - `users` store: 用户信息
   - `sessions` store: 会话信息

2. **video-editor-projects** - 项目数据
   - `projects` store: 项目元数据和场景

3. **video-editor-media-{projectId}** - 媒体元数据
   - `media-metadata` store: 每个项目的媒体文件元数据

4. **video-editor-saved-sounds** - 保存的音效
   - `saved-sounds` store: 用户收藏的音效

### OPFS 存储

媒体文件（视频、图片、音频）存储在 OPFS (Origin Private File System) 中：
- 目录：`media-files-{projectId}`
- 每个项目有独立的媒体文件存储

### localStorage

仅用于存储当前会话 ID：
- Key: `opencut-current-session`

## 功能对比

| 功能 | 服务器版本 | 本地版本 |
|------|-----------|---------|
| 用户认证 | Better Auth + PostgreSQL | IndexedDB 匿名认证 |
| 项目存储 | IndexedDB | IndexedDB |
| 媒体存储 | OPFS + IndexedDB | OPFS + IndexedDB |
| 多用户支持 | ✅ | ❌ (单浏览器) |
| 数据同步 | ✅ | ❌ |
| 离线工作 | ✅ | ✅ |
| 部署要求 | 服务器 + 数据库 | 静态托管 |
| 隐私保护 | 服务器存储 | 完全本地 |

## 常见问题

### Q: 如何备份数据？
A: 使用浏览器的开发者工具导出 IndexedDB 数据，或者导出项目为视频文件。

### Q: 可以恢复到服务器版本吗？
A: 可以。保留原始的 git 分支，或者重新安装数据库依赖。

### Q: 多个浏览器可以共享数据吗？
A: 不可以。每个浏览器的数据是独立的。

### Q: 如何清除所有数据？
A: 在浏览器设置中清除站点数据，或使用开发者工具删除 IndexedDB。

### Q: 性能会受影响吗？
A: 不会。IndexedDB 和 OPFS 都是高性能的本地存储方案。

## 技术细节

### 认证流程

1. 用户打开应用
2. `useAuth` Hook 初始化
3. 检查 localStorage 中的会话 ID
4. 如果没有会话，创建匿名用户
5. 创建新会话并保存到 IndexedDB
6. 返回用户信息

### 数据持久化

- IndexedDB 数据会一直保存，除非：
  - 用户手动清除浏览器数据
  - 浏览器存储配额已满
  - 用户卸载浏览器

- OPFS 数据同样持久化，且不受浏览器缓存清理影响

### 安全性

- 所有数据存储在浏览器的 Origin Private 空间
- 其他网站无法访问
- 不通过网络传输敏感数据
- 符合隐私优先的设计理念

## 支持

如有问题，请提交 Issue 或查看 [README.LOCAL.md](README.LOCAL.md)。
