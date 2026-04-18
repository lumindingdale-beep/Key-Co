import React from 'react';
import { Home, QrCode, ClipboardList, MapPin, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'qr', icon: QrCode, label: 'QR' },
    { id: 'jobs', icon: ClipboardList, label: 'Tracker' },
    { id: 'map', icon: MapPin, label: 'Fairs' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-all flex-1',
                isActive ? 'text-red' : 'text-slate-400'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all',
                isActive && 'border-b-2 border-red pb-1'
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
