# 部署说明

## Vercel 部署配置

### 环境变量设置

在 Vercel 项目设置中，只需要配置以下环境变量：

#### 必需的环境变量
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_MARBLE_API_URL=https://api.marblecms.com
```

#### 可选的环境变量（根据需要添加）

**音效库功能（Freesound）：**
```
FREESOUND_CLIENT_ID=your_client_id
FREESOUND_API_KEY=your_api_key
```

**博客功能（Marble CMS）：**
```
MARBLE_WORKSPACE_KEY=your_workspace_key
```

**自动字幕转录：**
```
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
MODAL_TRANSCRIPTION_URL=your_modal_url
```

### 不再需要的环境变量

以下环境变量已被移除，无需配置：
- ❌ `DATABASE_URL` - 已移除 PostgreSQL
- ❌ `BETTER_AUTH_SECRET` - 已移除服务器端认证
- ❌ `UPSTASH_REDIS_REST_URL` - 已移除 Redis
- ❌ `UPSTASH_REDIS_REST_TOKEN` - 已移除 Redis

如果你的 Vercel 项目中还有这些变量，可以安全删除。

## 构建配置

### Framework Preset
- **Framework**: Next.js
- **Build Command**: `turbo run build` (自动检测)
- **Output Directory**: `.next` (自动检测)
- **Install Command**: `bun install` (自动检测)

### 环境
- **Node.js Version**: 18.x 或更高
- **Package Manager**: Bun (推荐) 或 npm

## 本地化改造说明

### 限流实现
本地版使用基于内存的限流器替代 Redis：
- 每个实例独立的限流计数
- 自动清理过期记录
- 默认：100 请求/分钟

**注意**: 在多实例部署时，每个实例有独立的限流计数。如需全局限流，可以考虑：
1. 使用 Vercel Edge Config
2. 集成第三方限流服务
3. 保持当前实现（对大多数场景足够）

### 数据存储
- 所有用户数据存储在浏览器 IndexedDB
- 媒体文件存储在 OPFS
- 无需数据库或持久化存储

### 认证系统
- 完全客户端认证
- 自动创建匿名用户
- 无需服务器端会话管理

## 部署检查清单

- [ ] 设置必需的环境变量（NODE_ENV, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_MARBLE_API_URL）
- [ ] 删除旧的数据库和 Redis 环境变量
- [ ] 确认构建命令为 `turbo run build`
- [ ] 确认使用 Bun 作为包管理器
- [ ] 测试部署后的应用功能

## 故障排除

### 构建失败：找不到模块

**问题**: `Module not found: Can't resolve '@upstash/ratelimit'`

**解决**: 
1. 确保已推送最新代码（包含 rate-limit.ts 的修复）
2. 在 Vercel 中触发重新部署
3. 清除构建缓存后重新部署

### 环境变量警告

**问题**: Turbo 警告缺少环境变量

**解决**: 
这些警告可以忽略，因为这些变量已不再使用：
- DATABASE_URL
- BETTER_AUTH_SECRET
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

可以从 Vercel 项目设置中删除这些变量。

### 应用无法加载

**检查**:
1. 浏览器控制台是否有错误
2. 浏览器是否支持 IndexedDB 和 OPFS
3. 是否启用了第三方 Cookie（某些浏览器需要）

## 性能优化

### 推荐设置
- 启用 Vercel Analytics
- 启用 Edge Functions（如果需要）
- 配置适当的缓存策略

### 静态资源
- 字体文件已优化为 AVIF 格式
- 图片使用 Next.js Image 优化
- 启用 Turbopack 加速构建

## 监控

### 推荐监控指标
- 页面加载时间
- IndexedDB 操作性能
- 内存使用情况
- 限流触发频率

### 日志
- 客户端错误会记录到浏览器控制台
- 可以集成 Sentry 或其他错误追踪服务

## 扩展性

### 水平扩展
- 完全支持多实例部署
- 每个实例独立运行
- 无共享状态

### 限制
- 限流是实例级别的（非全局）
- 无法跨设备同步用户数据
- 存储受浏览器配额限制

## 成本

### Vercel 免费计划
- ✅ 完全支持
- ✅ 无需额外服务
- ✅ 无数据库成本
- ✅ 无 Redis 成本

### 付费功能（可选）
- Vercel Analytics
- Vercel Edge Config（如需全局限流）
- 自定义域名

## 支持

遇到问题？
1. 查看 [README.LOCAL.md](README.LOCAL.md)
2. 查看 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
3. 提交 GitHub Issue
4. 查看 Vercel 部署日志

---

**最后更新**: 2026-03-06
**版本**: 0.1.0-local
