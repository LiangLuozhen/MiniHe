#  MiniHE 2.0 数据库文档

## 数据库概述

小黑盒 MiniHE 2.0 是一个基于 Node.js + MySQL 的游戏社区平台数据库。数据库设计简洁高效，包含用户管理、内容发布、社交互动等核心功能。

## 数据库结构

数据库共包含 **7个核心数据表**：

### 1. 用户表 (users)
存储用户基本信息。

| 字段名     | 数据类型                 | 约束                       | 说明             |
| ---------- | ------------------------ | -------------------------- | ---------------- |
| id         | INT                      | PRIMARY KEY AUTO_INCREMENT | 用户ID，主键     |
| phone      | VARCHAR(20)              | UNIQUE NOT NULL            | 手机号，用于登录 |
| username   | VARCHAR(50)              | NOT NULL                   | 用户昵称         |
| password   | VARCHAR(255)             | NOT NULL                   | 密码（明文存储） |
| created_at | TIMESTAMP                | DEFAULT CURRENT_TIMESTAMP  | 注册时间         |
| status     | ENUM('active', 'banned') | DEFAULT 'active'           | 用户状态         |

**索引**：
- `idx_users_phone` - 手机号索引
- `idx_users_username` - 用户名索引

---

### 2. 游戏标签表 (game_tags)
预定义的游戏分类标签。

| 字段名   | 数据类型    | 约束                       | 说明         |
| -------- | ----------- | -------------------------- | ------------ |
| id       | INT         | PRIMARY KEY AUTO_INCREMENT | 标签ID，主键 |
| tag_name | VARCHAR(50) | UNIQUE NOT NULL            | 标签名称     |

**当前标签数据**：
| ID   | 标签名称 |
| ---- | -------- |
| 1    | Apex英雄 |
| 2    | CS:GO    |
| 3    | 英雄联盟 |
| 4    | 绝区零   |

---

### 帖子表 (posts)
存储用户发布的帖子信息。

| 字段名         | 数据类型                     | 约束                        | 说明         |
| -------------- | ---------------------------- | --------------------------- | ------------ |
| id             | INT                          | PRIMARY KEY AUTO_INCREMENT  | 帖子ID，主键 |
| user_id        | INT                          | NOT NULL, FOREIGN KEY       | 发布者ID     |
| tag_id         | INT                          | NOT NULL, FOREIGN KEY       | 游戏标签ID   |
| title          | VARCHAR(200)                 | NOT NULL                    | 帖子标题     |
| content        | TEXT                         | NOT NULL                    | 帖子内容     |
| image_url      | VARCHAR(500)                 | -                           | 帖子图片URL  |
| view_count     | INT                          | DEFAULT 0                   | 浏览量       |
| like_count     | INT                          | DEFAULT 0                   | 点赞数       |
| favorite_count | INT                          | DEFAULT 0                   | 收藏数       |
| comment_count  | INT                          | DEFAULT 0                   | 评论数       |
| status         | ENUM('published', 'deleted') | DEFAULT 'published'         | 帖子状态     |
| created_at     | TIMESTAMP                    | DEFAULT CURRENT_TIMESTAMP   | 发布时间     |
| updated_at     | TIMESTAMP                    | ON UPDATE CURRENT_TIMESTAMP | 更新时间     |

**外键约束**：
- `user_id` → `users(id)` ON DELETE CASCADE
- `tag_id` → `game_tags(id)` ON DELETE CASCADE

**索引**：
- `idx_posts_user_id` - 用户ID索引
- `idx_posts_tag_id` - 标签ID索引
- `idx_posts_created_at` - 创建时间索引
- `idx_posts_status` - 状态索引
- `idx_posts_hot` - 热度复合索引（like_count, favorite_count, view_count）

---

### 4. 评论表 (comments)
存储帖子的评论信息（单层评论结构）。

| 字段名     | 数据类型  | 约束                       | 说明         |
| ---------- | --------- | -------------------------- | ------------ |
| id         | INT       | PRIMARY KEY AUTO_INCREMENT | 评论ID，主键 |
| post_id    | INT       | NOT NULL, FOREIGN KEY      | 所属帖子ID   |
| user_id    | INT       | NOT NULL, FOREIGN KEY      | 评论者ID     |
| content    | TEXT      | NOT NULL                   | 评论内容     |
| like_count | INT       | DEFAULT 0                  | 点赞数       |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 评论时间     |

**外键约束**：
- `post_id` → `posts(id)` ON DELETE CASCADE
- `user_id` → `users(id)` ON DELETE CASCADE

**索引**：
- `idx_comments_post_id` - 帖子ID索引
- `idx_comments_user_id` - 用户ID索引

---

### 5. 点赞表 (likes)
统一管理帖子和评论的点赞关系。

| 字段名     | 数据类型  | 约束                       | 说明         |
| ---------- | --------- | -------------------------- | ------------ |
| id         | INT       | PRIMARY KEY AUTO_INCREMENT | 点赞ID，主键 |
| user_id    | INT       | NOT NULL, FOREIGN KEY      | 点赞用户ID   |
| post_id    | INT       | NULL                       | 点赞的帖子ID |
| comment_id | INT       | NULL                       | 点赞的评论ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 点赞时间     |

