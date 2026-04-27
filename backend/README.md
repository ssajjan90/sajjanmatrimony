# Sajjan Matrimony - Backend

Spring Boot 3.x REST API backed by MongoDB.

## Prerequisites

- Java 17+
- Maven 3.8+
- MongoDB 6+ (or Docker)

## Running Locally

```bash
mongod --dbpath /data/db
mvn spring-boot:run
```

Server: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

## Package Structure

```
com.sajjanmatrimony/
├── config/
├── controller/
├── dto/
│   ├── request/
│   └── response/
├── entity/
├── exception/
├── mapper/
├── repository/
├── security/
├── service/
│   └── impl/
└── util/
```

## Environment Variables

| Variable              | Default                   | Description                 |
|-----------------------|---------------------------|-----------------------------|
| MONGO_URI             | mongodb://localhost:27017 | MongoDB connection string   |
| MONGO_DB              | sajjanmatrimony           | Database name               |
| JWT_SECRET            | -                         | HS256 secret (min 32 chars) |
| JWT_EXPIRY_MS         | 86400000                  | Access token TTL (ms)       |
| JWT_REFRESH_EXPIRY_MS | 604800000                 | Refresh token TTL (ms)      |
| SERVER_PORT           | 8080                      | HTTP port                   |
| UPLOAD_DIR            | uploads/                  | Profile photo storage path  |
