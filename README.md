# Backend API

A RESTful Todo API built with Express.js and TypeScript.

## Overview

This project provides a robust backend API for managing todo items, featuring a clean architecture with controllers, services, and repositories. It's built with TypeScript and Express.js, offering type safety and a structured approach to API development.

## Features

- RESTful API design
- CRUD operations for todo items
- Environment-specific configuration
- Error handling middleware
- Input validation
- TypeScript for type safety
- Testing with Jest

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Jest (Testing)
- Nodemon (Development)

## Project Structure

```
backend-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── repository/     # Data access layer
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── tests/          # Test files
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── validators/     # Input validation
│   └── server.ts       # Application entry point
├── .env                # Environment variables
├── .env.development    # Development environment variables
├── .env.production     # Production environment variables
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest configuration
└── package.json        # Project dependencies and scripts
```

## API Endpoints

| Method | Endpoint       | Description               |
|--------|----------------|---------------------------|
| GET    | /api/v1/todo   | Get all todos             |
| GET    | /api/v1/todo/:id | Get a specific todo     |
| POST   | /api/v1/todo   | Create a new todo         |
| PUT    | /api/v1/todo/:id | Update a specific todo  |
| DELETE | /api/v1/todo/:id | Delete a specific todo  |
| DELETE | /api/v1/todo   | Delete all todos          |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd backend-api
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   - Copy `.env.development` to `.env` for development
   - Adjust values as needed

### Running the Application

Development mode with auto-reload:
```
npm run dev
```

Production mode:
```
npm run start:prod
```

### Testing

Run tests:
```
npm test
```

Run tests with watch mode:
```
npm run test:watch
```

Generate test coverage report:
```
npm run test:coverage
```

## Environment Variables

The application uses different environment files based on the running mode:
- `.env.development` for development
- `.env.production` for production

Required environment variables:
- `PORT`: The port number for the server (default: 3000)
- `NODE_ENV`: The environment mode ('dev' or 'prod')

## License

ISC