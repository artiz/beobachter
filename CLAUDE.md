# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Beobachter is a full-stack application built with FastAPI (Python) for the backend and React (TypeScript) for the frontend. The application provides user authentication, real-time system monitoring via WebSockets, and metrics collection using Redis TimeSeries.

## Architecture
- **Backend**: FastAPI with SQLAlchemy (async mode), Alembic for migrations, Celery for task management
- **Frontend**: React 17 with TypeScript, React Router, Tailwind CSS
- **Database**: PostgreSQL
- **Caching/Messaging**: Redis for PubSub and TimeSeries data
- **Deployment**: Docker Compose for development environment

## Key Components
1. **Authentication System**: JWT-based auth with token refresh mechanism
2. **Real-time Metrics**: WebSocket connections for live system metrics
3. **Async Database Access**: Using SQLAlchemy with async support
4. **Task Scheduling**: Celery + Beat for periodic tasks
5. **Frontend Components**: React components with TypeScript and Tailwind CSS

## Development Commands

### Docker Setup
```bash
# Initial setup - build and start containers, run migrations
docker-compose build
docker-compose run backend alembic upgrade head
docker-compose run backend python app/initial_data.py
docker-compose up -d

# Access the application
# Frontend: http://localhost:8000
# API docs: http://localhost:8000/api/docs

# Stop and remove containers
docker-compose down --remove-orphans
```

### Backend Commands
```bash
# Run the entire test suite
docker-compose run backend pytest

# Run a specific test file
docker-compose run backend pytest app/tests/test_main.py

# Run a specific test function
docker-compose run backend pytest app/api/base/routers/tests/test_auth.py::test_login

# Run linting
docker-compose run backend black ./backend --line-length 120

# Generate migrations
docker-compose run backend alembic revision -m "your_migration_description"
```

### Frontend Commands
```bash
# Inside frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test
npm run test:all  # Run all tests without watch mode

# Build for production
npm run build

# Build Tailwind components
npm run build:thailwind
```

### Project Scripts
```bash
# Build and setup the entire project
./scripts/build.sh

# Run backend tests
./scripts/test_backend.sh

# Run all tests (backend and frontend)
./scripts/test.sh

# Check code coverage
./scripts/cov_backend.sh

# Run linting
./scripts/lint_backend.sh
```

## Common Development Patterns

### Backend
1. **Adding a new API endpoint**:
   - Define in appropriate file under app/api/base/routers/
   - Register in app/main.py if needed
   - Add authentication with Depends(get_current_active_user) as needed

2. **Database operations**:
   - Use async SQLAlchemy patterns in app/db/crud.py
   - Define models in app/db/models.py
   - Use Alembic for migrations

3. **Scheduled tasks**:
   - Define in app/tasks.py
   - Register with celery_app
   - For periodic tasks, use setup_periodic_tasks

### Frontend
1. **Adding a new page**:
   - Create component in src/pages/
   - Add route in src/App.tsx
   - For protected routes, use AuthRoute component

2. **API interactions**:
   - Use APIClient methods from src/core/api/client.ts
   - Handle authentication with useAuthStatus hook
   - Handle errors and notifications with useAppNotifier hook

3. **WebSocket connections**:
   - Use useWebsocket hook for real-time data
   - See metrics implementation as an example

## Important Files to Understand
- Backend entrypoint: `/backend/app/main.py`
- Config: `/backend/app/core/config.py`
- Frontend routes: `/frontend/src/App.tsx`
- API client: `/frontend/src/core/api/client.ts`
- Authentication: `/backend/app/core/net/auth.py` and `/frontend/src/core/hooks/useAuthStatus.ts`
- WebSockets: `/backend/app/core/net/websocket.py` and `/frontend/src/core/hooks/useWebsocket.ts`
- Metrics: `/backend/app/core/metrics/performance.py` and `/frontend/src/core/metrics/usePerfMetricsState.ts`