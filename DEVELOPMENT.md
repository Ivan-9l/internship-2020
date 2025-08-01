# Development Guide

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- npm or yarn

## Project Structure

```
├── backend/              # Spring Boot API
│   ├── src/main/java/
│   │   └── com/example/webapp/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── model/          # JPA entities
│   │       ├── repository/     # Data repositories
│   │       └── security/       # Security configuration
│   ├── src/main/resources/
│   │   └── application.yml     # Application configuration
│   └── pom.xml                 # Maven dependencies
├── frontend/             # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/           # React contexts
│   │   ├── services/          # API services
│   │   └── types/            # TypeScript types
│   ├── package.json          # npm dependencies
│   └── tsconfig.json         # TypeScript configuration
└── docker-compose.yml    # Docker setup for development
```

## Running the Application

### Method 1: Local Development

#### Backend
```bash
cd backend
mvn spring-boot:run
```
The backend will start on http://localhost:8080

#### Frontend
```bash
cd frontend
npm install
npm start
```
The frontend will start on http://localhost:3000

### Method 2: Docker Compose

```bash
docker-compose up -d
```

## Default Credentials

The application comes with pre-configured users:

- **Admin User**: `admin` / `admin123`
- **Regular User**: `user` / `user123`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/search?keyword={keyword}` - Search tasks
- `GET /api/tasks/status/{status}` - Get tasks by status

## Database

The application uses H2 in-memory database for development. You can access the H2 console at:
http://localhost:8080/api/h2-console

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Features

### Backend Features
- **Spring Boot 3.x** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **H2 Database** for development
- **RESTful API** design
- **Input validation** with Bean Validation
- **CORS** configuration for frontend integration

### Frontend Features
- **React 18** with TypeScript
- **Material-UI** for modern UI components
- **Axios** for HTTP requests
- **React Router** for navigation
- **Context API** for state management
- **Responsive design** for mobile and desktop
- **Real-time updates** for task operations

### Security Features
- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- Protected API endpoints
- Automatic token refresh

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 (development) / PostgreSQL (production)
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: Emotion (CSS-in-JS)

## Development Tips

1. **Hot Reload**: Both backend and frontend support hot reload during development
2. **Debugging**: Use your IDE's debugger for the backend, and Chrome DevTools for the frontend
3. **API Testing**: Use tools like Postman or curl to test API endpoints
4. **Database**: Use H2 console to inspect database state during development

## Building for Production

### Backend
```bash
cd backend
mvn clean package
```

### Frontend
```bash
cd frontend
npm run build
```

The built application will be optimized for production deployment.