import React from 'react';
import { Employee, UserRole, Status, SortConfig } from '../types';
import { Icons } from './Icons';
import AvatarIcon from './AvatarIcon';

interface EmployeeGridProps {
  data: Employee[];
  isLoading: boolean;
  userRole: UserRole;
  sortConfig: SortConfig;
  onSort: (key: keyof Employee) => void;
  onRowClick: (emp: Employee) => void;
  onEdit: (e: React.MouseEvent, emp: Employee) => void;
  onDelete: (e: React.MouseEvent, emp: Employee) => void;
  onFlag: (e: React.MouseEvent, emp: Employee) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({ 
  data, 
  isLoading, 
  userRole, 
  sortConfig,
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  onFlag
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderHeader = (label: string, sortKey?: keyof Employee) => (
    <th 
      scope="col" 
      onClick={() => sortKey && onSort(sortKey)}
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10 whitespace-nowrap ${sortKey ? 'cursor-pointer hover:bg-gray-100 transition-colors group select-none' : ''}`}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey && sortConfig.key === sortKey && (
          <span className="text-primary-600">
            {sortConfig.direction === 'asc' ? <Icons.ArrowUp size={12} /> : <Icons.ArrowDown size={12} />}
          </span>
        )}
        {sortKey && sortConfig.key !== sortKey && (
          <span className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icons.ArrowUp size={12} />
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {renderHeader('Employee', 'name')}
              {renderHeader('ID', 'employeeId')}
              {renderHeader('Job Title', 'jobTitle')}
              {renderHeader('Department', 'department')}
              {renderHeader('Status', 'status')}
              {renderHeader('Email', 'email')}
              {renderHeader('Phone', 'phone')}
              {renderHeader('Location', 'location')}
              {/* 9. if the user is logged in as Admin then only show the Actions column */}
              {userRole === UserRole.ADMIN && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((emp) => (
              <tr 
                key={emp.id} 
                onClick={() => onRowClick(emp)}
                className={`cursor-pointer transition-colors duration-150 ${emp.isFlagged ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-blue-50/50'}`}
              >
                {/* Name & Avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 relative">
                      <AvatarIcon name={emp.name} size={40} />
                      {emp.isFlagged && (
                        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white">
                           <Icons.Flag size={10} className="text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${emp.isFlagged ? 'text-red-900' : 'text-gray-900'}`}>{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.age} yrs</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{emp.employeeId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.jobTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {emp.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    emp.status === Status.ACTIVE ? 'bg-green-100 text-green-800' :
                    emp.status === Status.ON_LEAVE ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                      emp.status === Status.ACTIVE ? 'bg-green-400' :
                      emp.status === Status.ON_LEAVE ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></span>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.location}</td>

                {/* Actions (Admin Only) */}
                {userRole === UserRole.ADMIN && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={(e) => onEdit(e, emp)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-indigo-50"
                        title="Edit"
                      >
                        <Icons.Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => onFlag(e, emp)}
                        className={`${emp.isFlagged ? 'text-red-600 fill-current' : 'text-gray-400'} hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50`}
                        title={emp.isFlagged ? "Unflag" : "Flag"}
                      >
                        <Icons.Flag size={16} fill={emp.isFlagged ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => onDelete(e, emp)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeGrid;