

import React from 'react';
import type { Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 18l-.813 2.846a4.5 4.5 0 0 1-3.09 3.09L15 21.75l-2.846-.813a4.5 4.5 0 0 1-3.09-3.09L8.25 15l.813-2.846a4.5 4.5 0 0 1 3.09-3.09L15 8.25l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 12Z" />
    </svg>
);


export const ThinkingIndicator: React.FC<{ theme: Theme }> = ({ theme }) => {
  const themeClasses = {
      [ThemeEnum.LIGHT]: {
          container: "bg-white/50",
          text: "text-gray-700",
      },
      [ThemeEnum.DARK]: {
          container: "bg-gray-900/50",
          text: "text-slate-300",
      },
      [ThemeEnum.TRANSPARENT]: {
          container: "bg-gray-900/50",
          text: "text-slate-300",
      }
  };
  const tc = themeClasses[theme];

  return (
    <div className={`absolute inset-x-0 bottom-0 flex justify-center items-center p-4 backdrop-blur-sm transition-colors duration-300 z-20 ${tc.container}`}>
      <div className={`flex items-center space-x-2 ${tc.text}`}>
        <BrainIcon className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium">Thinking...</span>
      </div>
    </div>
  );
};