# UltraShip Employee Management System - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Architecture](#frontend-architecture)
9. [Backend Architecture](#backend-architecture)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Testing](#testing)

---

## Overview

UltraShip EMS is a full-stack employee management system built with modern web technologies. It provides a comprehensive solution for managing employee records with features including CRUD operations, advanced filtering, search, sorting, pagination, and CSV export.

### Key Features
- 📊 **Employee Management**: Complete CRUD operations with validation
- 🔍 **Advanced Search**: Search by name, email, or employee ID
- 🎯 **Filtering**: Multi-criteria filtering (department, status, location)
- 📄 **Pagination**: Efficient data loading with configurable page sizes
- 📥 **Export**: CSV export functionality
- 🎨 **Modern UI**: Responsive design with grid/tile view modes
- 🔔 **Toast Notifications**: Real-time feedback for user actions
- 👤 **Avatar System**: Auto-generated initials with color coding
- 🔐 **Role-based Access**: Admin and Employee user roles

---

## Architecture

### High-Level Architecture

```mermaid
graph TB
    User[User Browser]
    FE[Frontend - React + Vite]
    GH[GitHub Pages]
    Backend[Backend - Node.js + Apollo Server]
    Render[Render Web Service]
    DB[(MongoDB Atlas)]
    
    User -->|HTTPS| GH
    GH -->|Serves| FE
    FE -->|GraphQL Queries/Mutations| Backend
    Backend -->|Deployed on| Render
    Backend -->|Mongoose ODM| DB
    
    style FE fill:#61dafb
    style Backend fill:#68a063
    style DB fill:#47a248
    style GH fill:#f5f5f5
    style Render fill:#46e3b7
```

### Architecture Layers

1. **Presentation Layer** (Frontend)
   - React 19 components
   - Apollo Client for GraphQL
   - Tailwind CSS for styling

2. **API Layer** (Backend)
   - GraphQL API with Apollo Server
   - Express.js middleware
   - Input validation and error handling

3. **Business Logic Layer** (Backend)
   - Resolvers implementing business logic
   - Data transformation
   - Authorization checks

4. **Data Access Layer** (Backend)
   - Mongoose ODM
   - MongoDB database operations
   - Schema validation

5. **Database Layer**
   - MongoDB Atlas cloud database
   - Collections: `employees`
   - Indexes for performance optimization

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | Latest | Type safety |
| Vite | 6.0.11 | Build tool & dev server |
| Apollo Client | 3.11.0 | GraphQL client |
| React Hot Toast | 2.4.1 | Toast notifications |
| Lucide React | 0.554.0 | Icon library |
| Tailwind CSS | Via CDN | Styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| TypeScript | Latest | Type safety |
| Apollo Server | 4.x | GraphQL server |
| Express.js | 4.x | HTTP server |
| Mongoose | 8.9.4 | MongoDB ODM |
| GraphQL | 16.x | API query language |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud database (Free tier) |

### Deployment
| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | GitHub Pages | https://swapnanshu.github.io/ultraship-ems/ |
| Backend | Render | https://ultraship-ems.onrender.com |
| Database | MongoDB Atlas | Cloud-hosted |

---

## Project Structure

```
ultraship-ems/
├── frontend/ (root directory)
│   ├── components/          # React components
│   │   ├── AvatarIcon.tsx          # Avatar with initials
│   │   ├── EmployeeGrid.tsx        # Grid view component
│   │   ├── EmployeeTile.tsx        # Tile view component
│   │   ├── EmployeeModal.tsx       # Detail view modal
│   │   ├── EmployeeFormModal.tsx   # Add/Edit form
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── ConfirmationModal.tsx   # Delete confirmation
│   │   └── Icons.tsx               # Icon components
│   │
│   ├── services/            # API and business logic
│   │   ├── apolloClient.ts         # Apollo Client setup
│   │   └── graphql.ts              # GraphQL queries/mutations
│   │
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles
│   ├── vite.config.ts       # Vite configuration
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Environment variables
│
└── backend/
    ├── src/
    │   ├── models/          # Mongoose models
    │   │   └── Employee.ts         # Employee schema
    │   │
    │   ├── schema/          # GraphQL schema
    │   │   ├── typeDefs.ts         # Type definitions
    │   │   └── resolvers.ts        # Query/Mutation resolvers
    │   │
    │   ├── index.ts         # Server entry point
    │   └── seed.ts          # Database seeding script
    │
    ├── dist/                # Compiled JavaScript (generated)
    ├── package.json         # Backend dependencies
    ├── tsconfig.json        # TypeScript configuration
    ├── render.yaml          # Render deployment config
    └── .env                 # Environment variables (not in git)
```

---

## Data Flow

### Request Flow: Frontend → Backend → Database

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Component
    participant AC as Apollo Client
    participant AS as Apollo Server
    participant R as Resolver
    participant M as Mongoose Model
    participant DB as MongoDB Atlas
    
    U->>UI: Click "Add Employee"
    UI->>UI: Open EmployeeFormModal
    U->>UI: Fill form & submit
    UI->>UI: Validate input
    UI->>AC: useMutation(ADD_EMPLOYEE)
    AC->>AS: GraphQL Mutation Request
    AS->>R: addEmployee resolver
    R->>R: Validate & transform data
    R->>M: Employee.create()
    M->>M: Generate employeeId (EMP-001)
    M->>DB: Insert document
    DB-->>M: Success
    M-->>R: Employee object
    R-->>AS: GraphQL response
    AS-->>AC: Employee data
    AC->>AC: Update cache
    AC->>UI: onCompleted callback
    UI->>UI: refetch() - update list
    UI->>U: Show success toast
```

### Query Flow Example: Filtered Employee List

```mermaid
sequenceDiagram
    participant U as User
    participant UI as App.tsx
    participant AC as Apollo Client
    participant AS as Apollo Server
    participant R as employees resolver
    participant M as Employee Model
    participant DB as MongoDB Atlas
    
    U->>UI: Select filter (e.g., Department: Engineering)
    UI->>AC: useQuery with variables
    Note over AC: { filter: { department: "Engineering" }, page: 1, pageSize: 12 }
    AC->>AS: GraphQL Query
    AS->>R: employees(filter, page, pageSize, sort)
    R->>R: Build MongoDB query
    Note over R: { department: "Engineering" }
    R->>M: Employee.find(query).sort().limit().skip()
    M->>DB: Query execution
    DB-->>M: Matching documents
    M->>M: Count total matching docs
    M-->>R: { data: [...], total: X }
    R-->>AS: PaginatedResponse
    AS-->>AC: GraphQL response
    AC->>AC: Cache data
    AC-->>UI: { data, loading, error }
    UI->>U: Render EmployeeGrid
```

---

## Database Schema

### Employee Collection

```typescript
interface IEmployee {
  _id: ObjectId;                    // MongoDB auto-generated ID
  employeeId: string;               // Auto-generated: EMP-001, EMP-002, etc.
  name: string;                     // Full name
  age: number;                      // 18-100
  jobTitle: string;                 // e.g., "Senior Developer"
  userRole: "Admin" | "Employee";   // Access control role
  department: Department;           // Engineering, Design, HR, etc.
  email: string;                    // Unique, validated
  phone: string;                    // Indian format: +91XXXXXXXXXX
  location: string;                 // City, State
  status: Status;                   // Active, On Leave, Terminated
  joinDate: string;                 // ISO date string
  subjects: string[];               // Skills/expertise
  isFlagged: boolean;               // Flag for special attention
}
```

### Enums

```typescript
enum Department {
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  HR = 'HR',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  OPERATIONS = 'Operations'
}

enum Status {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated'
}

enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee'
}
```

### Indexes

```javascript
// Performance optimization indexes
employeeId: 1 (unique)
email: 1 (unique)
department: 1
status: 1
location: 1
```

### Pre-save Hook

```typescript
// Auto-generate employeeId on creation
EmployeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});
```

---

## API Documentation

### GraphQL API Endpoint
**Production**: `https://ultraship-ems.onrender.com/`  
**Local Development**: `http://localhost:4000/`

