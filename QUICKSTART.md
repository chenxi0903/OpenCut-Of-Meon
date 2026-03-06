# OpenCut 本地版 - 快速启动

## 5 分钟快速开始

### 1. 安装 Bun（如果还没有）

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. 克隆并安装

```bash
git clone <your-repo-url>
cd OpenCut-Of-Meon
bun install
```

### 3. 创建配置文件

```bash
# Windows PowerShell
Copy-Item apps/web/.env.local.example apps/web/.env.local

# macOS/Linux
cp apps/web/.env.local.example apps/web/.env.local
```

### 4. 启动应用

```bash
bun dev:web
```

### 5. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

就这么简单！🎉

## 无需以下操作

- ❌ 安装 Docker
- ❌ 启动数据库
- ❌ 配置 Redis
- ❌ 设置认证密钥
- ❌ 运行数据库迁移

所有数据都存储在浏览器中，完全本地化！

## 最小环境变量

只需要这两个：

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MARBLE_API_URL=https://api.marblecms.com
```

## 可选功能

如果需要以下功能，可以添加相应的环境变量：

### 音效库（Freesound）
```env
FREESOUND_CLIENT_ID=your_client_id
FREESOUND_API_KEY=your_api_key
```

### 博客功能（Marble CMS）
```env
MARBLE_WORKSPACE_KEY=your_workspace_key
```

### 自动字幕转录
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
MODAL_TRANSCRIPTION_URL=your_modal_url
```

## 常用命令

```bash
# 开发模式
bun dev:web

# 生产构建
bun build:web

# 启动生产服务器
bun start

# 代码检查
bun lint:web

# 代码格式化
bun format:web
```

## 浏览器要求

推荐使用现代浏览器：
- Chrome/Edge 86+
- Firefox 111+
- Safari 15.2+

## 数据存储位置

所有数据存储在浏览器中：
- 项目数据：IndexedDB
- 媒体文件：OPFS (Origin Private File System)
- 用户信息：IndexedDB

## 故障排除

### 端口被占用
```bash
# 使用其他端口
bun dev:web -- -p 3001
```

### 清除浏览器数据
1. 打开浏览器开发者工具 (F12)
2. Application/存储 标签
3. 清除 IndexedDB 和 OPFS 数据

### 重新安装依赖
```bash
rm -rf node_modules bun.lock
bun install
```

## 下一步

- 📖 阅读 [README.LOCAL.md](README.LOCAL.md) 了解详细信息
- 🔧 查看 [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) 了解技术细节
- 🐛 遇到问题？提交 Issue
- 💡 有想法？提交 Pull Request

## 支持

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 文档: [README.LOCAL.md](README.LOCAL.md)
- 迁移指南: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

祝你使用愉快！🚀
