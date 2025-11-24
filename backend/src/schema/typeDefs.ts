import gql from "graphql-tag";


export const typeDefs = gql`
  enum Role {
    Admin
    Employee
  }

  enum Department {
    Engineering
    Design
    Marketing
    HR
    Sales
    Operations
  }

  enum Status {
    Active
    Inactive
    On_Leave
  }

  type Employee {
    id: ID!
    employeeId: String!
    name: String!
    age: Int!
    jobTitle: String!
    userRole: String!
    department: String!
    email: String!
    phone: String!
    location: String!
    status: String!
    joinDate: String!
    subjects: [String!]!
    isFlagged: Boolean!
  }

  type PaginatedEmployees {
    data: [Employee!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  input EmployeeFilter {
    search: String
    department: String
    status: String
    location: String
  }

  input SortConfig {
    key: String!
    direction: String!
  }

  type Query {
    employees(
      page: Int
      pageSize: Int
      filter: EmployeeFilter
      sort: SortConfig
    ): PaginatedEmployees!
    
    employee(id: ID!): Employee
    
    locations: [String!]!
  }

  type Mutation {
    addEmployee(
      name: String!
      age: Int!
      jobTitle: String!
      userRole: String
      department: String!
      email: String!
      phone: String!
      location: String!
      status: String!
      joinDate: String!
      subjects: [String!]
    ): Employee!

    updateEmployee(
      id: ID!
      name: String
      age: Int
      jobTitle: String
      userRole: String
      department: String
      email: String
      phone: String
      location: String
      status: String
      joinDate: String
      subjects: [String!]
      isFlagged: Boolean
    ): Employee!

    deleteEmployee(id: ID!): Boolean!
  }
`;
