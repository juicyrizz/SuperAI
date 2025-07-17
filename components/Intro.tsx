
import React from 'react';
import type { Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

export const Intro: React.FC<{ theme: Theme }> = ({ theme }) => {
    
    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            logoText: "text-gray-800",
            logoShadow: "text-gray-800/60",
            creatorText: "text-gray-600",
        },
        [ThemeEnum.DARK]: {
            logoText: "text-slate-100",
            logoShadow: "text-slate-100/60",
            creatorText: "text-slate-400",
        },
        [ThemeEnum.TRANSPARENT]: {
            logoText: "text-slate-100",
            logoShadow: "text-slate-100/60",
            creatorText: "text-slate-400",
        },
    }
    const tc = themeClasses[theme];
    
    return (
        <div className="w-full h-full flex justify-center items-center animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-2">
                <div className="text-[8rem] font-black tracking-tighter">
                    <span className={`inline-block animate-in fade-in-25 slide-in-from-bottom-5 duration-700 delay-200 ${tc.logoText}`}>S</span>
                    <span className={`-ml-[2.2rem] inline-block animate-in fade-in-25 slide-in-from-bottom-5 duration-700 delay-400 ${tc.logoShadow}`}>S</span>
                </div>
                <p className={`text-base font-medium tracking-widest ${tc.creatorText} animate-in fade-in duration-1000 delay-700`}>
                    Syntax Creations.
                </p>
            </div>
        </div>
    );
};
