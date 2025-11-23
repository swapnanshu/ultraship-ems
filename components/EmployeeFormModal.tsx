import React, { useState, useEffect } from 'react';
import { Employee, Department, Status } from '../types';
import { Icons } from './Icons';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  initialData: Employee | null; // If null, it's Add mode
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [subjectsStr, setSubjectsStr] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        setFormData({ ...initialData });
        setSubjectsStr(initialData.subjects?.join(', ') || '');
      } else {
        // Default values for new employee
        setFormData({
          name: '',
          email: '',
          role: '',
          department: Department.ENGINEERING,
          status: Status.ACTIVE,
          phone: '',
          location: '',
          age: 25,
          joinDate: new Date().toISOString().split('T')[0]
        });
        setSubjectsStr('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    
    // Strict Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Strict Phone Regex (Min 10 digits, allows +, -, space, brackets)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be at least 10 characters long and valid";
    }

    if (!formData.role?.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subjects = subjectsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    onSave({ ...formData, subjects });
  };

  const handleChange = (key: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">
              {initialData ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Icons.X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Icons.User size={16} className="text-gray-400" />
                   </div>
                   <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`block w-full pl-10 border rounded-md sm:text-sm py-2 ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                    placeholder="e.g. John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm py-2 px-3 ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  placeholder="john@ultraship.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm py-2 px-3 ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  placeholder="555-0123"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role / Job Title</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={e => handleChange('role', e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm py-2 px-3 ${errors.role ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  placeholder="Senior Developer"
                />
                {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
              </div>

               {/* Department */}
               <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.department || Department.ENGINEERING}
                  onChange={e => handleChange('department', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border px-3"
                >
                  {Object.values(Department).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status || Status.ACTIVE}
                  onChange={e => handleChange('status', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border px-3"
                >
                  {Object.values(Status).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => handleChange('location', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border px-3"
                  placeholder="e.g. New York, NY"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age || ''}
                  onChange={e => handleChange('age', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border px-3"
                />
              </div>

               {/* Subjects */}
               <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Skills / Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={e => setSubjectsStr(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 border px-3"
                  placeholder="React, Java, Management"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
              >
                {initialData ? 'Update Employee' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormModal;