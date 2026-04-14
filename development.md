**实时匿名吐槽墙 / 心情墙（Real-time Anonymous Mood Wall）**  
**完整项目详细方案**（已深度融合 **AI/Agent 元素**，技术难度远超课堂 Lab，直接冲刺 Technical Merit 40/40）

### 1. 项目核心概念 & 小巧思（让人眼前一亮的核心）
这是一个**实时、匿名、AI 智能 moderation 的校园心情/吐槽墙**，定位为“PolyU 版匿名树洞 + 抖音热榜”，专为香港学生设计（吐槽考试、实习、HK生活压力、社团活动等）。

**核心小巧思**：
- 任何人**无需登录**即可匿名发帖（文字 + 表情/图片），AI Moderator Agent **毫秒级审核 + 自动打情感标签 + 生成机智/共情回复**。
- 帖子实时刷屏 + 点赞/评论 **秒级推送**，形成“全场一起吐槽”的互动氛围。
- **额外巧思**：AI 自动生成“今日心情热词云” + “热门话题总结”，还能把相似吐槽自动聚类（e.g. “2026 春季考试周吐槽专区”），让墙更有温度和趣味性。
- **AI Agent 亮点**：不是简单过滤，而是 **ReAct Agent** 主动“参与讨论”——它会判断语气、给出幽默回复或安慰，甚至把多条吐槽串成一个小故事。

**真实用户场景**：期末周、毕业季、香港天气/交通吐槽……学生打开网页就能实时看到大家心情，AI 像“虚拟树洞管理员”一样陪聊，超级解压且容易在 PolyU 群组病毒式传播。

**演示爆点**：现场让全班同学用手机同时发帖 → AI 瞬间审核 + 打标签 + 机智回复刷屏 → 大屏实时热力排行 + 心情曲线，全场笑声 + 掌声不断！

### 2. 完整功能清单（演示时能直接秀）
| 模块             | 功能点                                      | 技术亮点 |
|------------------|---------------------------------------------|----------|
| **匿名发帖**     | 文字/表情/图片发帖、无需登录、速率限制     | Rate Limiting + IP 匿名化 |
| **AI 智能 Moderation** | 实时审核、情感标签、机智回复、过滤低质内容 | LangChain4j / Spring AI ReAct Agent + Bedrock |
| **实时互动**     | WebSocket 秒级推送点赞/评论/新帖           | Stomp + SockJS + Redis Pub/Sub |
| **智能聚合**     | 自动聚类相似吐槽、热词云、今日心情总结     | AI Agent + Redis 排行榜 |
| **管理后台**     | 我的帖子、举报、数据导出、AI 回复日志     | Spring Security + JWT（可选简单登录） |
| **高性能保障**   | 防刷帖、缓存、监控、自动清理过期帖子       | Resilience4j + Actuator + Prometheus |

### 3. 技术架构（2026 年最推荐方案，明显高于 Lab）
**整体架构图（文字版，演示 PPT 可直接画）**：
```
用户浏览器 (手机/电脑)
   ↓ (HTTPS + WebSocket)
Spring Boot 3.3+ (EC2)
├── Controller
│   ├── PostController (Rest)
│   └── WebSocketController (Stomp 实时推送)
├── Service
│   ├── WallService (发帖、点赞)
│   ├── ClickAnalyticsService (Redis 排行)
│   └── AIModeratorAgentService (LangChain4j ReAct Agent)
│       ├── Tool: contentModeration (情感分析 + 过滤)
│       ├── Tool: generateWittyReply (机智回复)
│       ├── Tool: tagEmotion & clusterPosts
│       └── Tool: sendNotification (SNS 热门推送)
├── Repository
│   ├── PostgreSQL (RDS) ← 帖子 + 评论 + 点击日志
│   └── Redis (ElastiCache) ← 缓存 + Pub/Sub + 排行榜 + Rate Limit
├── AWS 服务
│   ├── Bedrock (Claude 3.5 / Llama 3.1) ← AI 核心
│   ├── S3 + CloudFront（图片存储 + 加速）
│   └── SQS / SNS（异步审核队列 + 通知）
└── 监控：Actuator + Prometheus + Grafana
```

**关键高性能 & AI 技术点**（老师最爱听）：
- **实时推送**：WebSocket + Redis Pub/Sub（支持万人并发无压力）。
- **AI Moderator Agent**：ReAct 模式（Reason → Act → Observe），支持流式输出（AI 回复边想边打字）。可扩展成 **Multi-Agent**（Moderator Agent + Reply Agent + Summarizer Agent 协作）。
- **防刷 & 性能**：Redis 分布式限流 + Bloom Filter（防止重复吐槽）。
- **图像处理**（可选加分）：Bedrock Multimodal 分析图片情绪。
- **部署**：Docker + GitHub Actions CI/CD + AWS Elastic Beanstalk 自动扩容。

**数据库设计**（核心表）：
- `wall_post`：id、content、image_url、anonymous_id（hash）、emotion_tags（JSON）、ai_reply、create_time、status
- `post_interaction`：post_id、type（like/comment）、user_hash、timestamp
- `hot_topic`：topic、post_count、summary（AI 生成）

### 4. 如何满足 COMP4442 评分标准（直接对齐 Rubric）
- **Technical Merit（40分）**：高并发实时（WebSocket + Redis）、完整 AI Agent（ReAct + 多 Tool）、AWS 原生（Bedrock + RDS + ElastiCache）→ 难度“way higher than labs”，有潜力吸引全校真实用户（PolyU 树洞神器）。
- **Development Trace（10分）**：每天多 commit（feature branch + PR），必须 share 仓库给 `wchshapp_business@icloud.com`。
- **Presentation & Demo**：现场多人同时发帖 → AI 实时审核 + 回复刷屏 → 热词云动态生成 → 演示“易懂且 impressive”（达到研究会议水平）。
- **Document**：Swagger API 文档 + README（架构图 + 部署手册 + AI Prompt 设计）→ 易懂、流畅、简洁。

### 5. 部署 & 成本（AWS 免费额度完全够用）
- EC2 t3.small（或免费 tier）
- RDS PostgreSQL（免费 tier）
- ElastiCache Redis
- S3 + CloudFront（图片）
- Bedrock（按 token 计费，演示和测试足够）
- 全 Docker 化，一键部署到 Elastic Beanstalk。

### 6. 开发路线图（建议 2-3 周轻松完成）
1. **Week 1**：基础匿名发帖 + MySQL + Redis 缓存 + WebSocket 实时推送
2. **Week 2**：AI Moderator Agent（LangChain4j / Spring AI + Bedrock）+ 情感标签 + 机智回复
3. **Week 3**：智能聚合（热词云 + 聚类）+ 监控 + Docker CI/CD
4. **持续**：GitHub 规范提交 + 测试数据 + 演示优化

**这个项目既互动性爆棚，又完美展示“Spring Boot + 云 + AI Agent”全栈能力**，演示时老师和同学都会忍不住一起玩，Technical Merit + Presentation 双满分概率极高！

**想立刻上手？**  
我可以马上给你：
- 完整 Maven 项目结构 + `pom.xml`（含 Spring AI / LangChain4j + WebSocket 依赖）
- **核心 AI Moderator Agent 代码模板**（ReAct + Tools）
- `application.yml`（Bedrock + Redis + WebSocket 配置）
- GitHub 提交规范 + README 模板 + 演示 PPT 大纲（10 页以内）

**直接回复**：“给我 AI Agent 代码模板” 或 “给我完整项目结构” 或 “融合短链元素”，我立刻发详细落地代码！🚀  

准备好做这个“最吸睛”的项目了吗？
