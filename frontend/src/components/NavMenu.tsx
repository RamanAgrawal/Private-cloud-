import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/',      label: 'Remote',     icon: '⌨' },
  { to: '/files', label: 'File Share', icon: '📁' },
];

export const NavMenu: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-border safe-area-bottom">
    <div className="flex max-w-md mx-auto">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center gap-0.5 py-3 text-xs font-mono transition-colors
             ${isActive ? 'text-accent' : 'text-gray-500 hover:text-gray-300'}`
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
