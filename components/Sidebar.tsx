import React from 'react';
import { AppView } from '../types';
import { HomeIcon, FlowsIcon, SettingsIcon, ToolboxIcon } from './icons';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'principal' as AppView, icon: HomeIcon, label: 'Principal' },
    { view: 'flujos' as AppView, icon: FlowsIcon, label: 'Flujos' },
    { view: 'tools' as AppView, icon: ToolboxIcon, label: 'Herramientas' },
    { view: 'configuraciones' as AppView, icon: SettingsIcon, label: 'Configuraciones' },
  ];

  const baseClass = "flex items-center justify-center p-4 rounded-lg transition-colors duration-200 cursor-pointer";
  const activeClass = "bg-[#44475a] text-[#8be9fd]";
  const inactiveClass = "text-gray-400 hover:bg-[#44475a] hover:text-white";

  return (
    <nav className="h-full bg-[#21222C] p-2 flex flex-col items-center space-y-4 flex-shrink-0">
      {navItems.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          onClick={() => setActiveView(view)}
          title={label}
          className={`${baseClass} ${activeView === view ? activeClass : inactiveClass}`}
          aria-current={activeView === view ? 'page' : undefined}
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;