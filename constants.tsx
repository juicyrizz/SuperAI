import type { PersonaDetails, GenerationModeDetails, ThemeDetails } from './types';
import { Persona, GenerationMode, Theme } from './types';
import React from 'react';

const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.492-2.697-1.178-3.75-2.036a7.5 7.5 0 0 1-1.5-5.656V8.25a7.5 7.5 0 0 1 15 0v3.078a7.5 7.5 0 0 1-1.5 5.656 7.5 7.5 0 0 1-3.75 2.036Z" /></svg>
);

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM6 21a2.25 2.25 0 0 1-2.25-2.25V5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21H6Z" />
  </svg>
);

const PaintBrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118L2.25 12.875a3 3 0 0 1 2.25-2.625.5.5 0 0 0 .5-.5V8.5a3 3 0 0 1 3-3h.538a3 3 0 0 1 2.81 2.188L10.5 12.5l.256.341A3 3 0 0 1 9.53 16.122ZM16.5 7.5a2.25 2.25 0 0 0-2.25 2.25v.5a.5.5 0 0 1-.5.5h-1.5a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-2.25a.5.5 0 0 1 .5-.5h.5a3 3 0 0 0 3-3v-.5a2.25 2.25 0 0 0-2.25-2.25H16.5Z" />
    </svg>
);

export const SitemapIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/></svg> );
export const AcademicCapIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443a55.378 55.378 0 0 1 5.25 2.882V15M12 21a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-1.5 0v5.25A.75.75 0 0 0 12 21Z" /></svg> );
export const TableCellsIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125v-12.75c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125m-17.25 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm1.125 0h.008v.015h-.008V19.5Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015Zm0-1.125h.008v.015h-.008v-.015ZM3.375 8.25h17.25M12 4.5v15" /></svg> );
const ChefHatIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3.962-2.554Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.252 5.424 13.17 5.66 12 5.92c-1.17-.26-2.252-.496-3.362-.706a21.523 21.523 0 0 1 6.724 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.362 15.176a8.311 8.311 0 0 1-.295-4.472 8.25 8.25 0 0 1 12.065 0 8.31 8.31 0 0 1-.295 4.472m-11.475 0a8.25 8.25 0 0 0 11.475 0" /></svg> );

const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
);

const ScaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c-.317.02-1.636.03-2.25.03-.614 0-1.933-.01-2.25-.03m4.5 0c.614 0 1.933.01 2.25.03M5.25 4.97m-4.5 0c.614 0 1.933.01 2.25.03M3 12h18M3 12a9 9 0 0 1 9-9m9 9a9 9 0 0 0-9-9M3 12a9 9 0 0 0 9 9m9-9a9 9 0 0 1-9 9" /></svg>
);

const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 18l-.813 2.846a4.5 4.5 0 0 1-3.09 3.09L15 21.75l-2.846-.813a4.5 4.5 0 0 1-3.09-3.09L8.25 15l.813-2.846a4.5 4.5 0 0 1 3.09-3.09L15 8.25l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 12Z" />
    </svg>
);

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 18l-.813 2.846a4.5 4.5 0 0 1-3.09 3.09L15 21.75l-2.846-.813a4.5 4.5 0 0 1-3.09-3.09L8.25 15l.813-2.846a4.5 4.5 0 0 1 3.09-3.09L15 8.25l2.846.813a4.5 4.5 0 0 1 3.09 3.09L21.75 12Z" /></svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> );
export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg> );
export const SpeakerWaveIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg> );
export const SpeakerXMarkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg> );
export const ArrowDownTrayIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> );
export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg> );
export const ArrowsPointingOutIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg> );
export const ArrowsPointingInIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" /></svg> );
export const ArrowTopRightOnSquareIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.75A.75.75 0 0 1 14.25 6h1.5a.75.75 0 0 1 .75.75v1.5m-4.5 0h4.5m4.5-4.5-4.5 4.5" /></svg> );
export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> );
export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> );
export const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg> );
export const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0-3.181-3.183a8.25 8.25 0 0 0-11.667 0L2.985 16.653" /></svg> );
export const EllipsisHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg> );

