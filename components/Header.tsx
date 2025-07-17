import React from 'react';
import type { Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

const Bars3Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
);

interface HeaderProps {
  onMenuClick: () => void;
  currentTheme: Theme;
  onSwitchTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, currentTheme, onSwitchTheme }) => {

  const themeClasses = {
    [ThemeEnum.LIGHT]: {
      header: "border-gray-200",
      title: "text-gray-800",
      menuButton: "text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:ring-gray-400",
    },
    [ThemeEnum.DARK]: {
      header: "border-gray-700/50",
      title: "bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-400",
      menuButton: "text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-slate-500",
    },
    [ThemeEnum.TRANSPARENT]: {
      header: "border-gray-600/50",
      title: "bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-400",
      menuButton: "text-gray-300 hover:bg-white/10 hover:text-white focus:ring-slate-500",
    }
  }
  const tc = themeClasses[currentTheme];

  return (
    <header className={`relative flex items-center justify-center p-4 border-b ${tc.header} transition-colors duration-300 h-16 shrink-0`}>
       <div className="absolute left-4">
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-full transition-colors duration-200 ${tc.menuButton}`}
          aria-label="Open features menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      <h1 className={`text-2xl font-bold ${tc.title}`}>
        Super Syntax
      </h1>
    </header>
  );
};