import React, { useState } from 'react';
import { Icons } from './Icons';
import { Role } from '../types';

interface NavbarProps {
  currentUserRole: Role;
  onLogout: () => void;
  toggleRole: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUserRole, onLogout, toggleRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    { name: 'Dashboard', icon: <Icons.Dashboard size={18} />, link: '#' },
    { 
      name: 'Employees', 
      icon: <Icons.Users size={18} />, 
      link: '#',
      submenu: [
        { name: 'All Staff', link: '#' },
        { name: 'Onboarding', link: '#' },
        { name: 'Leaves', link: '#' },
      ]
    },
    { name: 'Projects', icon: <Icons.Briefcase size={18} />, link: '#' },
    { name: 'Settings', icon: <Icons.Settings size={18} />, link: '#' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Menu */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                US
              </div>
              <span className="font-bold text-xl tracking-tight text-secondary-900">Ultraship</span>
            </div>
            
            {/* Desktop Horizontal Menu */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button 
                    className="flex items-center gap-2 px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-primary-500 transition-colors h-16"
                  >
                    {item.icon}
                    {item.name}
                    {item.submenu && <Icons.ChevronDown size={14} className="mt-0.5" />}
                  </button>
                  
                  {/* Desktop Dropdown (Simulated Hover) */}
                  {item.submenu && (
                    <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                      <div className="py-1">
                        {item.submenu.map((sub) => (
                          <a
                            key={sub.name}
                            href={sub.link}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
             {/* Role Toggle for Demo */}
             <button 
              onClick={toggleRole}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentUserRole === Role.ADMIN ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-green-100 text-green-700 border-green-200'}`}
            >
              Current: {currentUserRole}
            </button>

            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <Icons.User size={18} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => item.submenu ? setActiveSubmenu(activeSubmenu === item.name ? null : item.name) : null}
                  className="w-full flex items-center justify-between pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </div>
                  {item.submenu && (
                     <Icons.ChevronDown 
                        size={16} 
                        className={`transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`}
                     />
                  )}
                </button>
                
                {/* Mobile Submenu (1 level deep) */}
                {item.submenu && activeSubmenu === item.name && (
                  <div className="bg-gray-50 py-1">
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.name}
                        href={sub.link}
                        className="block pl-11 pr-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-4 border-t border-gray-200">
             <div className="flex items-center px-4">
               <button onClick={toggleRole} className="text-xs text-primary-600 font-medium">
                  Switch Role (Current: {currentUserRole})
               </button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;