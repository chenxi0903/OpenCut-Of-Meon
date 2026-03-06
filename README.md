<table width="100%">
  <tr>
    <td align="left" width="120">
      <img src="apps/web/public/logos/opencut/1k/logo-white-black.png" alt="OpenCut Logo" width="100" />
    </td>
    <td align="right">
      <h1>OpenCut - 本地版</span></h1>
      <h3 style="margin-top: -10px;">完全本地化的免费开源视频编辑器</h3>
    </td>
  </tr>
</table>

> 🎉 **本地版特性**: 无需数据库、无需服务器、所有数据存储在浏览器中！

## 快速开始

```bash
# 1. 安装依赖
bun install

# 2. 创建配置（可选）
cp apps/web/.env.local.example apps/web/.env.local

# 3. 启动应用
bun dev:web
```

就这么简单！访问 [http://localhost:3000](http://localhost:3000)

📖 详细说明请查看 [QUICKSTART.md](QUICKSTART.md)

## 本地版 vs 原版

| 特性 | 本地版 | 原版 |
|------|--------|------|
| 数据存储 | 浏览器 IndexedDB | PostgreSQL |
| 用户认证 | 本地匿名 | Better Auth |
| 部署 | 静态托管 | 需要服务器 |
| 隐私 | 100% 本地 | 服务器存储 |
| 设置复杂度 | ⭐ 简单 | ⭐⭐⭐ 复杂 |

## 为什么选择本地版？

- **隐私优先**: 视频和项目数据永不离开你的设备
- **零配置**: 无需 Docker、数据库或 Redis
- **完全免费**: 没有服务器成本
- **离线工作**: 无需网络连接即可编辑视频
- **快速启动**: 3 个命令即可运行

## Sponsors

Thanks to [Vercel](https://vercel.com?utm_source=github-opencut&utm_campaign=oss) and [fal.ai](https://fal.ai?utm_source=github-opencut&utm_campaign=oss) for their support of open-source software.

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

<a href="https://fal.ai">
  <img alt="Powered by fal.ai" src="https://img.shields.io/badge/Powered%20by-fal.ai-000000?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMEwxMy4wOSAxNS43NEwxMiAyMkwxMC45MSAxNS43NEw0IDEwTDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" />
</a>

## 功能特性

- ✅ 时间轴编辑
- ✅ 多轨道支持
- ✅ 实时预览
- ✅ 无水印
- ✅ 完全本地存储
- ✅ 100% 匿名分析（[Databuddy](https://www.databuddy.cc?utm_source=opencut)）
- ✅ 博客支持（[Marble](https://marblecms.com?utm_source=opencut)）

## 项目结构

```
OpenCut-Of-Meon/
├── apps/web/              # Next.js 应用
│   ├── src/
│   │   ├── core/         # 编辑器核心
│   │   ├── components/   # UI 组件
│   │   ├── services/     # 渲染服务
│   │   ├── lib/          # 业务逻辑
│   │   │   └── auth/     # 本地认证系统
│   │   └── stores/       # 状态管理
│   └── public/           # 静态资源
└── packages/
    ├── env/              # 环境配置
    └── ui/               # UI 组件库
```

## 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript
- **状态管理**: Zustand
- **UI**: Radix UI + Tailwind CSS
- **存储**: IndexedDB + OPFS
- **视频处理**: FFmpeg (WebAssembly)
- **包管理**: Bun + Turborepo

## 数据存储

所有数据存储在浏览器中：

- **项目数据**: IndexedDB (`video-editor-projects`)
- **媒体文件**: OPFS + IndexedDB
- **用户信息**: IndexedDB (`opencut-auth`)
- **音效收藏**: IndexedDB (`video-editor-saved-sounds`)

## 环境变量

最小配置（必需）：
```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MARBLE_API_URL=https://api.marblecms.com
```

可选功能：
- `FREESOUND_CLIENT_ID` / `FREESOUND_API_KEY` - 音效库
- `MARBLE_WORKSPACE_KEY` - 博客功能
- `CLOUDFLARE_ACCOUNT_ID` 等 - 自动字幕

## 贡献

欢迎贡献！查看 [Contributing Guide](.github/CONTRIBUTING.md)

**重点领域:**
- 时间轴功能
- 项目管理
- 性能优化
- Bug 修复
- UI 改进

**暂时避免:**
- 预览面板增强（正在重构）
- 导出功能（正在重构）

## 文档

- 📖 [快速启动指南](QUICKSTART.md)
- 🔧 [迁移指南](MIGRATION_GUIDE.md)
- 📚 [本地版说明](README.LOCAL.md)
- 🤝 [贡献指南](.github/CONTRIBUTING.md)

## 浏览器兼容性

推荐使用现代浏览器：
- Chrome/Edge 86+
- Firefox 111+
- Safari 15.2+

需要支持：IndexedDB、OPFS、WebAssembly、Canvas API

## 许可证

[MIT LICENSE](LICENSE)

---

## 常见问题

### 数据会丢失吗？
只要不清除浏览器数据，项目会一直保存。建议定期导出重要项目。

### 可以在多台设备间同步吗？
本地版不支持同步。每个浏览器的数据是独立的。

### 存储空间有限制吗？
取决于浏览器的存储配额，通常为几GB到几十GB。

### 如何备份数据？
使用浏览器开发者工具导出 IndexedDB，或导出项目为视频文件。

---

![Star History Chart](https://api.star-history.com/svg?repos=opencut-app/opencut&type=Date)
