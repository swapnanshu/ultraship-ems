import React from 'react';
import { Employee, Status } from '../types';
import { Icons } from './Icons';
import AvatarIcon from './AvatarIcon';

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-gray-100 z-10 transition-colors"
          >
            <Icons.X size={20} className="text-gray-500" />
          </button>

          {/* Header Image */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-indigo-600 relative">
            <div className="absolute -bottom-12 left-8">
               {/* Avatar */}
          <div className="flex-shrink-0">
            <AvatarIcon name={employee.name} size={96} />
          </div>     
            </div>
          </div>

          <div className="px-8 pt-16 pb-8">
            <div className="flex justify-between items-start">
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{employee.jobTitle}</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {employee.employeeId}</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === Status.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                   }`}>
                     {employee.status}
                   </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Personal Info */}
              <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Contact & Location</h3>
                 
                 <div className="flex items-center gap-3 text-gray-600">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                     <Icons.Briefcase size={16} />
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">Department</p>
                     <p className="text-sm font-medium">{employee.department}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 text-gray-600">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                     <Icons.User size={16} />
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">Email</p>
                     <p className="text-sm font-medium">{employee.email}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 text-gray-600">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                     <Icons.Flag size={16} />
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">Location</p>
                     <p className="text-sm font-medium">{employee.location}</p>
                   </div>
                 </div>

                 {/* Added Phone Number */}
                 <div className="flex items-center gap-3 text-gray-600">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                     <Icons.ChevronRight size={16} />
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">Phone</p>
                     <p className="text-sm font-medium">{employee.phone}</p>
                   </div>
                 </div>
              </div>

              {/* Right Column: Skills & Stats */}
              <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Subjects & Skills</h3>
                 <div className="flex flex-wrap gap-2">
                   {employee.subjects.map((sub, idx) => (
                     <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                       {sub}
                     </span>
                   ))}
                 </div>

                 <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 pt-4">Tenure</h3>
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-sm text-gray-500">Join Date</span>
                     <span className="text-sm font-medium text-gray-900">{employee.joinDate}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-500">Age</span>
                     <span className="text-sm font-medium text-gray-900">{employee.age} Years</span>
                   </div>
                 </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;