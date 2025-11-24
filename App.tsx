import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Navbar from './components/Navbar';
import EmployeeGrid from './components/EmployeeGrid';
import EmployeeTile from './components/EmployeeTile';
import EmployeeModal from './components/EmployeeModal';
import EmployeeFormModal from './components/EmployeeFormModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Icons } from './components/Icons';
import toast, { Toaster } from 'react-hot-toast';
import { GET_EMPLOYEES, GET_LOCATIONS, ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from './services/graphql';
import { Employee, UserRole, Department, Status, SortConfig } from './types';

const App: React.FC = () => {
  // --- State ---
  const [viewMode, setViewMode] = useState<'grid' | 'tile'>('grid');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // State
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12 });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<string | 'All'>('All');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null); // Null means Add mode

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; employee: Employee | null }>({
    isOpen: false,
    employee: null
  });

  // --- GraphQL Queries ---
  const { data: employeesData, loading, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      filter: {
        search: searchQuery || null,
        department: deptFilter !== 'All' ? deptFilter : null,
        status: statusFilter !== 'All' ? statusFilter : null,
        location: locationFilter !== 'All' ? locationFilter : null,
      },
      sort: sortConfig,
    },
    fetchPolicy: 'network-only',
  });

  const { data: locationsData } = useQuery(GET_LOCATIONS);

  // --- GraphQL Mutations ---
  const [addEmployeeMutation] = useMutation(ADD_EMPLOYEE, {
    onCompleted: () => {
      refetch();
    }
  });

  const [updateEmployeeMutation] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
    }
  });

  const [deleteEmployeeMutation] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
    }
  });

  // Extract data from queries
  const data = employeesData?.employees?.data || [];
  const total = employeesData?.employees?.total || 0;
  const availableLocations = locationsData?.locations || [];

  // --- Handlers ---
  
  const handleSort = (key: keyof Employee) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Open Add Modal
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  // Perform Save (Add or Update)
  const handleSaveEmployee = async (formData: Partial<Employee>) => {
    try {
      if (editingEmployee) {
        // Update
        await updateEmployeeMutation({
          variables: {
            id: editingEmployee.id,
            ...formData,
          },
        });
      } else {
        // Create
        await addEmployeeMutation({
          variables: formData,
        });
      }
      setIsFormOpen(false);
      toast.success(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
    } catch (err) {
      console.error(err);
      toast.error("Failed to save employee. Please try again.");
    }
  };

  const handleDeleteRequest = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setDeleteConfirmation({ isOpen: true, employee: emp });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.employee) return;
    try {
      await deleteEmployeeMutation({
        variables: { id: deleteConfirmation.employee.id },
      });
      setDeleteConfirmation({ isOpen: false, employee: null });
      toast.success('Employee deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee. Please try again.");
    }
  };

  const handleFlag = async (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    try {
      await updateEmployeeMutation({
        variables: {
          id: emp.id,
          isFlagged: !emp.isFlagged,
        },
      });
      toast.success('Employee flag updated!');
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee flag");
    }
  };

  const toggleRole = () => {
    setCurrentUserRole(prev => prev === UserRole.ADMIN ? UserRole.EMPLOYEE : UserRole.ADMIN);
  };

  // Export to CSV
  const handleExport = () => {
    // Export current data (all filtered data from current query)
    const headers = ['ID', 'Name', 'Role', 'Department', 'Email', 'Phone', 'Location', 'Status', 'Join Date'];
    const csvContent = [
      headers.join(','),
      ...data.map((e: Employee) => [
        e.id, 
        `"${e.name}"`, 
        `"${e.jobTitle}"`, 
        e.department, 
        e.email, 
        e.phone, 
        `"${e.location}"`, 
        e.status, 
        e.joinDate
      ].join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar 
        currentUserRole={currentUserRole} 
        onLogout={() => {}} 
        onToggleRole={toggleRole}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExport}
               className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
             >
               <Icons.LogOut className="mr-2 h-4 w-4 text-gray-500" />
               Export CSV
             </button>
             {currentUserRole === UserRole.ADMIN && (
              <button 
                onClick={handleAddEmployee}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Icons.User className="mr-2 h-4 w-4" />
                Add Employee
              </button>
             )}
          </div>
        </div>

        {/* Toolbar (Filters & View Toggle) */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between sticky top-16 z-30 transition-all">
          
          {/* Filters Group */}
          <div className="flex flex-col lg:flex-row gap-3 w-full xl:w-auto flex-wrap">
            {/* Search */}
            <div className="relative min-w-[200px] flex-grow lg:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm focus:bg-white transition-colors"
                placeholder="Name, ID or Email"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPagination(p => ({...p, page: 1})); }}
              />
            </div>
            
            {/* Department Filter */}
            <div className="flex-grow lg:flex-grow-0">
               <select 
                 value={deptFilter}
                 onChange={(e) => { setDeptFilter(e.target.value as any); setPagination(p => ({...p, page: 1})); }}
                 className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md focus:bg-white transition-colors"
               >
                 <option value="All">All Departments</option>
                 {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
               </select>
            </div>

            {/* Status Filter */}
            <div className="flex-grow lg:flex-grow-0">
               <select 
                 value={statusFilter}
                 onChange={(e) => { setStatusFilter(e.target.value as any); setPagination(p => ({...p, page: 1})); }}
                 className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md focus:bg-white transition-colors"
               >
                 <option value="All">All Statuses</option>
                 {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>

            {/* Location Filter */}
            <div className="flex-grow lg:flex-grow-0">
               <select 
                 value={locationFilter}
                 onChange={(e) => { setLocationFilter(e.target.value); setPagination(p => ({...p, page: 1})); }}
                 className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-gray-50 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md focus:bg-white transition-colors"
               >
                 <option value="All">All Locations</option>
                 {availableLocations.map((loc: string) => <option key={loc} value={loc}>{loc}</option>)}
               </select>
            </div>
          </div>

          {/* Right: View Toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 self-end xl:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Grid View"
            >
              <Icons.List size={20} />
            </button>
            <button
              onClick={() => setViewMode('tile')}
              className={`p-2 rounded-md transition-all ${viewMode === 'tile' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Tile View"
            >
              <Icons.Grid size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {viewMode === 'grid' ? (
            <EmployeeGrid 
              data={data} 
              isLoading={loading} 
              userRole={currentUserRole}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={setSelectedEmployee}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onFlag={handleFlag}
            />
          ) : (
            <EmployeeTile 
              data={data} 
              isLoading={loading} 
              userRole={currentUserRole}
              onRowClick={setSelectedEmployee}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onFlag={handleFlag}
            />
          )}

          {/* Pagination Footer */}
          {!loading && data.length > 0 && (
            <div className="flex items-center justify-between mt-6 bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.pageSize, total)}</span> of <span className="font-medium">{total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination(p => ({...p, page: Math.max(1, p.page - 1)}))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <Icons.ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    {(() => {
                        const totalPages = Math.ceil(total / pagination.pageSize);
                        let startPage = Math.max(1, pagination.page - 2);
                        let endPage = Math.min(totalPages, startPage + 4);
                        if (endPage - startPage < 4) {
                            startPage = Math.max(1, endPage - 4);
                        }
                        
                        return [...Array(Math.max(0, endPage - startPage + 1))].map((_, i) => {
                           const pNum = startPage + i;
                           return (
                             <button
                              key={pNum}
                              onClick={() => setPagination(p => ({...p, page: pNum}))}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === pNum ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                             >
                               {pNum}
                             </button>
                           );
                        });
                    })()}
                    <button
                      onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                      disabled={pagination.page * pagination.pageSize >= total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <Icons.ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal (Read Only) */}
      <EmployeeModal 
        employee={selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
      />

      {/* Create/Edit Modal */}
      <EmployeeFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirmation.employee?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmation({ isOpen: false, employee: null })}
      />
    </div>
  );
};

export default App;