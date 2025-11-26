import React, { useState } from 'react';
import { Icons } from './Icons';
import { UserRole } from '../types';

interface NavbarProps {
  currentUserRole: UserRole;
  onLogout: () => void;
  onToggleRole: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUserRole, onLogout, onToggleRole }) => {
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
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
              US
            </div>
            <span className="font-bold text-xl tracking-tight text-secondary-900">Ultraship</span>
          </div>
        </div>

        {/* Hamburger menu button - visible on all screens */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            {isMobileMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
          </button>
        </div>
      </div>
      </div>

      {/* Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30">
              US
            </div>
            <span className="font-bold text-lg tracking-tight text-secondary-900">Menu</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => item.submenu ? setActiveSubmenu(activeSubmenu === item.name ? null : item.name) : null}
                  className="w-full flex items-center justify-between pl-6 pr-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </div>
                  {item.submenu && (
                     <Icons.ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${activeSubmenu === item.name ? 'rotate-180' : ''}`}
                     />
                  )}
                </button>
                
                {/* Submenu with slide-down animation */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  item.submenu && activeSubmenu === item.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {item.submenu && (
                    <div className="bg-gray-50 py-1">
                      {item.submenu.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.link}
                          className="block pl-14 pr-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 pt-4 pb-4 px-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <button onClick={onToggleRole} className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Switch Role (Current: {currentUserRole})
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <Icons.User size={18} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;