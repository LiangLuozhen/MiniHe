#  MiniHE 3.0 API 接口使用文档

本文档详细介绍了小黑盒 MiniHE 3.0 后端 API 的所有接口使用方法和参数说明。

##  目录

- [API基础信息](#api基础信息)
- [快速开始](#快速开始)
- [认证相关接口](#认证相关接口)
- [用户相关接口](#用户相关接口)
- [帖子相关接口](#帖子相关接口)
- [评论相关接口](#评论相关接口)
- [标签相关接口](#标签相关接口)
- [互动功能接口](#互动功能接口)
- [收藏功能接口](#收藏功能接口)
- [错误码说明](#错误码说明)

---

## API基础信息

### 基础URL

```
http://localhost:3000/api
```

### 响应格式

所有接口都返回统一的 JSON 格式：

```json
{
  "success": boolean,      // 请求是否成功
  "message": string,       // 返回消息
  "data": object | null,   // 返回数据
  "error": string | null   // 错误信息（成功时为null）
}
```

### 状态码说明

| 状态码 | 说明                 |
| ------ | -------------------- |
| 200    | 请求成功             |
| 201    | 资源创建成功         |
| 400    | 客户端请求错误       |
| 401    | 未授权（需要登录）   |
| 403    | 禁止访问（权限不足） |
| 404    | 资源不存在           |
| 500    | 服务器内部错误       |

### 认证方式

需要认证的接口需要在请求头中添加：

```
Authorization: Bearer <your_jwt_token>
```

---

## 快速开始

### 1. 启动服务器

```bash
# 安装依赖（首次运行）
npm install

# 启动服务器
npm start
# 或开发模式
npm run dev
```

### 2. 测试连接

```bash
# 健康检查
curl -X GET http://localhost:3000/api/health

# 查看API文档
curl -X GET http://localhost:3000/api/docs
```

### 3. 测试用户流程

1. 用户注册
2. 用户登录（获取token）
3. 使用token调用需要认证的接口

---

## 认证相关接口

### 1. 用户注册

注册新用户账号。

**接口地址**：

```
POST /api/auth/register
```

**请求头**：

```
Content-Type: application/json
```

**请求体**：

```json
{
  "phone": "13800138001",
  "username": "新用户",
  "password": "123456"
}
```

**字段说明**：

- `phone`：手机号（11位数字）
- `username`：用户名（2-20个字符）
- `password`：密码（6-20个字符）

**成功响应**：

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "phone": "13800138001",
      "username": "新用户",
      "created_at": "2024-01-01T00:00:00.000Z",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

**错误响应**：

```json
{
  "success": false,
  "message": "手机号已被注册",
  "data": null,
  "error": "PHONE_EXISTS"
}
```

### 2. 用户登录

用户登录获取访问令牌。

**接口地址**：

```
POST /api/auth/login
```

**请求头**：

```
Content-Type: application/json
```

**请求体**：

```json
{
  "phone": "13800138001",
  "password": "123456"
}
```

**成功响应**：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "phone": "13800138001",
      "username": "新用户",
      "created_at": "2024-01-01T00:00:00.000Z",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

### 3. 获取当前用户信息

获取当前登录用户的详细信息。

**接口地址**：

```
GET /api/auth/me
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "user": {
      "id": 1,
      "phone": "13800138001",
      "username": "新用户",
      "created_at": "2024-01-01T00:00:00.000Z",
      "status": "active"
    }
  },
  "error": null
}
```

---

## 用户相关接口

### 1. 获取用户信息

获取指定用户的公开信息。

**接口地址**：

```
GET /api/users/:id
```

**参数说明**：

- `:id`：用户ID

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": 1,
    "phone": "13800138001",
    "username": "LOL大神",
    "created_at": "2024-01-01T00:00:00.000Z",
    "status": "active",
    "follower_count": 4,
    "following_count": 3
  },
  "error": null
}
```

### 2. 获取用户发布的帖子

获取指定用户发布的所有帖子。

**接口地址**：

```
GET /api/users/:id/posts
```

**查询参数**：

- `page`：页码（默认1）
- `limit`：每页数量（默认20）

**示例**：

```
GET /api/users/1/posts?page=1&limit=10
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "英雄联盟14.1版本上单强度分析",
        "content": "新版本上单格局大变...",
        "image_url": "https://example.com/image.jpg",
        "view_count": 156,
        "like_count": 23,
        "favorite_count": 12,
        "comment_count": 8,
        "created_at": "2024-01-01T10:30:00.000Z",
        "game_tag": "英雄联盟",
        "total_likes": 23,
        "total_favorites": 12,
        "total_comments": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "has_more": false
    }
  },
  "error": null
}
```

### 3. 关注用户

关注指定用户。

**接口地址**：

```
POST /api/users/:id/follow
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**参数说明**：

- `:id`：要关注的用户ID

**成功响应**：

```json
{
  "success": true,
  "message": "关注成功",
  "data": null,
  "error": null
}
```

**错误响应**：

```json
{
  "success": false,
  "message": "不能关注自己",
  "data": null,
  "error": "CANNOT_FOLLOW_SELF"
}
```

### 4. 取消关注

取消关注指定用户。

**接口地址**：

```
DELETE /api/users/:id/follow
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "取消关注成功",
  "data": null,
  "error": null
}
```

### 5. 获取粉丝列表

获取指定用户的粉丝列表。

**接口地址**：

```
GET /api/users/:id/followers
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "followers": [
      {
        "id": 2,
        "username": "CSGO专家",
        "phone": "22222222222",
        "created_at": "2024-01-01T10:30:00.000Z"
      }
    ]
  },
  "error": null
}
```

### 6. 获取关注列表

获取指定用户关注的用户列表。

**接口地址**：

```
GET /api/users/:id/following
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "following": [
      {
        "id": 2,
        "username": "CSGO专家",
        "phone": "22222222222",
        "created_at": "2024-01-01T10:30:00.000Z"
      }
    ]
  },
  "error": null
}
```

---

## 帖子相关接口

### 1. 获取帖子列表

获取所有帖子，按权重排序（浏览量×40% + 点赞量×60%）。

**接口地址**：

```
GET /api/posts
```

**查询参数**：

- `page`：页码（默认1）
- `limit`：每页数量（默认20）
- `tag`：标签ID（可选，按标签筛选）

**示例**：

```
# 获取所有帖子
GET /api/posts

# 获取Apex英雄标签的帖子
GET /api/posts?tag=1

# 获取第二页，每页5条
GET /api/posts?page=2&limit=5
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "联盟这么良心了?",
        "content": "新手任务送真实伤害吗",
        "image_url": "https://imgheybox1.max-c.com/bbs/2025/11/11/...",
        "view_count": 156,
        "like_count": 23,
        "favorite_count": 12,
        "comment_count": 8,
        "created_at": "2024-01-01T10:30:00.000Z",
        "author_name": "LOL大神",
        "game_tag": "英雄联盟",
        "weight": 136.4,
        "total_likes": 23,
        "total_favorites": 12,
        "total_comments": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6,
      "has_more": false
    }
  },
  "error": null
}
```

### 2. 获取单个帖子详情

获取指定帖子的详细信息，并增加浏览量。

**接口地址**：

```
GET /api/posts/:id
```

**参数说明**：

- `:id`：帖子ID

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "post": {
      "id": 1,
      "user_id": 1,
      "tag_id": 3,
      "title": "联盟这么良心了?",
      "content": "新手任务送真实伤害吗",
      "image_url": "https://imgheybox1.max-c.com/bbs/2025/11/11/...",
      "view_count": 157,
      "like_count": 23,
      "favorite_count": 12,
      "comment_count": 8,
      "status": "published",
      "created_at": "2024-01-01T10:30:00.000Z",
      "updated_at": "2024-01-01T10:30:00.000Z",
      "author_name": "LOL大神",
      "game_tag": "英雄联盟",
      "total_likes": 23,
      "total_favorites": 12,
      "total_comments": 8
    }
  },
  "error": null
}
```

### 3. 创建帖子

发布新的帖子。

**接口地址**：

```
POST /api/posts
```

**请求头**：

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求体**：

```json
{
  "tagId": 1,
  "title": "新的帖子标题",
  "content": "这是帖子的详细内容，至少10个字符。",
  "imageUrl": "https://example.com/image.jpg"
}
```

**字段说明**：

- `tagId`：标签ID（必须）
- `title`：帖子标题（3-100个字符）
- `content`：帖子内容（至少10个字符）
- `imageUrl`：图片URL（可选）

**成功响应**：

```json
{
  "success": true,
  "message": "帖子创建成功",
  "data": {
    "post": {
      "id": 7,
      "user_id": 1,
      "tag_id": 1,
      "title": "新的帖子标题",
      "content": "这是帖子的详细内容，至少10个字符。",
      "image_url": "https://example.com/image.jpg",
      "view_count": 0,
      "like_count": 0,
      "favorite_count": 0,
      "comment_count": 0,
      "status": "published",
      "created_at": "2024-01-02T10:30:00.000Z",
      "updated_at": "2024-01-02T10:30:00.000Z"
    }
  },
  "error": null
}
```

### 4. 更新帖子

更新已发布的帖子。

**接口地址**：

```
PUT /api/posts/:id
```

**请求头**：

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求体**：

```json
{
  "tagId": 2,
  "title": "更新后的标题",
  "content": "更新后的内容，至少要10个字符。",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**成功响应**：

```json
{
  "success": true,
  "message": "帖子更新成功",
  "data": {
    "post": {
      "id": 7,
      "user_id": 1,
      "tag_id": 2,
      "title": "更新后的标题",
      "content": "更新后的内容，至少要10个字符。",
      "image_url": "https://example.com/new-image.jpg",
      "view_count": 0,
      "like_count": 0,
      "favorite_count": 0,
      "comment_count": 0,
      "status": "published",
      "created_at": "2024-01-02T10:30:00.000Z",
      "updated_at": "2024-01-02T11:30:00.000Z"
    }
  },
  "error": null
}
```

### 5. 删除帖子

删除指定的帖子（软删除）。

**接口地址**：

```
DELETE /api/posts/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "帖子删除成功",
  "data": null,
  "error": null
}
```

---

## 评论相关接口

### 1. 获取帖子评论

获取指定帖子的所有评论。

**接口地址**：

```
GET /api/comments/post/:postId
```

**参数说明**：

- `:postId`：帖子ID

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "comments": [
      {
        "id": 1,
        "post_id": 1,
        "user_id": 2,
        "content": "666",
        "like_count": 3,
        "created_at": "2024-01-01T11:30:00.000Z",
        "author_name": "CSGO专家",
        "total_likes": 3
      }
    ]
  },
  "error": null
}
```

### 2. 发表评论

在指定帖子下发表评论。

**接口地址**：

```
POST /api/comments
```

**请求头**：

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**请求体**：

```json
{
  "postId": 1,
  "content": "这是一个测试评论"
}
```

**字段说明**：

- `postId`：帖子ID（必须）
- `content`：评论内容（1-500个字符）

**成功响应**：

```json
{
  "success": true,
  "message": "评论创建成功",
  "data": {
    "comment": {
      "id": 13,
      "post_id": 1,
      "user_id": 1,
      "content": "这是一个测试评论",
      "like_count": 0,
      "created_at": "2024-01-02T10:30:00.000Z"
    }
  },
  "error": null
}
```

### 3. 删除评论

删除指定的评论。

**接口地址**：

```
DELETE /api/comments/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "评论删除成功",
  "data": null,
  "error": null
}
```

---

## 标签相关接口

### 1. 获取所有标签

获取系统中所有的游戏标签。

**接口地址**：

```
GET /api/tags
```

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "tags": [
      {
        "id": 1,
        "tag_name": "Apex英雄"
      },
      {
        "id": 2,
        "tag_name": "CS:GO"
      },
      {
        "id": 3,
        "tag_name": "英雄联盟"
      },
      {
        "id": 4,
        "tag_name": "绝区零"
      }
    ]
  },
  "error": null
}
```

---

## 互动功能接口

### 1. 点赞帖子

点赞指定的帖子。

**接口地址**：

```
POST /api/likes/posts/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**参数说明**：

- `:id`：帖子ID

**成功响应**：

```json
{
  "success": true,
  "message": "点赞成功",
  "data": null,
  "error": null
}
```

**错误响应**（已点赞）：

```json
{
  "success": false,
  "message": "已经点赞过此帖子",
  "data": null,
  "error": "ALREADY_LIKED"
}
```

### 2. 取消点赞帖子

取消点赞指定的帖子。

**接口地址**：

```
DELETE /api/likes/posts/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "取消点赞成功",
  "data": null,
  "error": null
}
```

### 3. 点赞评论

点赞指定的评论。

**接口地址**：

```
POST /api/likes/comments/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "点赞成功",
  "data": null,
  "error": null
}
```

### 4. 取消点赞评论

取消点赞指定的评论。

**接口地址**：

```
DELETE /api/likes/comments/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "取消点赞成功",
  "data": null,
  "error": null
}
```

---

## 收藏功能接口

### 1. 收藏帖子

收藏指定的帖子。

**接口地址**：

```
POST /api/favorites/posts/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**参数说明**：

