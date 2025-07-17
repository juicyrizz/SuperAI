
import React from 'react';
import { PERSONAS } from '../constants';
import type { Persona, Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

interface ModeSelectorProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  theme: Theme;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentPersona, onSelectPersona, theme }) => {
  const themeClasses = {
    [ThemeEnum.LIGHT]: {
      container: "bg-white border-gray-200",
      button: "bg-gray-100 hover:bg-gray-200",
      buttonSelected: "bg-blue-100 ring-2 ring-blue-400",
      icon: "text-gray-500",
      iconSelected: "text-blue-600",
      title: "text-gray-700",
      titleSelected: "text-blue-700",
      description: "text-gray-500",
    },
    [ThemeEnum.DARK]: {
      container: "bg-gray-900/50 border-gray-700/50",
      button: "bg-gray-800 hover:bg-gray-700",
      buttonSelected: "bg-slate-700/50 ring-2 ring-slate-400",
      icon: "text-gray-400",
      iconSelected: "text-slate-300",
      title: "text-gray-300",
      titleSelected: "text-slate-200",
      description: "text-gray-500",
    },
    [ThemeEnum.TRANSPARENT]: {
       container: "bg-transparent border-gray-600/50",
      button: "bg-white/5 hover:bg-white/10",
      buttonSelected: "bg-white/20 ring-2 ring-slate-300",
      icon: "text-gray-400",
      iconSelected: "text-slate-200",
      title: "text-gray-300",
      titleSelected: "text-slate-100",
      description: "text-gray-400",
    }
  };
  
  const tc = themeClasses[theme];

  return (
    <div className={`flex justify-between items-stretch p-2 border-b gap-2 transition-colors duration-300 ${tc.container}`}>
      {Object.values(PERSONAS).map((personaDetails) => {
        const isSelected = currentPersona === personaDetails.id;
        const Icon = personaDetails.icon;

        return (
          <button
            key={personaDetails.id}
            onClick={() => onSelectPersona(personaDetails.id)}
            className={`flex-1 flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg transition-all duration-200 text-center ${
              isSelected
                ? tc.buttonSelected
                : tc.button
            }`}
          >
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isSelected ? tc.iconSelected : tc.icon}`} />
            <span className={`text-xs font-semibold ${isSelected ? tc.titleSelected : tc.title}`}>
              {personaDetails.title}
            </span>
             <span className={`text-xs hidden sm:block ${isSelected ? tc.description : tc.description}`}>
              {personaDetails.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};