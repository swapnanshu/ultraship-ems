import { Employee, FilterCriteria, PaginatedResponse, SortConfig, Status } from "../types";

/**
 * This service mimics a backend GraphQL resolver layer.
 * In a real app, this logic would live in Node.js/Spring Boot.
 */
export class MockBackendService {
  private db: Employee[] = [];

  constructor(initialData: Employee[]) {
    this.db = initialData;
  }

  // Internal helper to apply filters
  private applyFilters(filter: FilterCriteria): Employee[] {
    return this.db.filter(emp => {
      // 5. Employees can be searched only by their name, id and email
      const searchLower = filter.search ? filter.search.toLowerCase() : '';
      const matchSearch = filter.search 
        ? emp.name.toLowerCase().includes(searchLower) || 
          emp.email.toLowerCase().includes(searchLower) ||
          emp.id.toLowerCase().includes(searchLower)
        : true;
      
      const matchDept = filter.department && filter.department !== 'All' 
        ? emp.department === filter.department 
        : true;

      const matchStatus = filter.status && filter.status !== 'All'
        ? emp.status === filter.status
        : true;
        
      const matchLocation = filter.location && filter.location !== 'All'
        ? emp.location === filter.location
        : true;

      return matchSearch && matchDept && matchStatus && matchLocation;
    });
  }

  // Simulating: query GetEmployees($page: Int, $limit: Int, $filter: FilterInput)
  async getEmployees(
    page: number = 1,
    pageSize: number = 10,
    filter: FilterCriteria,
    sort: SortConfig
  ): Promise<PaginatedResponse<Employee>> {
    
    // 1. Filtering
    const filtered = this.applyFilters(filter);

    // 2. Sorting
    filtered.sort((a, b) => {
      const valA = a[sort.key];
      const valB = b[sort.key];

      if (valA === valB) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // 3. Pagination
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filtered.slice(startIndex, endIndex);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      data,
      total,
      page,
      pageSize
    };
  }

  // Helper for Export CSV
  async getAllFiltered(filter: FilterCriteria): Promise<Employee[]> {
     await new Promise(resolve => setTimeout(resolve, 200));
     return this.applyFilters(filter);
  }

  // Get unique locations for filter dropdown
  getLocations(): string[] {
    return Array.from(new Set(this.db.map(e => e.location))).sort();
  }

  // Simulating: mutation CreateEmployee($input: EmployeeInput!)
  async createEmployee(input: Omit<Employee, 'id'>): Promise<Employee> {
    const newId = `EMP-${Math.floor(Math.random() * 10000)}`;
    const newEmployee: Employee = {
      ...input,
      id: newId,
      avatar: input.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=random`,
      isFlagged: false
    };
    
    this.db.unshift(newEmployee); // Add to top
    return newEmployee;
  }

  // Simulating: mutation DeleteEmployee($id: ID!)
  async deleteEmployee(id: string): Promise<boolean> {
    const initialLen = this.db.length;
    this.db = this.db.filter(e => e.id !== id);
    return this.db.length !== initialLen;
  }

  // Simulating: mutation UpdateEmployee($input: EmployeeInput!)
  async updateEmployee(updatedEmp: Employee): Promise<Employee> {
    const index = this.db.findIndex(e => e.id === updatedEmp.id);
    if (index !== -1) {
      this.db[index] = { ...this.db[index], ...updatedEmp };
      return this.db[index];
    }
    throw new Error("Employee not found");
  }

  getById(id: string): Employee | undefined {
    return this.db.find(e => e.id === id);
  }
}