- `:id`：帖子ID

**成功响应**：

```json
{
  "success": true,
  "message": "收藏成功",
  "data": null,
  "error": null
}
```

**错误响应**（已收藏）：

```json
{
  "success": false,
  "message": "已经收藏过此帖子",
  "data": null,
  "error": "ALREADY_FAVORITED"
}
```

### 2. 取消收藏

取消收藏指定的帖子。

**接口地址**：

```
DELETE /api/favorites/posts/:id
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**成功响应**：

```json
{
  "success": true,
  "message": "取消收藏成功",
  "data": null,
  "error": null
}
```

### 3. 获取用户收藏列表

获取当前用户收藏的所有帖子。

**接口地址**：

```
GET /api/favorites/me
```

**请求头**：

```
Authorization: Bearer <your_jwt_token>
```

**查询参数**：

- `page`：页码（默认1）
- `limit`：每页数量（默认20）

**成功响应**：

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "favorites": [
      {
        "id": 1,
        "title": "联盟这么良心了?",
        "content": "新手任务送真实伤害吗",
        "image_url": "https://imgheybox1.max-c.com/bbs/2025/11/11/...",
        "view_count": 156,
        "like_count": 23,
        "favorite_count": 12,
        "comment_count": 8,
        "created_at": "2024-01-01T10:30:00.000Z",
        "author_name": "LOL大神",
        "game_tag": "英雄联盟",
        "total_likes": 23,
        "total_favorites": 12,
        "total_comments": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "has_more": false
    }
  },
  "error": null
}
```