**外键约束**：
- `user_id` → `users(id)` ON DELETE CASCADE
- `post_id` → `posts(id)` ON DELETE CASCADE
- `comment_id` → `comments(id)` ON DELETE CASCADE

**约束**：
- `post_id` 和 `comment_id` 至少有一个不为空

**索引**：
- `idx_likes_user_post` - 用户-帖子点赞索引
- `idx_likes_user_comment` - 用户-评论点赞索引

---

### 6. 收藏表 (favorites)
存储用户收藏帖子的关系。

| 字段名     | 数据类型  | 约束                       | 说明           |
| ---------- | --------- | -------------------------- | -------------- |
| id         | INT       | PRIMARY KEY AUTO_INCREMENT | 收藏ID，主键   |
| user_id    | INT       | NOT NULL, FOREIGN KEY      | 收藏用户ID     |
| post_id    | INT       | NOT NULL, FOREIGN KEY      | 被收藏的帖子ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 收藏时间       |

**外键约束**：
- `user_id` → `users(id)` ON DELETE CASCADE
- `post_id` → `posts(id)` ON DELETE CASCADE

**唯一约束**：
- `unique_user_favorite` - 防止用户重复收藏同一帖子

**索引**：
- `idx_favorites_user_id` - 用户ID索引
- `idx_favorites_post_id` - 帖子ID索引

---

### 7. 关注表 (follows)
存储用户之间的关注关系。

| 字段名       | 数据类型  | 约束                       | 说明         |
| ------------ | --------- | -------------------------- | ------------ |
| id           | INT       | PRIMARY KEY AUTO_INCREMENT | 关注ID，主键 |
| follower_id  | INT       | NOT NULL, FOREIGN KEY      | 关注者ID     |
| following_id | INT       | NOT NULL, FOREIGN KEY      | 被关注者ID   |
| created_at   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | 关注时间     |

**外键约束**：

- `follower_id` → `users(id)` ON DELETE CASCADE
- `following_id` → `users(id)` ON DELETE CASCADE

**唯一约束**：
- `unique_follow` - 防止重复关注

**索引**：
- `idx_follows_follower` - 关注者索引
- `idx_follows_following` - 被关注者索引

---

## 表关系图

```
用户表 (users)
│
├─┬── 帖子表 (posts) ── 游戏标签表 (game_tags)
│ │
│ ├── 评论表 (comments)
│ │   └── 点赞表 (likes) [评论点赞]
│ │
│ ├── 点赞表 (likes) [帖子点赞]
│ │
│ └── 收藏表 (favorites)
│
└─┬── 关注表 (follows) ── 用户表 (users) [自关联]
  │
  └── 关注表 (follows) ── 用户表 (users) [自关联]
```

## 测试数据概览

### 用户数据（5个用户）
| ID   | 手机号      | 用户名     | 密码   |
| ---- | ----------- | ---------- | ------ |
| 1    | 11111111111 | LOL大神    | 123456 |
| 2    | 22222222222 | CSGO专家   | 123456 |
| 3    | 33333333333 | Apex猎杀   | 123456 |
| 4    | 44444444444 | 绝区零玩家 | 123456 |
| 5    | 55555555555 | 全能游戏王 | 123456 |

### 帖子数据（6个帖子）
| ID   | 标题                             | 作者       | 标签     | 图片URL    |
| ---- | -------------------------------- | ---------- | -------- | ---------- |
| 1    | 联盟这么良心了?                  | LOL大神    | 英雄联盟 | [图片链接] |
| 2    | cs每周掉落                       | CSGO专家   | CS:GO    | [图片链接] |
| 3    | 世界名画                         | Apex猎杀   | Apex英雄 | [图片链接] |
| 4    | T _ T                            | 绝区零玩家 | 绝区零   | [图片链接] |
| 5    | 英雄联盟那么恐怖？！             | 全能游戏王 | 英雄联盟 | [图片链接] |
| 6    | 想入坑电脑moba，是选lol还是dota2 | LOL大神    | 英雄联盟 | [图片链接] |

### 关注关系网络
- 用户1（LOL大神）：4个粉丝，关注4人
- 用户2（CSGO专家）：3个粉丝，关注3人
- 用户3（Apex猎杀）：3个粉丝，关注3人
- 用户4（绝区零玩家）：2个粉丝，关注3人
- 用户5（全能游戏王）：2个粉丝，关注3人

##  注意事项

1. **明文密码**：当前为课堂作业，密码明文存储，生产环境必须加密
2. **数据一致性**：应用层需要保证点赞、收藏等操作的原子性
3. **并发控制**：高并发场景下需考虑乐观锁或事务处理
4. **图片存储**：当前使用URL存储，实际项目需考虑图片上传和CDN分发

---

此数据库设计为小黑盒 MiniHE 2.0 的核心数据存储方案，已为后续的 Node.js API 开发提供了完整的数据基础。