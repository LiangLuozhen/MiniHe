-- 插入指定的游戏标签数据
INSERT INTO game_tags (tag_name) VALUES
('Apex英雄'),
('CS:GO'),
('英雄联盟'),
('绝区零');

-- ========================================
-- 1. 插入用户数据（5个用户）
-- ========================================
INSERT INTO users (phone, username, password) VALUES
('11111111111', 'LOL大神', '123456'),
('22222222222', 'CSGO专家', '123456'),
('33333333333', 'Apex猎杀', '123456'),
('44444444444', '绝区零玩家', '123456'),
('55555555555', '全能游戏王', '123456');

-- ========================================
-- 2. 插入帖子数据（每个用户发1-2个帖子）
-- ========================================
-- 用户1（LOL大神）发帖（英雄联盟标签）
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(1, 3, '联盟这么良心了?', '新手任务送真实伤害吗', 'https://imgheybox1.max-c.com/bbs/2025/11/11/9275c2b5b1d531737e13b94533b0848a/thumb.jpeg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 156, 23, 12, 8);

-- 用户2（CSGO专家）发帖（CS:GO标签）
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(2, 2, 'cs每周掉落', '萌新第一次掉这种，选哪个好啊', 'https://imgheybox1.max-c.com/bbs/2025/08/15/5f086651d1a9c8888ec4359c40eb1964/thumb.jpeg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 89, 15, 7, 5);

-- 用户3（Apex猎杀者）发帖（Apex英雄标签）
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(3, 1, '世界名画', '眼睛尿尿了', 'https://imgheybox1.max-c.com/bbs/2025/06/14/d04e8a043b7451234fdd119fed8d092a/thumb.jpeg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 124, 18, 9, 6);

-- 用户4（绝区零玩家）发帖（绝区零标签）
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(4, 4, 'T _ T', '不帮一下？', 'https://imgheybox1.max-c.com/web/bbs/2025/11/03/528dd6307d0bd568d4dc29de8d89dfca/thumb.png?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 98, 22, 11, 7);

-- 用户5（全能游戏王）发帖（英雄联盟标签）
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(5, 3, '英雄联盟那么恐怖？！', '不都说LOL要凉了吗？为什么这种热度榜还是榜首啊', 'https://imgheybox1.max-c.com/bbs/2025/09/09/8364cbcea6ce0218245ec59ca3704101/thumb.jpeg?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 142, 19, 8, 4);

-- 用户1（LOL大神）发第二个帖子
INSERT INTO posts (user_id, tag_id, title, content, image_url, view_count, like_count, favorite_count, comment_count) VALUES
(1, 3, '想入坑电脑moba，是选lol还是dota2', '如题', 'https://imgheybox1.max-c.com/bbs/2025/08/29/fadcb7890c007761deab6277ae1df0c4/thumb.png?imageMogr2/format/webp/quality/50/auto-orient/ignore-error/1', 67, 12, 4, 3);

-- ========================================
-- 3. 插入关注数据（建立关注关系）
-- ========================================
-- 用户2关注用户1
INSERT INTO follows (follower_id, following_id) VALUES (2, 1);
-- 用户3关注用户1
INSERT INTO follows (follower_id, following_id) VALUES (3, 1);
-- 用户4关注用户1
INSERT INTO follows (follower_id, following_id) VALUES (4, 1);
-- 用户5关注用户1
INSERT INTO follows (follower_id, following_id) VALUES (5, 1);

-- 用户1关注用户2
INSERT INTO follows (follower_id, following_id) VALUES (1, 2);
-- 用户3关注用户2
INSERT INTO follows (follower_id, following_id) VALUES (3, 2);
-- 用户4关注用户2
INSERT INTO follows (follower_id, following_id) VALUES (4, 2);

-- 用户1关注用户3
INSERT INTO follows (follower_id, following_id) VALUES (1, 3);
-- 用户2关注用户3
INSERT INTO follows (follower_id, following_id) VALUES (2, 3);
-- 用户5关注用户3
INSERT INTO follows (follower_id, following_id) VALUES (5, 3);

-- 用户1关注用户4
INSERT INTO follows (follower_id, following_id) VALUES (1, 4);
-- 用户3关注用户4
INSERT INTO follows (follower_id, following_id) VALUES (3, 4);

-- 用户2关注用户5
INSERT INTO follows (follower_id, following_id) VALUES (2, 5);
-- 用户4关注用户5
INSERT INTO follows (follower_id, following_id) VALUES (4, 5);

-- ========================================
-- 4. 插入评论数据（帖子的评论）
-- ========================================
-- 帖子1的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(1, 2, '666', 3),
(1, 3, 'nb', 2),
(1, 5, '沙发', 1);

-- 帖子2的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(2, 1, '第一', 4),
(2, 4, '沙发', 2);

-- 帖子3的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(3, 1, '牛逼', 3),
(3, 2, '第一', 2),
(3, 5, '第一', 1);

-- 帖子4的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(4, 1, 'O .O', 2),
(4, 3, '楼顶', 1),
(4, 5, '第一', 1);

-- 帖子5的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(5, 3, '到此一游', 1),
(5, 4, '第一', 0);

-- 帖子6的评论
INSERT INTO comments (post_id, user_id, content, like_count) VALUES
(6, 2, '问问盒友', 1);

-- ========================================
-- 5. 插入点赞数据（帖子点赞和评论点赞）
-- ========================================
-- 帖子点赞
-- 帖子1的点赞（被多个用户点赞）
INSERT INTO likes (user_id, post_id) VALUES (2, 1), (3, 1), (4, 1), (5, 1);
-- 帖子2的点赞
INSERT INTO likes (user_id, post_id) VALUES (1, 2), (3, 2), (5, 2);
-- 帖子3的点赞
INSERT INTO likes (user_id, post_id) VALUES (1, 3), (2, 3), (4, 3), (5, 3);
-- 帖子4的点赞
INSERT INTO likes (user_id, post_id) VALUES (1, 4), (2, 4), (3, 4), (5, 4);
-- 帖子5的点赞
INSERT INTO likes (user_id, post_id) VALUES (1, 5), (4, 5);
-- 帖子6的点赞
INSERT INTO likes (user_id, post_id) VALUES (2, 6), (3, 6);

-- 评论点赞
-- 评论1的点赞
INSERT INTO likes (user_id, comment_id) VALUES (1, 1), (4, 1), (5, 1);
-- 评论2的点赞
INSERT INTO likes (user_id, comment_id) VALUES (1, 2), (4, 2);
-- 评论3的点赞
INSERT INTO likes (user_id, comment_id) VALUES (2, 3);
-- 评论4的点赞
INSERT INTO likes (user_id, comment_id) VALUES (2, 4), (3, 4), (4, 4), (5, 4);
-- 评论5的点赞
INSERT INTO likes (user_id, comment_id) VALUES (1, 5), (2, 5), (5, 5);

-- ========================================
-- 6. 插入收藏数据（用户收藏帖子）
-- ========================================
-- 用户2收藏帖子1
INSERT INTO favorites (user_id, post_id) VALUES (2, 1);
-- 用户3收藏帖子1
INSERT INTO favorites (user_id, post_id) VALUES (3, 1);
-- 用户5收藏帖子1
INSERT INTO favorites (user_id, post_id) VALUES (5, 1);
-- 用户1收藏帖子2
INSERT INTO favorites (user_id, post_id) VALUES (1, 2);
-- 用户4收藏帖子2
INSERT INTO favorites (user_id, post_id) VALUES (4, 2);
-- 用户1收藏帖子3
INSERT INTO favorites (user_id, post_id) VALUES (1, 3);
-- 用户2收藏帖子3
INSERT INTO favorites (user_id, post_id) VALUES (2, 3);
-- 用户5收藏帖子3
INSERT INTO favorites (user_id, post_id) VALUES (5, 3);
-- 用户1收藏帖子5
INSERT INTO favorites (user_id, post_id) VALUES (1, 5);
-- 用户2收藏帖子5
INSERT INTO favorites (user_id, post_id) VALUES (2, 5);
-- 用户3收藏帖子4
INSERT INTO favorites (user_id, post_id) VALUES (3, 4);
-- 用户4收藏帖子4
INSERT INTO favorites (user_id, post_id) VALUES (4, 4);