---

## 错误码说明

| 错误码                | 说明             | HTTP状态码 |
| --------------------- | ---------------- | ---------- |
| NO_TOKEN              | 未提供访问令牌   | 401        |
| INVALID_TOKEN         | 无效的访问令牌   | 401        |
| INVALID_CREDENTIALS   | 手机号或密码错误 | 401        |
| ACCOUNT_BANNED        | 账号已被封禁     | 403        |
| PHONE_EXISTS          | 手机号已被注册   | 400        |
| USERNAME_EXISTS       | 用户名已被使用   | 400        |
| USER_NOT_FOUND        | 用户不存在       | 404        |
| POST_NOT_FOUND        | 帖子不存在       | 404        |
| COMMENT_NOT_FOUND     | 评论不存在       | 404        |
| TAG_NOT_FOUND         | 标签不存在       | 404        |
| PERMISSION_DENIED     | 权限不足         | 403        |
| ALREADY_LIKED         | 已经点赞过       | 400        |
| NOT_LIKED             | 未点赞           | 400        |
| ALREADY_FAVORITED     | 已经收藏过       | 400        |
| NOT_FAVORITED         | 未收藏           | 400        |
| CANNOT_FOLLOW_SELF    | 不能关注自己     | 400        |
| INTERNAL_SERVER_ERROR | 服务器内部错误   | 500        |

