# Ocomis User API

## Run User API service locally

### 1. Start local database
```
docker-compose -f docs/postgresql/docker-compose.yml up
```

### 2. Run User API Service

```
NODE_ENV=development npm start
```

## Database

### Add migration

```
./node_modules/.bin/knex migrate:make {MIGRATION NAME}
```

### Init local datbase

```
./node_modules/.bin/knex migrate:latest
```