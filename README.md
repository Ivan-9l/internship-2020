# Modern Web Application

A full-stack web application built with Java Spring Boot backend and React frontend.

## Architecture

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: H2 (development) / PostgreSQL (production)
- **Security**: Spring Security
- **Build Tool**: Maven

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure
```
├── backend/          # Spring Boot application
├── frontend/         # React application
└── docker-compose.yml # For easy development setup
```

## Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The backend will run on http://localhost:8080
The frontend will run on http://localhost:3000 
