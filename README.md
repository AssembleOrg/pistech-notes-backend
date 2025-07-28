# Pistech Notes Backend

A clean architecture implementation of a notes and project management API with financial tracking capabilities, comprehensive logging, and advanced filtering.

## Features

- **Notes Management**: Create, read, update, and delete notes with tags
- **Project Management**: Manage projects with status tracking and financial summaries
- **Financial Tracking**: Track client charges and partner payments with detailed filtering
- **Partner Management**: Manage partners with roles and contact information
- **Authentication**: JWT-based authentication with protected routes
- **Comprehensive Logging**: Automatic logging of all database changes with detailed audit trails
- **Advanced Filtering**: Powerful filtering and search capabilities for all entities
- **Pagination**: Efficient pagination with metadata for large datasets
- **Logical Delete**: Soft delete system with restore capabilities
- **Clean Architecture**: Follows clean architecture principles with proper separation of concerns
- **MongoDB Integration**: Uses MongoDB with Mongoose ODM
- **API Documentation**: Auto-generated Swagger documentation
- **Validation**: Request validation using class-validator
- **Environment Configuration**: Support for different environments

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport.js
- **Password Hashing**: bcryptjs
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Project Structure

```
src/
├── domain/                    # Domain layer (business logic)
│   ├── interfaces/           # Domain interfaces
│   ├── repositories/         # Repository interfaces
│   └── types/               # Domain types
├── application/              # Application layer (use cases)
│   ├── dto/                 # Data Transfer Objects
│   └── services/            # Application services
├── infrastructure/           # Infrastructure layer (external concerns)
│   ├── database/            # Database configuration
│   ├── repositories/        # Repository implementations
│   ├── schemas/             # MongoDB schemas
│   ├── guards/              # Authentication guards
│   ├── strategies/          # Passport strategies
│   └── interceptors/        # Cross-cutting concerns
├── presentation/             # Presentation layer (API)
│   └── controllers/         # API controllers
└── modules/                 # Feature modules
    ├── notes/
    ├── projects/
    ├── client-charges/
    ├── partner-payments/
    ├── partners/
    ├── auth/
    └── logs/
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pistech-notes-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pistech-notes
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Authentication

All endpoints (except authentication) require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Notes
- `POST /notes` - Create a new note
- `GET /notes` - Get all notes with filters
- `GET /notes/paginated` - Get notes with pagination and filters
- `GET /notes/:id` - Get a note by ID
- `PATCH /notes/:id` - Update a note
- `DELETE /notes/:id` - Soft delete a note
- `DELETE /notes/:id/hard` - Hard delete a note
- `PATCH /notes/:id/restore` - Restore a soft deleted note

### Projects
- `POST /projects` - Create a new project
- `GET /projects` - Get all projects with filters
- `GET /projects/paginated` - Get projects with pagination and filters
- `GET /projects/:id` - Get a project by ID
- `GET /projects/:id/with-charges` - Get project with financial data
- `PATCH /projects/:id` - Update a project
- `DELETE /projects/:id` - Soft delete a project
- `DELETE /projects/:id/hard` - Hard delete a project
- `PATCH /projects/:id/restore` - Restore a soft deleted project

### Client Charges
- `POST /client-charges` - Create a new client charge
- `GET /client-charges` - Get all client charges with filters
- `GET /client-charges/paginated` - Get charges with pagination and filters
- `GET /client-charges/project/:projectId` - Get charges by project
- `GET /client-charges/:id` - Get a charge by ID
- `PATCH /client-charges/:id` - Update a charge
- `DELETE /client-charges/:id` - Soft delete a charge
- `DELETE /client-charges/:id/hard` - Hard delete a charge
- `PATCH /client-charges/:id/restore` - Restore a soft deleted charge

### Partner Payments
- `POST /partner-payments` - Create a new partner payment
- `GET /partner-payments` - Get all partner payments with filters
- `GET /partner-payments/paginated` - Get payments with pagination and filters
- `GET /partner-payments/project/:projectId` - Get payments by project
- `GET /partner-payments/:id` - Get a payment by ID
- `PATCH /partner-payments/:id` - Update a payment
- `DELETE /partner-payments/:id` - Soft delete a payment
- `DELETE /partner-payments/:id/hard` - Hard delete a payment
- `PATCH /partner-payments/:id/restore` - Restore a soft deleted payment

### Partners
- `POST /partners` - Create a new partner
- `GET /partners` - Get all partners with filters
- `GET /partners/paginated` - Get partners with pagination and filters
- `GET /partners/:id` - Get a partner by ID
- `PATCH /partners/:id` - Update a partner
- `DELETE /partners/:id` - Soft delete a partner
- `DELETE /partners/:id/hard` - Hard delete a partner
- `PATCH /partners/:id/restore` - Restore a soft deleted partner

### Logs
- `GET /logs` - Get all logs with filters
- `GET /logs/test` - Test endpoint to verify logging system
- `GET /logs/:id` - Get a log by ID
- `GET /logs/entity/:entityId` - Get logs by entity ID
- `GET /logs/user/:userId` - Get logs by user ID
- `GET /logs/type/:entityType` - Get logs by entity type

## Filtering and Pagination

All list endpoints support comprehensive filtering and pagination using unified DTOs that combine filters with pagination parameters.

### Unified Pagination DTOs

Each entity has its own pagination DTO that combines filters with pagination:

- **`NotePaginationDto`**: `title`, `content`, `tags`, `includeDeleted`, `page`, `limit`
- **`ProjectPaginationDto`**: `name`, `description`, `status`, `includeDeleted`, `page`, `limit`
- **`ClientChargePaginationDto`**: `projectId`, `minAmount`, `maxAmount`, `currency`, `startDate`, `endDate`, `paymentMethod`, `description`, `includeDeleted`, `page`, `limit`
- **`PartnerPaymentPaginationDto`**: `projectId`, `partnerName`, `minAmount`, `maxAmount`, `currency`, `startDate`, `endDate`, `paymentMethod`, `description`, `includeDeleted`, `page`, `limit`
- **`PartnerPaginationDto`**: `fullName`, `nickname`, `number`, `partnerRole`, `pistechRole`, `includeDeleted`, `page`, `limit`

### Filter Options
- **Text fields**: Partial matching with case-insensitive search
- **Numeric fields**: Range filtering (min/max)
- **Date fields**: Date range filtering using ISO strings
- **Enum fields**: Exact match filtering
- **Include deleted**: Option to include soft-deleted records

### Pagination
- **Page-based pagination** with customizable page size (1-100 items per page)
- **Metadata included**: total, page, limit, totalPages, hasNext, hasPrev
- **Sorting**: All results sorted by createdAt descending

### Example Queries
```bash
# Get notes with title filter and pagination
GET /notes/paginated?title=meeting&page=1&limit=20