---

## 使用示例

### 完整的用户流程示例

1. **用户注册**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "16666666666",
    "username": "测试用户",
    "password": "123456"
  }'
```

2. **用户登录（保存token）**

```bash
# 登录并保存响应
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "16666666666",
    "password": "123456"
  }' > login_response.json

# 提取token
TOKEN=$(grep -o '"token":"[^"]*"' login_response.json | cut -d'"' -f4)
```

3. **发布帖子**

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tagId": 1,
    "title": "我的第一个帖子",
    "content": "这是我在小黑盒发布的第一篇帖子！",
    "imageUrl": "https://example.com/my-post.jpg"
  }'
```

4. **浏览帖子**

```bash
# 查看所有帖子
curl -X GET http://localhost:3000/api/posts

# 查看特定帖子
curl -X GET http://localhost:3000/api/posts/1

# 按标签筛选
curl -X GET "http://localhost:3000/api/posts?tag=1"
```

### 批量操作示例

```bash
#!/bin/bash
# 批量测试脚本

BASE_URL="http://localhost:3000/api"
TOKEN="your_jwt_token_here"

# 1. 获取标签
echo "=== 获取标签 ==="
curl -X GET "${BASE_URL}/tags"

# 2. 获取帖子列表
echo -e "\n=== 获取帖子列表 ==="
curl -X GET "${BASE_URL}/posts"

# 3. 获取用户信息
echo -e "\n=== 获取用户信息 ==="
curl -X GET "${BASE_URL}/users/1"

# 4. 点赞帖子（需要认证）
echo -e "\n=== 点赞帖子 ==="
curl -X POST "${BASE_URL}/likes/posts/1" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## 注意事项

1. **认证要求**：标有 🔒 的接口需要认证（Authorization头）
2. **参数验证**：所有参数都会进行验证，请确保提供正确的格式
3. **分页参数**：所有列表接口都支持分页，默认每页20条
4. **权重排序**：帖子列表按（浏览量×40% + 点赞量×60%）排序
5. **数据一致性**：点赞、收藏等操作会自动更新计数

## 技术支持

如果遇到问题：

1. 检查服务器是否正常运行
2. 查看API文档：`GET /api/docs`
3. 检查请求参数格式
4. 查看服务器日志获取详细错误信息

