import React from 'react';

interface PanelProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, icon, children, className = '', actions }) => {
  return (
    <div className={`bg-[#44475a]/80 border border-[#6272a4] rounded-lg shadow-lg flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-[#6272a4] flex-shrink-0">
        <div className="flex items-center">
            {icon}
            <h2 className="text-lg font-semibold text-[#f8f8f2] ml-3">{title}</h2>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="flex-grow relative flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
};

export default Panel;