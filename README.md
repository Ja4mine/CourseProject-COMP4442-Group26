# Real-time Anonymous Mood Wall

A real-time, anonymous mood wall with AI moderation for university students.

## Features

- **Anonymous posting**: No login required, rate-limited by IP/user-agent hash
- **AI moderation**: Real-time content analysis, emotion tagging, witty replies
- **Real-time updates**: WebSocket push for new posts, likes, comments
- **Intelligent aggregation**: Hot topics, word clouds, post clustering
- **High performance**: Redis caching, Pub/Sub, rate limiting

## Tech Stack

- **Backend**: Spring Boot 3.3, Spring AI, WebSocket (STOMP)
- **Database**: PostgreSQL, Redis (ElastiCache)
- **AI**: AWS Bedrock (Claude 3.5 / Llama 3.1)
- **Infrastructure**: Docker, AWS Elastic Beanstalk, S3, CloudFront
- **Monitoring**: Spring Actuator, Prometheus, Grafana

## Architecture

```
User Browser → Spring Boot (EC2)
├── PostController (REST API)
├── WebSocketController (Real-time)
├── ClickAnalyticsController (Analytics API)
├── InteractionController (Interactions API)
├── PostCrudController (Admin CRUD API)
├── WallService (Business Logic)
├── AIModeratorAgentService (AI Agent)
├── Redis (Cache/Pub/Sub/Ranking)
└── PostgreSQL (Data)
```

## Getting Started

### Prerequisites
- Java 17+
- Docker & Docker Compose
- `curl` and `lsof` for local health checks and port checks
- DeepSeek API key if you want the AI comment service to run

### Local Development

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mood-wall
   ```

2. **Make scripts executable**
   ```bash
   chmod +x mvnw run.sh stop.sh
   ```

3. **Start the whole project**

   With AI comments enabled:
   ```bash
   export DEEPSEEK_API_KEY=your-key
   ./run.sh
   ```

   For basic UI/API testing without `ai-service`:
   ```bash
   SKIP_AI=1 ./run.sh
   ```

   The script will:
   - start Docker services: PostgreSQL, Redis, RabbitMQ, and Nginx
   - build the Maven modules with tests skipped
   - start `service-discovery`, `core-service`, optional `ai-service`, and `api-gateway`
   - write service logs and PID files under `logs/`
   - stop early if required ports are already in use

4. **Access endpoints**
   - Frontend: http://localhost
   - API: http://localhost:8080/api/posts
   - WebSocket: ws://localhost:8080/ws
   - Actuator: http://localhost:8080/actuator/health
   - Logs: `logs/*.log`

5. **Stop the project**
   ```bash
   ./stop.sh
   ```

   To stop and remove Docker Compose containers:
   ```bash
   ./stop.sh --down
   ```

   If a previous manual run left ports occupied, inspect them with:
   ```bash
   lsof -i :8080
   lsof -i :8081
   lsof -i :8082
   lsof -i :8761
   ```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: moodwall
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## API Documentation

### POST /api/posts
Create anonymous post.

**Headers:**
- `X-Anonymous-Id`: Generated hash from client

**Body:**
```json
{
  "content": "Final exams are killing me! 😫",
  "imageUrl": "optional-image-url"
}
```

### GET /api/posts
Get paginated approved posts.

### Analytics API

#### POST /api/analytics/post-click
Record a post click for ranking.

**Body:**
```json
{
  "postId": 123
}
```

#### POST /api/analytics/topic-click
Record a topic click for ranking.

**Body:**
```json
{
  "topic": "exams"
}
```

#### GET /api/analytics/top-posts
Get top posts ranking by click count.

**Query Parameters:**
- `limit`: Number of results (default: 10)

**Response:**
```json
[
  {
    "member": "post:123",
    "score": 42.0
  }
]
```

#### GET /api/analytics/top-topics
Get top topics ranking by click count.

**Query Parameters:**
- `limit`: Number of results (default: 10)

**Response:**
```json
[
  {
    "member": "exams",
    "score": 15.0
  }
]
```

#### DELETE /api/analytics/reset
Reset daily rankings.

### Interactions API

CRUD operations for post interactions (likes and comments).

#### GET /api/interactions
List all interactions.

**Response:**
```json
[
  {
    "id": 1,
    "post": { "id": 123, "content": "..." },
    "type": "LIKE",
    "userId": "user-hash-abc",
    "content": null,
    "createdAt": "2024-01-01T12:00:00"
  }
]
```

#### GET /api/interactions/{id}
Get interaction by ID.

**Path Parameters:**
- `id`: Interaction ID

#### POST /api/interactions
Create a new interaction (like or comment).

**Body:**
```json
{
  "postId": 123,
  "type": "COMMENT",
  "userId": "user-hash-abc",
  "content": "Great post!"
}
```

**Response:** Created interaction object.

#### PUT /api/interactions/{id}
Update an existing interaction.

**Path Parameters:**
- `id`: Interaction ID

**Body:**
```json
{
  "type": "COMMENT",
  "userId": "user-hash-abc",
  "content": "Updated comment"
}
```

**Response:** Updated interaction object.

#### DELETE /api/interactions/{id}
Delete an interaction.

**Path Parameters:**
- `id`: Interaction ID

#### GET /api/interactions/post/{postId}
Get all interactions for a specific post.

**Path Parameters:**
- `postId`: Post ID

**Response:** Array of interaction objects for the post.

### CRUD API

Admin CRUD operations for Post entity.

#### GET /api/crud/posts
List all posts.

**Response:**
```json
[
  {
    "id": 1,
    "content": "Final exams stress",
    "author": "anonymous123",
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  }
]
```

#### GET /api/crud/posts/{id}
Get post by ID.

**Path Parameters:**
- `id`: Post ID

**Response:** Post object.

#### POST /api/crud/posts
Create a new post.

**Body:**
```json
{
  "content": "Post content",
  "author": "author name"
}
```

**Response:** Created post object.

#### PUT /api/crud/posts/{id}
Update an existing post.

**Path Parameters:**
- `id`: Post ID

**Body:**
```json
{
  "content": "Updated content",
  "author": "Updated author"
}
```

**Response:** Updated post object.

#### DELETE /api/crud/posts/{id}
Delete a post.

**Path Parameters:**
- `id`: Post ID

### WebSocket Events

**Connect:** `ws://localhost:8080/ws`

**Subscribe:**
- `/topic/posts` - New posts
- `/topic/likes` - Like updates
- `/topic/comments` - New comments

**Send:**
- `/app/post.new` - Create post
- `/app/post.like` - Like post
- `/app/post.comment` - Comment on post

## AI Agent Features

The AI Moderator Agent performs:
1. **Content moderation**: Filters inappropriate content
2. **Emotion tagging**: Detects mood (stress, joy, frustration)
3. **Witty replies**: Generates engaging responses
4. **Topic clustering**: Groups similar posts
5. **Hot topic summarization**: Daily trend reports

## Deployment

### AWS Elastic Beanstalk
```bash
mvn clean package
eb init
eb create mood-wall-env
eb deploy
```

### Docker
```bash
docker build -t mood-wall .
docker run -p 8080:8080 mood-wall
```

## Project Structure

```
src/main/java/com/polyu/moodwall/
├── MoodWallApplication.java
├── config/           # Configuration classes
├── controller/       # REST & WebSocket controllers
├── entity/          # JPA entities
├── repository/      # Spring Data repositories
├── service/         # Business logic & AI agents
├── dto/             # Data transfer objects
└── util/            # Utilities
```

## License

MIT