export const PERSONAS: Record<Persona, PersonaDetails> = {
    [Persona.GENIUS]: {
        id: Persona.GENIUS,
        title: 'Genius',
        description: 'Multi-purpose problem solver.',
        systemInstruction: "You are Super Syntax, a hyper-intelligent AI. Your goal is to provide accurate, detailed, and helpful responses. Be proactive and anticipate user needs. Structure your answers clearly with headings, lists, and code blocks when appropriate. You can generate text, translate languages, write different kinds of creative content, and answer questions in an informative way.",
        icon: LightBulbIcon
    },
    [Persona.RESEARCHER]: {
        id: Persona.RESEARCHER,
        title: 'Researcher',
        description: 'Searches and cites sources.',
        systemInstruction: "You are a research assistant. Your primary goal is to answer questions using Google Search results, providing citations for all claims. When you use information from a source, cite it clearly. Synthesize information from multiple sources to provide a comprehensive answer. If the answer is not in the search results, state that clearly.",
        icon: BookOpenIcon
    },
    [Persona.NERD]: {
        id: Persona.NERD,
        title: 'Nerd',
        description: 'Math, physics, and logic.',
        systemInstruction: "You are a mathematics and physics expert. Explain complex topics with clarity, using LaTeX for equations. Provide step-by-step solutions to problems. Your tone is academic and precise.",
        icon: CalculatorIcon
    },
    [Persona.ARCHITECT]: {
        id: Persona.ARCHITECT,
        title: 'Architect',
        description: 'Creates Mermaid diagrams.',
        systemInstruction: "You are a solution architect. Your task is to create diagrams using Mermaid syntax. Analyze the user's request and generate the appropriate Mermaid code block. Use comments in the code to explain the diagram's components. Do not include any other text in your response besides the Mermaid code block.",
        icon: SitemapIcon,
    },
    [Persona.TUTOR]: {
        id: Persona.TUTOR,
        title: 'Tutor',
        description: 'Explains complex topics simply.',
        systemInstruction: "You are a friendly and patient tutor. Your goal is to explain complex topics in a simple, easy-to-understand way. Use analogies and real-world examples. Break down difficult concepts into smaller, manageable parts. Encourage questions and check for understanding. Your tone should be supportive and encouraging.",
        icon: AcademicCapIcon,
    },
    [Persona.CSV_ANALYST]: {
        id: Persona.CSV_ANALYST,
        title: 'CSV Analyst',
        description: 'Analyzes data, generates charts.',
        systemInstruction: `You are a data analyst specializing in CSV files and data visualization.
1.  When the user provides a CSV file, analyze its contents.
2.  Based on the user's request or your own analysis of what's interesting, generate a Mermaid diagram to visualize the data. This could be a pie chart, bar chart, etc.
3.  Respond ONLY with the Mermaid diagram in a \`\`\`mermaid code block. Do not include any other text or explanation.`,
        icon: TableCellsIcon,
    },
    [Persona.CHEF]: {
        id: Persona.CHEF,
        title: 'Chef',
        description: 'Culinary expert for recipes.',
        systemInstruction: "You are a world-class chef. Provide delicious recipes, cooking techniques, and meal planning advice. Be creative, clear, and inspiring. Assume the user has basic kitchen equipment unless they specify otherwise. Format recipes with ingredients and step-by-step instructions.",
        icon: ChefHatIcon,
    },
};

export const GENERATION_MODES: Record<GenerationMode, GenerationModeDetails> = {
    [GenerationMode.FAST]: {
        id: GenerationMode.FAST,
        title: 'Fast',
        description: 'Quickest response time, may sacrifice some quality.',
        icon: BoltIcon
    },
    [GenerationMode.BALANCED]: {
        id: GenerationMode.BALANCED,
        title: 'Balanced',
        description: 'Good balance of speed and quality.',
        icon: ScaleIcon
    },
    [GenerationMode.THINKING]: {
        id: GenerationMode.THINKING,
        title: 'Thinking',
        description: 'Slower, more thoughtful responses for complex tasks.',
        icon: BrainIcon
    },
};

export const THEMES: Record<Theme, ThemeDetails> = {
    [Theme.DARK]: {
        id: Theme.DARK,
        title: 'Dark',
        icon: MoonIcon,
    },
    [Theme.LIGHT]: {
        id: Theme.LIGHT,
        title: 'Light',
        icon: SunIcon,
    },
    [Theme.TRANSPARENT]: {
        id: Theme.TRANSPARENT,
        title: 'Transparent',
        icon: SparklesIcon,
    },
};