# Get projects with status filter and pagination
GET /projects/paginated?status=active&page=2&limit=15

# Get client charges with amount range and pagination
GET /client-charges/paginated?minAmount=1000&maxAmount=5000&currency=USD&page=1&limit=25

# Get partners with role filter and pagination
GET /partners/paginated?partnerRole=owner&pistechRole=developer&page=1&limit=10
```

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

### Note
```typescript
{
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Project
```typescript
{
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### ClientCharge
```typescript
{
  id: string;
  projectId: string;
  amount: number;
  currency: 'ARS' | 'USD' | 'EUR';
  date: Date;
  paymentMethod: 'cash' | 'transfer' | 'card' | 'check' | 'other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### PartnerPayment
```typescript
{
  id: string;
  projectId: string;
  partnerName: string;
  amount: number;
  currency: 'ARS' | 'USD' | 'EUR';
  date: Date;
  paymentMethod: 'cash' | 'transfer' | 'card' | 'check' | 'other';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Partner
```typescript
{
  id: string;
  fullName: string;
  nickname: string;
  number: string;
  partnerRole: 'owner' | 'collaborator';
  pistechRole: 'developer' | 'designer' | 'manager' | 'rrhh' | 'accountant' | 'marketing' | 'sales' | 'other';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Log
```typescript
{
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';
  entityId: string;
  oldData?: any;
  newData?: any;
  changes?: string[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
```

## Logical Delete System

All entities support logical delete operations:

- **Soft Delete**: Marks records as deleted without removing them from the database
- **Hard Delete**: Permanently removes records from the database
- **Restore**: Unmarks soft-deleted records
- **Include Deleted**: Option to include soft-deleted records in queries

## Logging System

The application automatically logs all database changes using a direct service approach:

### Features
- **Automatic Logging**: All CREATE, UPDATE, DELETE operations are logged
- **Detailed Information**: User ID, action type, entity details, IP address, user agent
- **Audit Trail**: Complete history of all changes for compliance and debugging
- **Filtering**: Logs can be filtered by user, entity type, date range, etc.
- **Direct Service Integration**: Uses `LoggingService` directly in controllers for reliable logging

### Implementation
- **`LoggingService`**: Direct service for logging operations
- **Controller Integration**: Each controller method calls logging service after operations
- **Error Handling**: Logging errors don't break main application flow
- **Comprehensive Data**: Captures old and new data for comparison

### Example Usage
```typescript
// In controllers, after operations:
await this.loggingService.logCreate(request, 'Partner', partner.id, partner);
await this.loggingService.logUpdate(request, 'Partner', id, oldData, newData);
await this.loggingService.logDelete(request, 'Partner', id, deletedData);
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Scripts

- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pistech-notes` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