### Queries

#### 1. Get Employees (Paginated with Filters)

```graphql
query GetEmployees(
  $page: Int
  $pageSize: Int
  $filter: EmployeeFilter
  $sort: SortInput
) {
  employees(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
    data {
      id
      employeeId
      name
      age
      jobTitle
      userRole
      department
      email
      phone
      location
      status
      joinDate
      subjects
      isFlagged
    }
    total
    page
    pageSize
  }
}
```

**Variables Example:**
```json
{
  "page": 1,
  "pageSize": 12,
  "filter": {
    "search": "John",
    "department": "Engineering",
    "status": "Active",
    "location": "Bangalore"
  },
  "sort": {
    "key": "name",
    "direction": "asc"
  }
}
```

#### 2. Get Locations

```graphql
query GetLocations {
  locations
}
```

Returns: `["Bangalore, Karnataka", "Mumbai, Maharashtra", ...]`

### Mutations

#### 1. Add Employee

```graphql
mutation AddEmployee(
  $name: String!
  $age: Int!
  $jobTitle: String!
  $userRole: String
  $department: String!
  $email: String!
  $phone: String!
  $location: String!
  $status: String!
  $joinDate: String!
  $subjects: [String!]
) {
  addEmployee(
    name: $name
    age: $age
    jobTitle: $jobTitle
    userRole: $userRole
    department: $department
    email: $email
    phone: $phone
    location: $location
    status: $status
    joinDate: $joinDate
    subjects: $subjects
  ) {
    id
    employeeId
    name
    # ... all fields
  }
}
```

