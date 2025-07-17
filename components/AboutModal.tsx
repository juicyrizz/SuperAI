

import React from 'react';
import { Theme as ThemeEnum, type Theme } from '../types';

const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> );

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme }) => {
    if (!isOpen) return null;

    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            overlay: "bg-black/40",
            modal: "bg-white text-gray-800",
            title: "text-gray-900",
            text: "text-gray-600",
            version: "text-gray-400",
            closeButton: "text-gray-400 hover:bg-gray-200 hover:text-gray-800",
        },
        [ThemeEnum.DARK]: {
            overlay: "bg-black/60",
            modal: "bg-gray-800 text-slate-300 border border-gray-700",
            title: "text-white",
            text: "text-slate-400",
            version: "text-slate-500",
            closeButton: "text-gray-500 hover:bg-gray-700 hover:text-white",
        },
        [ThemeEnum.TRANSPARENT]: {
            overlay: "bg-black/70 backdrop-blur-sm",
            modal: "bg-gray-900/60 text-slate-300 backdrop-blur-md border border-gray-600/50",
            title: "text-white",
            text: "text-slate-400",
            version: "text-slate-500",
            closeButton: "text-gray-500 hover:bg-white/10 hover:text-white",
        },
    };
    const tc = themeClasses[theme];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div className={`fixed inset-0 transition-opacity ${tc.overlay}`} aria-hidden="true"></div>
            <div 
                className={`relative w-full max-w-sm rounded-2xl shadow-xl transition-all duration-300 ${tc.modal} animate-in fade-in-90 slide-in-from-bottom-10 sm:slide-in-from-top-0 scale-95 data-[state=open]:sm:scale-100`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${tc.closeButton}`} 
                    aria-label="Close"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8 text-center">
                    <h2 className={`text-lg font-bold mb-4 ${tc.title}`}>Super Syntax</h2>
                     <div className="space-y-1">
                        <p className={tc.text}>An intelligent chat application powered by Google Gemini.</p>
                        <p className={`pt-2 text-sm ${tc.text}`}>Developed by Syntax Creations.</p>
                    </div>
                    <p className={`mt-6 text-xs font-mono ${tc.version}`}>v2.0</p>
                </div>
            </div>
        </div>
    );
};