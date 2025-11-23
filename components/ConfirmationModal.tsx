import React from 'react';
import { Icons } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
       {/* Backdrop */}
       <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>
       
       {/* Modal Card */}
       <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
         <div className="flex items-center gap-3 mb-4">
           {isDanger && (
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
               <Icons.AlertTriangle className="w-6 h-6 text-red-600" />
             </div>
           )}
           <h3 className="text-lg font-bold text-gray-900">{title}</h3>
         </div>
         
         <p className="text-sm text-gray-600 mb-8 leading-relaxed">
           {message}
         </p>
         
         <div className="flex justify-end gap-3">
           <button 
             onClick={onCancel} 
             className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
           >
             {cancelLabel}
           </button>
           <button 
             onClick={onConfirm} 
             className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
               isDanger 
                 ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/30' 
                 : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30'
             }`}
           >
             {confirmLabel}
           </button>
         </div>
       </div>
    </div>
  );
};