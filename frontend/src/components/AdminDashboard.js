import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  MessageSquare, 
  Send, 
  Settings,
  Menu,
  X,
  Users
} from 'lucide-react';
import MassMessaging from './admin/MassMessaging';
import CustomerMessages from './admin/CustomerMessages';
import SettingsPage from './admin/SettingsPage';
import CustomerManagement from './admin/CustomerManagement';
import ThemeToggle from './ThemeToggle';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Mass Messaging', path: '/admin', icon: Send, emoji: '📢' },
    { name: 'Customer Management', path: '/admin/customers', icon: Users, emoji: '👥' },
    { name: 'Customer Messages', path: '/admin/messages', icon: MessageSquare, emoji: '💬' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, emoji: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-slate-800 transition-colors duration-200">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3 opacity-80">👨‍💼</div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-700 dark:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  <span className="mr-3 text-lg">{item.emoji}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-colors duration-200">
          <div className="flex h-16 items-center px-4">
            <div className="text-2xl mr-3 opacity-80">👨‍💼</div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  <span className="mr-3 text-lg">{item.emoji}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-200">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4 sm:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<MassMessaging />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/messages" element={<CustomerMessages />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
