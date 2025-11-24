import React, { useState } from 'react';
import { Employee, UserRole, Status } from '../types';
import { Icons } from './Icons';
import AvatarIcon from './AvatarIcon';

interface EmployeeTileProps {
  data: Employee[];
  isLoading: boolean;
  userRole: UserRole;
  onRowClick: (emp: Employee) => void;
  onEdit: (e: React.MouseEvent, emp: Employee) => void;
  onDelete: (e: React.MouseEvent, emp: Employee) => void;
  onFlag: (e: React.MouseEvent, emp: Employee) => void;
}

const TileCard: React.FC<{ 
  emp: Employee; 
  userRole: UserRole;
  onClick: () => void;
  onAction: (e: React.MouseEvent, action: string) => void 
}> = ({ emp, userRole, onClick, onAction }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setShowMenu(false);
    onAction(e, action);
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border ${emp.isFlagged ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'} overflow-hidden cursor-pointer group relative flex flex-col`}
    >
      {/* Header/Banner */}
      <div className={`h-20 w-full ${
        emp.department === 'Engineering' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
        emp.department === 'Design' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
        'bg-gradient-to-r from-slate-500 to-gray-500'
      }`}></div>

      {/* Flag Indicator */}
      {emp.isFlagged && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg z-10 font-medium flex items-center gap-1 shadow-sm">
           <Icons.Flag size={10} fill="currentColor" /> Flagged
        </div>
      )}

      {/* Bun Button - Only for Admin */}
      {userRole === UserRole.ADMIN && (
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className="bg-white/90 backdrop-blur p-1.5 rounded-full text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition-all"
            >
              <Icons.MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => {e.stopPropagation(); setShowMenu(false);}}></div>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={(e) => handleAction(e, 'edit')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Icons.Edit size={14} /> Edit
                  </button>
                  <button 
                    onClick={(e) => handleAction(e, 'flag')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Icons.Flag size={14} className={emp.isFlagged ? "fill-red-500 text-red-500" : ""} /> 
                    {emp.isFlagged ? "Unflag" : "Flag"}
                  </button>
                  <button 
                    onClick={(e) => handleAction(e, 'delete')}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Icons.Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="px-5 pb-5 -mt-10 flex-1 flex flex-col">
        {/* Avatar */}
        <div className="relative">
            <AvatarIcon name={emp.name} size={80} />
            <div className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
              emp.status === Status.ACTIVE ? 'bg-green-500' : 
              emp.status === Status.ON_LEAVE ? 'bg-yellow-500' : 'bg-gray-400'
            }`}></div>
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{emp.name}</h3>
          <p className="text-sm text-gray-500">{emp.jobTitle}</p>
        </div>

        <div className="mt-4 space-y-2 flex-1">
          <div className="flex items-center text-sm text-gray-600">
             <Icons.Briefcase size={14} className="mr-2 text-gray-400" />
             {emp.department}
          </div>
          <div className="flex items-center text-sm text-gray-600">
             <Icons.User size={14} className="mr-2 text-gray-400" />
             {emp.email}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
           <span>Joined {new Date(emp.joinDate).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

const EmployeeTile: React.FC<EmployeeTileProps> = ({ 
  data, 
  isLoading, 
  userRole,
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
      {data.map(emp => (
        <TileCard 
          key={emp.id} 
          emp={emp} 
          userRole={userRole}
          onClick={() => onRowClick(emp)}
          onAction={(e, action) => {
            if(action === 'edit') onEdit(e, emp);
            if(action === 'flag') onFlag(e, emp);
            if(action === 'delete') onDelete(e, emp);
          }}
        />
      ))}
    </div>
  );
};

export default EmployeeTile;