import { Users, Activity, FileText, Settings, Database, LayoutDashboard, HelpCircle, User } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const doctor = useAppSelector((state) => state.auth.doctor);
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const bottomNavItems = [
    { id: 'help', icon: HelpCircle, label: 'Help & Documentation' },
  ];

  return (
    <div className="w-16 bg-[#0f0820] h-screen flex flex-col items-center py-6 border-r border-purple-900/20">
      <div className="mb-4">
        <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-semibold text-xs">C4RD</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive
                ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-400 hover:text-white hover:bg-purple-900/30'
                }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Bottom Navigation Items */}
      <div className="flex flex-col gap-4 mt-4">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive
                ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-400 hover:text-white hover:bg-purple-900/30'
                }`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}

        {/* User Profile Indicator */}
        {doctor && (
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mt-2" title={doctor.name}>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs">{doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
