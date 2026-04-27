# Sajjan Matrimony

A production-ready matrimony platform built exclusively for the Sajjan community.

## Project Structure

```
sajjanmatrimony/
├── backend/          # Spring Boot 3.x + MongoDB REST API
├── mobile-app/       # React Native (Expo) mobile application
├── admin-panel/      # React web admin dashboard
├── docs/             # Architecture diagrams & API documentation
└── postman/          # Postman collection for API testing
```

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Backend      | Java 17, Spring Boot 3.x            |
| Database     | MongoDB                             |
| Mobile App   | React Native (Expo)                 |
| Admin Panel  | React (Vite)                        |
| Auth         | JWT (Access + Refresh tokens)       |
| File Upload  | Multipart / local storage (Phase 1) |
| Deployment   | Docker + docker-compose             |

## Phases

| Phase | Description           | Status  |
|-------|-----------------------|---------|
| 1     | Project Setup         | Done    |
| 2     | Backend (Spring Boot) | Pending |
| 3     | Postman Collection    | Pending |
| 4     | React Native App      | Pending |
| 5     | Admin Panel           | Pending |
| 6     | Deployment            | Pending |

## Quick Start

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Mobile App
```bash
cd mobile-app
npm install
npx expo start
```

### Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```

### Full Stack (Docker)
```bash
docker-compose up --build
```

## Environment Variables

Copy `.env.example` to `.env` in each module and fill in values before running.

## Core Features

- User registration & JWT login
- Matrimonial profile creation with hybrid data model
- Photo upload
- Profile search & advanced filters
- Express / accept / reject interest
- Shortlist profiles
- Basic contact request flow
- Admin approval workflow
- Block & report users
- Subscription plan placeholder
- Multi-language ready (English + Kannada)

## License

Private - Sajjan Community Use Only
