# OpenCut 本地版本

这是 OpenCut 的完全本地化版本，所有数据都存储在浏览器的 IndexedDB 中，无需任何服务器或数据库。

## 主要改动

### 1. 移除的依赖
- ❌ PostgreSQL 数据库
- ❌ Redis 缓存
- ❌ Better Auth（服务器端认证）
- ❌ Drizzle ORM
- ❌ Docker 依赖

### 2. 新增功能
- ✅ 本地认证系统（基于 IndexedDB）
- ✅ 自动匿名登录
- ✅ 所有项目数据本地存储
- ✅ 媒体文件本地存储（OPFS + IndexedDB）
- ✅ 完全离线工作

## 快速开始

### 前置要求
- [Bun](https://bun.sh/docs/installation) 或 Node.js 18+

### 安装步骤

1. 克隆仓库
```bash
git clone <your-repo-url>
cd OpenCut-Of-Meon
```

2. 安装依赖
```bash
bun install
```

3. 创建环境配置（可选）
```bash
# Windows PowerShell
Copy-Item apps/web/.env.local.example apps/web/.env.local

# Unix/Linux/Mac
cp apps/web/.env.local.example apps/web/.env.local
```

4. 启动开发服务器
```bash
bun dev:web
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

就这么简单！无需启动数据库或任何其他服务。

## 数据存储

### 存储位置
所有数据都存储在浏览器中：

- **项目数据**: IndexedDB (`video-editor-projects`)
- **媒体文件**: OPFS (Origin Private File System) + IndexedDB
- **用户数据**: IndexedDB (`opencut-auth`)
- **音效收藏**: IndexedDB (`video-editor-saved-sounds`)

### 数据持久化
- 数据会一直保存在浏览器中，除非手动清除
- 不同浏览器的数据是独立的
- 清除浏览器数据会删除所有项目

### 导出/备份
建议定期导出项目文件作为备份：
1. 在编辑器中打开项目
2. 使用导出功能保存为视频文件
3. 项目数据可以通过浏览器的开发者工具导出

## 环境变量

最小配置只需要：
```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MARBLE_API_URL=https://api.marblecms.com
```

可选功能（如不需要可留空）：
- `FREESOUND_CLIENT_ID` / `FREESOUND_API_KEY` - 音效库
- `MARBLE_WORKSPACE_KEY` - 博客功能
- `CLOUDFLARE_ACCOUNT_ID` 等 - 自动字幕转录

## 构建生产版本

```bash
bun run build:web
bun run start
```

## 浏览器兼容性

需要支持以下特性的现代浏览器：
- IndexedDB
- OPFS (Origin Private File System)
- WebAssembly (用于 FFmpeg)
- Canvas API

推荐使用：
- Chrome/Edge 86+
- Firefox 111+
- Safari 15.2+

## 与原版的区别

| 功能 | 原版 | 本地版 |
|------|------|--------|
| 数据存储 | PostgreSQL | IndexedDB |
| 用户认证 | Better Auth + 服务器 | 本地匿名认证 |
| 缓存 | Redis | 浏览器缓存 |
| 部署 | 需要服务器 | 纯静态部署 |
| 多用户 | 支持 | 单用户（浏览器级别） |
| 数据同步 | 服务器同步 | 无（本地存储） |

## 常见问题

### Q: 数据会丢失吗？
A: 只要不清除浏览器数据，项目会一直保存。建议定期导出重要项目。

### Q: 可以在多台设备间同步吗？
A: 本地版不支持同步。每个浏览器的数据是独立的。

### Q: 如何迁移到原版？
A: 导出所有项目为视频文件，然后在原版中重新导入素材。

### Q: 存储空间有限制吗？
A: 取决于浏览器的存储配额，通常为几GB到几十GB。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 [LICENSE](LICENSE)
