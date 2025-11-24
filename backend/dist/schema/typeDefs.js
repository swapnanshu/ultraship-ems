"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
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
    name: String!
    role: String!
    department: String!
    email: String!
    phone: String!
    location: String!
    status: String!
    joinDate: String!
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
      role: String!
      department: String!
      email: String!
      phone: String!
      location: String!
      status: String!
      joinDate: String!
    ): Employee!

    updateEmployee(
      id: ID!
      name: String
      role: String
      department: String
      email: String
      phone: String
      location: String
      status: String
      joinDate: String
      isFlagged: Boolean
    ): Employee!

    deleteEmployee(id: ID!): Boolean!
  }
`;
