# Products CRUD API

Full-stack product management app — Go + Gin backend with JWT auth, PostgreSQL, and React/Vite TypeScript frontend. Everything runs via Docker Compose.

## Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Backend  | Go 1.23, Gin, GORM, JWT, bcrypt   |
| Database | PostgreSQL 16                     |
| Frontend | React 18, Vite, TypeScript, Axios |
| Infra    | Docker Compose, nginx             |

## Quick Start

```bash
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8080

## API Endpoints

### Auth (no JWT required)
| Method | Endpoint              | Body                            |
|--------|-----------------------|---------------------------------|
| POST   | /api/auth/register    | `{ email, password }`           |
| POST   | /api/auth/login       | `{ email, password }`           |

### Products (JWT required — `Authorization: Bearer <token>`)
| Method | Endpoint              | Body                                          |
|--------|-----------------------|-----------------------------------------------|
| GET    | /api/products         | —                                             |
| POST   | /api/products         | `{ name, description, price, stock }`         |
| GET    | /api/products/:id     | —                                             |
| PUT    | /api/products/:id     | `{ name, description, price, stock }`         |
| DELETE | /api/products/:id     | —                                             |

## Manual curl test

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Login — copy the token from the response
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Create a product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"Widget","description":"A nice widget","price":9.99,"stock":100}'

# List products
curl http://localhost:8080/api/products \
  -H "Authorization: Bearer <TOKEN>"
```

## Local dev (without Docker)

### Backend
```bash
cd backend
DB_HOST=localhost DB_PORT=5432 DB_USER=admin DB_PASSWORD=secret DB_NAME=productsdb \
  JWT_SECRET=dev PORT=8080 go run ./cmd/main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173 (proxies /api to :8080)
```