#### 2. Update Employee

```graphql
mutation UpdateEmployee(
  $id: ID!
  $name: String
  $age: Int
  $jobTitle: String
  # ... other optional fields
  $isFlagged: Boolean
) {
  updateEmployee(
    id: $id
    name: $name
    age: $age
    jobTitle: $jobTitle
    isFlagged: $isFlagged
  ) {
    id
    employeeId
    # ... all fields
  }
}
```

#### 3. Delete Employee

```graphql
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(id: $id)
}
```

Returns: `true` on success

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Main Container)
├── Toaster (react-hot-toast)
├── Navbar
│   ├── Logo
│   ├── Menu Items
│   └── User Role Toggle
│
├── Filters Section
│   ├── Search Input
│   ├── Department Dropdown
│   ├── Status Dropdown
│   └── Location Dropdown
│
├── Action Bar
│   ├── View Mode Toggle (Grid/Tile)
│   ├── Sort Controls
│   ├── Export CSV Button
│   └── Add Employee Button (Admin only)
│
├── View Mode (Conditional)
│   ├── EmployeeGrid (Table view)
│   │   └── EmployeeTile rows with actions
│   │
│   └── EmployeeTile (Card view)
│       └── TileCard components
│
├── Pagination
│   ├── Page info
│   └── Page controls
│
└── Modals (Conditional)
    ├── EmployeeModal (View details)
    ├── EmployeeFormModal (Add/Edit)
    └── ConfirmationModal (Delete)
```

### State Management

**Apollo Client Cache** manages server state:
- Automatic caching of query results
- Cache updates on mutations
- Optimistic UI updates

**React useState** manages local UI state:
- View mode (grid/tile)
- Active filters
- Pagination state
- Modal visibility
- Selected employee
- User role (demo purposes)

### Key Components

#### App.tsx
**Responsibility**: Main application orchestration  
**Key Features**:
- Apollo Client integration via `useQuery` and `useMutation`
- Filter state management
- Event handlers for all user actions
- Toast notification triggers

#### EmployeeFormModal.tsx
**Responsibility**: Add/Edit employee form  
**Key Features**:
- Indian phone validation: `/^(\+91[\s-]?)?[6-9]\d{9}$/`
- Email validation
- Real-time error feedback
- Submit button disabled on validation errors
- Supports both create and update modes

#### AvatarIcon.tsx
**Responsibility**: Generate avatar with initials  
**Algorithm**:
1. Extract initials (first + last name)
2. Hash name to generate consistent color index
3. Select from 10-color palette
4. Render circular badge with initials

---

## Backend Architecture

### Server Initialization Flow

```typescript
// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB
mongoose.connect(MONGODB_URI);

