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
├── WallService (Business Logic)
├── AIModeratorAgentService (AI Agent)
├── Redis (Cache/Pub/Sub/Ranking)
└── PostgreSQL (Data)
```

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Docker & Docker Compose (optional)
- AWS CLI & credentials for Bedrock

### Local Development

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mood-wall
   ```

2. **Start dependencies with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment variables**
   ```bash
   export AWS_ACCESS_KEY_ID=your-key
   export AWS_SECRET_ACCESS_KEY=your-secret
   export AWS_REGION=us-east-1
   ```

4. **Run application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access endpoints**
   - API: http://localhost:8080/api/posts
   - WebSocket: ws://localhost:8080/ws
   - Actuator: http://localhost:8080/actuator/health

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