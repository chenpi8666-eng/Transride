# Transride

🎬 视频上传服务 - 为静态网页提供视频URL的简单解决方案

## 功能特性

- ✅ 支持多种视频格式 (MP4, AVI, MOV, WMV, FLV, WEBM)
- ✅ 拖拽上传和批量上传支持
- ✅ 实时上传进度显示
- ✅ 自动生成可访问的视频URL
- ✅ 已上传视频列表管理
- ✅ 一键复制URL到剪贴板
- ✅ 响应式设计，支持移动设备

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
```

服务将在 `http://localhost:3000` 启动

### 开发模式

```bash
npm run dev
```

使用 nodemon 自动重启服务

## 使用方法

1. 访问 `http://localhost:3000`
2. 选择或拖拽视频文件到上传区域
3. 点击上传按钮
4. 获取生成的视频URL
5. 在静态网页中使用这些URL

## API 接口

### 上传视频

```
POST /upload
Content-Type: multipart/form-data

参数:
- video: 视频文件 (最大100MB)

响应:
{
  "success": true,
  "message": "Video uploaded successfully",
  "filename": "video-1234567890-123456789.mp4",
  "originalName": "my-video.mp4",
  "size": 1024000,
  "url": "http://localhost:3000/uploads/video-1234567890-123456789.mp4"
}
```

### 获取视频列表

```
GET /videos

响应:
{
  "success": true,
  "videos": [
    {
      "filename": "video-1234567890-123456789.mp4",
      "url": "http://localhost:3000/uploads/video-1234567890-123456789.mp4",
      "size": 1024000,
      "uploadDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 在静态网页中使用

获取视频URL后，可以在HTML中这样使用：

```html
<video controls width="800">
  <source src="http://localhost:3000/uploads/video-1234567890-123456789.mp4" type="video/mp4">
  您的浏览器不支持视频播放。
</video>
```

## 配置

### 环境变量

- `PORT`: 服务端口 (默认: 3000)

### 文件限制

- 最大文件大小: 100MB
- 支持格式: MP4, AVI, MOV, WMV, FLV, WEBM

## 项目结构

```
Transride/
├── server.js          # Express 服务器
├── package.json       # 项目配置
├── public/            # 静态文件
│   └── index.html     # 上传界面
├── uploads/           # 上传的视频文件 (自动创建)
└── README.md          # 项目文档
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件