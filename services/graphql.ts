import { gql } from '@apollo/client';

// Query to get paginated employees with filters and sorting
export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $page: Int
    $pageSize: Int
    $filter: EmployeeFilter
    $sort: SortConfig
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
`;

// Query to get all unique locations
export const GET_LOCATIONS = gql`
  query GetLocations {
    locations
  }
`;

// Mutation to add a new employee
export const ADD_EMPLOYEE = gql`
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
  }
`;

// Mutation to update an existing employee
export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $name: String
    $age: Int
    $jobTitle: String
    $userRole: String
    $department: String
    $email: String
    $phone: String
    $location: String
    $status: String
    $joinDate: String
    $subjects: [String!]
    $isFlagged: Boolean
  ) {
    updateEmployee(
      id: $id
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
      isFlagged: $isFlagged
    ) {
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
  }
`;

// Mutation to delete an employee
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;
