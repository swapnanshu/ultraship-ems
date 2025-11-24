// Data Models matching the prompt requirements
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum Department {
  ENGINEERING = 'Engineering',
  DESIGN = 'Design',
  HR = 'HR',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  OPERATIONS = 'Operations'
}

export enum Status {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  TERMINATED = 'Terminated'
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  age: number;
  jobTitle: string;
  userRole: UserRole;
  department: Department;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: Status;
  subjects: string[];
  avatar?: string;
  isFlagged?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterCriteria {
  search?: string;
  department?: Department | 'All';
  status?: Status | 'All';
  location?: string | 'All';
}

export interface SortConfig {
  key: keyof Employee;
  direction: 'asc' | 'desc';
}