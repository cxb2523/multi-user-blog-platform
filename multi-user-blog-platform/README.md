# 多用户博客平台

一个功能完整的多用户博客平台，使用 SvelteKit + Fastify + MongoDB 构建。

## 技术栈

- **前端**: SvelteKit + TypeScript + Tailwind CSS + Marked (Markdown 解析)
- **后端**: Fastify + TypeScript + JWT 认证
- **数据库**: MongoDB + Mongoose ODM

## 功能特性

- ✅ 用户注册/登录（JWT 认证）
- ✅ 文章发布、编辑、删除
- ✅ Markdown 文章编辑
- ✅ 文章标签分类
- ✅ 评论功能
- ✅ 按标签筛选文章
- ✅ 分页浏览
- ✅ 用户中心（文章管理）
- ✅ 响应式设计，支持移动端

## 项目结构

```
.
├── frontend/          # SvelteKit 前端
│   ├── src/
│   │   ├── lib/      # 工具库、类型定义
│   │   │   ├── stores/    # 状态管理
│   │   │   └── api/       # API 客户端
│   │   └── routes/   # 页面路由
│   └── package.json
├── backend/           # Fastify 后端
│   ├── src/
│   │   ├── models/   # 数据模型
│   │   ├── routes/   # API 路由
│   │   ├── middleware/ # 认证中间件
│   │   ├── config/   # 配置文件
│   │   └── server.ts # 服务器入口
│   └── package.json
└── package.json       # 根项目配置
```

## 前置要求

- Node.js 18+
- MongoDB 5+（本地或远程）

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

### 2. 配置环境变量

编辑 `backend/.env` 文件：

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. 启动 MongoDB

确保 MongoDB 正在运行，或使用 Docker：

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 启动开发服务器

同时启动前后端：

```bash
npm run dev
```

或分别启动：

```bash
# 启动后端 (端口 3000)
npm run dev:backend

# 启动前端 (端口 5173)
npm run dev:frontend
```

### 5. 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章接口

- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `GET /api/articles/my` - 获取我的文章（需要认证）
- `POST /api/articles` - 创建文章（需要认证）
- `PUT /api/articles/:id` - 更新文章（需要认证 + 作者权限）
- `DELETE /api/articles/:id` - 删除文章（需要认证 + 作者权限）

### 评论接口

- `GET /api/articles/:id/comments` - 获取文章评论
- `POST /api/articles/:id/comments` - 发表评论（需要认证）

### 标签接口

- `GET /api/tags` - 获取所有标签及文章数量

## 前端路由

- `/` - 首页（文章列表）
- `/login` - 登录页
- `/register` - 注册页
- `/article/:id` - 文章详情页
- `/editor` - 新建文章（需要登录）
- `/editor?id=:id` - 编辑文章（需要登录）
- `/dashboard` - 用户中心（需要登录）

## 生产构建

```bash
# 构建前后端
npm run build

# 启动后端
npm run start:backend

# 启动前端预览
npm run start:frontend
```

## 开发说明

### 后端开发

后端使用 Fastify 框架，采用分层架构：
- `models/`: Mongoose 数据模型定义
- `routes/`: API 路由处理
- `middleware/`: 认证和其他中间件
- `config/`: 数据库连接等配置

### 前端开发

前端使用 SvelteKit：
- `lib/stores/`: Svelte store 管理认证状态
- `lib/api/`: API 请求封装
- `routes/`: 页面组件和布局

### 认证流程

1. 用户注册/登录成功后，后端返回 JWT token
2. 前端将 token 和用户信息存储在 localStorage
3. 后续请求在 Authorization header 中携带 token
4. 后端中间件验证 token 有效性

## 许可证

MIT