// 3. Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Start standalone server
await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 }
});
```

### Resolver Pattern

```typescript
export const resolvers = {
  Query: {
    employees: async (_, { page, pageSize, filter, sort }) => {
      // 1. Build MongoDB query from filter
      const query = buildQuery(filter);
      
      // 2. Execute paginated query
      const data = await Employee.find(query)
        .sort(buildSort(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      
      // 3. Get total count
      const total = await Employee.countDocuments(query);
      
      // 4. Return paginated response
      return { data, total, page, pageSize };
    }
  },
  
  Mutation: {
    addEmployee: async (_, args) => {
      // 1. Create employee (triggers pre-save hook)
      const employee = await Employee.create(args);
      
      // 2. Return created employee
      return employee;
    }
  }
};
```

### Search Implementation

```typescript
if (filter.search) {
  query.$or = [
    { name: { $regex: filter.search, $options: 'i' } },
    { email: { $regex: filter.search, $options: 'i' } },
    { employeeId: { $regex: filter.search, $options: 'i' } }
  ];
}
```

### Error Handling

Apollo Server automatically handles:
- GraphQL syntax errors
- Validation errors
- Runtime errors

Custom error handling in resolvers:
```typescript
try {
  // Operation
} catch (error) {
  throw new GraphQLError('Custom error message', {
    extensions: { code: 'CUSTOM_ERROR' }
  });
}
```

---

## Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git
- MongoDB account (for Atlas database)

### Frontend Setup

```bash
# 1. Clone repository
git clone https://github.com/swapnanshu/ultraship-ems.git
cd ultraship-ems

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_GRAPHQL_URL=http://localhost:4000/" > .env

# 4. Start development server
npm run dev
# Access at http://localhost:5173
```

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with your MongoDB Atlas URI
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ultraship-ems" > .env
echo "PORT=4000" >> .env

# 4. Seed database (optional)
npm run seed

# 5. Start development server
npm run dev
# Access GraphQL Playground at http://localhost:4000
```

### Environment Variables

**Frontend (.env)**:
```bash
VITE_GRAPHQL_URL=http://localhost:4000/  # Backend API URL
```

**Backend (.env)**:
```bash
MONGODB_URI=mongodb+srv://...  # MongoDB Atlas connection string
PORT=4000                      # Server port (optional, defaults to 4000)
```

---

## Deployment

### Frontend Deployment (GitHub Pages)

#### Manual Deployment

```bash
# 1. Build production bundle
npm run build

# 2. Deploy to GitHub Pages
npm run deploy
```

#### Automatic Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

#### Configuration

**package.json**:
```json
{
  "homepage": "https://swapnanshu.github.io/ultraship-ems",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist --nojekyll"
  }
}
```

**vite.config.ts**:
```typescript
export default defineConfig({
  base: '/ultraship-ems/',  // Repository name
  // ... other config
});
```

### Backend Deployment (Render)

#### Method 1: Using render.yaml

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: ultraship-ems
    env: node
    region: singapore
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: PORT
        value: 10000
```

Push to GitHub and connect repository in Render dashboard.

#### Method 2: Manual Configuration

1. **Create Web Service** on Render
2. **Configuration**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
3. **Environment Variables**:
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
4. **Deploy**: Automatic on git push

#### Backend Scripts

**package.json**:
```json
{
  "scripts": {
    "build": "tsc",                // Compile TypeScript
    "start": "node dist/index.js", // Production server
    "dev": "nodemon src/index.ts", // Development server
    "seed": "ts-node src/seed.ts"  // Seed database
  }
}
```

### Domain Configuration

**Frontend**: GitHub Pages provides domain at `username.github.io/repo-name`  
**Backend**: Render provides domain at `service-name.onrender.com`

For custom domains, configure DNS settings in respective platforms.

---

## Testing

### Manual Testing Checklist

#### CRUD Operations
- [ ] Create employee with all fields
- [ ] View employee in grid view
- [ ] View employee in tile view
- [ ] Update employee details
- [ ] Delete employee
- [ ] Flag/unflag employee

#### Filtering & Search
- [ ] Search by name
- [ ] Search by email
- [ ] Search by employeeId
- [ ] Filter by department
- [ ] Filter by status
- [ ] Filter by location
- [ ] Combined filters
- [ ] Clear filters

#### Validation
- [ ] Phone number validation (Indian format)
- [ ] Email validation
- [ ] Required fields
- [ ] Age range (18-100)
- [ ] Submit button disabled on errors

#### UI/UX
- [ ] Toast notifications appear
- [ ] Avatar initials display correctly
- [ ] Responsive layout on mobile
- [ ] Grid/Tile view toggle works
- [ ] Pagination works
- [ ] CSV export downloads correctly

#### Performance
- [ ] Page loads under 3 seconds
- [ ] Filtering is instant
- [ ] No cache issues after mutations

### Testing with Apollo Sandbox

Access GraphQL Playground:
- **Local**: http://localhost:4000
- **Production**: https://ultraship-ems.onrender.com

Example test queries provided in [API Documentation](#api-documentation) section.

### Database Seeding

```bash
# Run seed script to populate test data
cd backend
npm run seed

# Expected output:
# Connected to MongoDB
# Cleared existing employees
# Seeding employees...
# ✅ Successfully seeded 25 employees
# Database connection closed
```

---

## Troubleshooting

### Common Issues

#### Frontend Issues

**Issue**: Apollo Client errors  
**Solution**: Check `VITE_GRAPHQL_URL` in `.env` file

**Issue**: Build fails  
**Solution**: Clear cache and rebuild
```bash
rm -rf node_modules dist
npm install
npm run build
```

#### Backend Issues

**Issue**: MongoDB connection timeout  
**Solution**: 
1. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
2. Verify connection string URL encoding
3. Check network connectivity

**Issue**: Port already in use  
**Solution**: Change port in `.env` or kill process
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill
```

**Issue**: employeeId validation error during seed  
**Solution**: Schema requires employeeId to be optional (auto-generated)

### Debugging

**Frontend**:
```typescript
// Enable Apollo Client DevTools
import { ApolloClient } from '@apollo/client';

const client = new ApolloClient({
  // ... config
  connectToDevTools: true  // Enable in development
});
```

**Backend**:
```typescript
// Enable GraphQL introspection
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true  // Enable in development
});
```

---

## Performance Optimization

### Frontend Optimizations
1. **Code Splitting**: Vite automatically splits code
2. **Lazy Loading**: Components loaded on demand
3. **Apollo Client Caching**: Reduces redundant queries
4. **Pagination**: Loads data in chunks

### Backend Optimizations
1. **Database Indexes**: Optimized queries on common fields
2. **Projection**: Only fetch required fields
3. **Connection Pooling**: Mongoose handles automatically
4. **GraphQL Batching**: Apollo Server handles efficiently

### Database Optimizations
1. **Compound Indexes**: For frequently combined filters
2. **Limit Results**: Pagination prevents large data transfers
3. **Lean Queries**: Use `.lean()` for read-only operations

---

## Security Considerations

### Current Implementation
- ✅ Input validation on form fields
- ✅ Email and phone format validation
- ✅ MongoDB injection prevention (Mongoose sanitization)
- ✅ HTTPS for production (GitHub Pages + Render)

### Production Recommendations
- 🔒 Implement JWT authentication
- 🔒 Add rate limiting on API
- 🔒 Implement CORS restrictions
- 🔒 Add request validation middleware
- 🔒 Sanitize user inputs server-side
- 🔒 Use environment variables for secrets
- 🔒 Implement role-based authorization

---

## Future Enhancements

### Planned Features
- [ ] User authentication (JWT)
- [ ] Email notifications
- [ ] Advanced reporting & analytics
- [ ] Bulk import/export (Excel)
- [ ] Employee performance tracking
- [ ] Document management
- [ ] Calendar integration
- [ ] Skeleton loaders
- [ ] Dark mode
- [ ] Unit & integration tests

---

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use descriptive variable names
- Add comments for complex logic
- Keep components focused and modular

### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: description of feature"

# 3. Push to remote
git push origin feature/your-feature-name

# 4. Create Pull Request on GitHub
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

---

## Support & Contact

**Repository**: https://github.com/swapnanshu/ultraship-ems  
**Issues**: https://github.com/swapnanshu/ultraship-ems/issues  
**Live Demo**: https://swapnanshu.github.io/ultraship-ems/  
**API**: https://ultraship-ems.onrender.com/

---

## License

This project is licensed under the MIT License.

---

**Last Updated**: November 2024  
**Version**: 1.0.0
