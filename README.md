# Beobachter [FastAPI + React]
[![build](https://github.com/artiz/beobachter/actions/workflows/build.yml/badge.svg)](https://github.com/artiz/beobachter/actions/workflows/build.yml)

<div>
    <img src="assets/fastapi-logo.png" alt="fastapi-logo" height="64" />
    <img src="assets/postgres-logo.png" alt="react-logo" height="64" /> 
    <img src="assets/sql-alchemy-logo.png" alt="sql-alchemy" height="64" />
    <img src="assets/react-logo.png" alt="react-logo" height="64" />
    <img src="assets/typescript-logo.png" alt="react-logo" height="64" /> 
</div>

--------------------------------------------------------------------------------------------------

Backend/scripts based on [`cookiecutter fastapi-react`](https://github.com/Buuntu/fastapi-react) 


## Features

- **FastAPI** with Python 3.9
- **React 17**
- create-react-app with Typescript
- Postgres
- SqlAlchemy with Alembic for migrations
- Pytest for backend tests
- Docker compose for easier development
- Nginx as a reverse proxy to allow backend and frontend on the same port

## Development

The only dependencies for this project should be docker and docker-compose.

### Quick Start

Starting the project with hot-reloading enabled
(the first time it will take a while):

```bash
docker-compose run backend alembic upgrade head
docker-compose run backend python app/initial_data.py
docker-compose up -d
```


And navigate to http://localhost:8000

_Note: If you see an Nginx error at first with a `502: Bad Gateway` page, you may have to wait for webpack to build the development server (the nginx container builds much more quickly)._

Auto-generated docs will be at
http://localhost:8000/api/docs

### Rebuilding containers:

```
docker-compose build
```

### Restarting containers:

```
docker-compose restart
```

### Bringing containers down:

```
docker-compose down --remove-orphans
```
### Force stop and remove all containers:

```
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)
```


### Frontend Tests

```
cd frontend
npm install
npm test
```

## Migrations

Migrations are run using alembic. To run all migrations and load init data:

```
docker-compose run backend alembic upgrade head
docker-compose run backend python app/initial_data.py
```

To create a new migration:

```
alembic revision -m "create users table"
```

And fill in `upgrade` and `downgrade` methods. For more information see
[Alembic's official documentation](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script).

## Testing

There is a helper script for both frontend and backend tests:

```
./scripts/test.sh
```

### Backend Tests

```
docker-compose run backend pytest
```

any arguments to pytest can also be passed after this command

### Frontend Tests

```
docker-compose run frontend npm run test:all
```

This is the same as running npm test from within the frontend directory

## Project Layout

```
backend
└── app
    ├── alembic
    │   └── versions # where migrations are located
    ├── api
    │   └── base
    │       └── endpoints
    │   └── v2
    │       └── endpoints
    ├── core    # config
    ├── db      # db models
    ├── tests   # pytest
    └── main.py # entrypoint to backend

frontend
└── public
└── src
    ├── components
    │   └── Home.tsx
    ├── config
    │   └── index.tsx   # constants
    ├── __tests__
    │   └── test_home.tsx
    ├── index.tsx   # entrypoint
    └── App.tsx     # handles routing
```
