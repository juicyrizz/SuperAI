import React from 'react';
import { ProjectFile, Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

const HtmlIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m2.172 11.252-1.21-3.692h1.65l.775 2.404.765-2.404h1.65l-1.21 3.692.01.01-1.225-1.892-.01-.01-1.225 1.892ZM13.25 9v6h1.5V9h-1.5Zm4.363 3.322c0 .604-.492 1.096-1.096 1.096s-1.096-.492-1.096-1.096v-1.258c0-.604.492-1.096 1.096-1.096s1.096.492 1.096 1.096v1.258Z" /></svg>
);
const CssIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m2.41 6.508c.24-.616.79-1.016 1.542-1.016.92 0 1.484.508 1.484 1.288 0 .616-.36 1.016-1.04 1.344l-.904.424c-.584.272-1.016.712-1.016 1.376 0 .8.64 1.272 1.584 1.272.768 0 1.344-.376 1.584-1.04H11.5c-.208.768-.888 1.256-1.932 1.256-1.24 0-2.12-.8-2.12-2.04 0-.752.408-1.288 1.144-1.632l.888-.424c.48-.224.784-.576.784-1.088 0-.64-.504-1.024-1.176-1.024-.616 0-1.04.336-1.2.936H6.409ZM15.41 6.508c.24-.616.79-1.016 1.542-1.016.92 0 1.484.508 1.484 1.288 0 .616-.36 1.016-1.04 1.344l-.904.424c-.584.272-1.016.712-1.016 1.376 0 .8.64 1.272 1.584 1.272.768 0 1.344-.376 1.584-1.04H19.5c-.208.768-.888 1.256-1.932 1.256-1.24 0-2.12-.8-2.12-2.04 0-.752.408-1.288 1.144-1.632l.888-.424c.48-.224.784-.576.784-1.088 0-.64-.504-1.024-1.176-1.024-.616 0-1.04.336-1.2.936h-1.592Z" /></svg>
);
const JsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m3.5 12.5v-6h1.5v6h-1.5Zm4.896-.712c0 .48-.384.824-.876.824-.492 0-.876-.344-.876-.824 0-.468.384-.812.876-.812.492 0 .876.344.876.812Z" /></svg>
);
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7.414a3 3 0 0 0-.879-2.121l-2.292-2.293A3 3 0 0 0 16.586 2H5Zm9.5 2.5a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 3 0V4a1.5 1.5 0 0 0-1.5-1.5Z" /></svg>
);

const getIconForFile = (path: string) => {
    const iconProps = { className:"w-4 h-4 mr-2 flex-shrink-0" };
    if (path.endsWith('.html')) return <HtmlIcon {...iconProps} />;
    if (path.endsWith('.css')) return <CssIcon {...iconProps} />;
    if (path.endsWith('.js')) return <JsIcon {...iconProps} />;
    return <FileIcon {...iconProps} />;
}

interface FileTreeProps {
  files: ProjectFile[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  theme: Theme;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onSelectFile, theme }) => {
    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            button: "text-gray-600 hover:bg-gray-200",
            buttonActive: "bg-blue-500/20 text-blue-700 font-medium",
            icon: "text-gray-500",
            iconActive: "text-blue-600",
            placeholder: "text-gray-500",
        },
        [ThemeEnum.DARK]: {
            button: "text-slate-300 hover:bg-gray-700",
            buttonActive: "bg-blue-500/20 text-white font-medium",
            icon: "text-slate-400",
            iconActive: "text-white",
            placeholder: "text-slate-500",
        },
        [ThemeEnum.TRANSPARENT]: {
            button: "text-slate-300 hover:bg-white/10",
            buttonActive: "bg-blue-500/20 text-white font-medium",
            icon: "text-slate-400",
            iconActive: "text-white",
            placeholder: "text-slate-500",
        },
    }
    const tc = themeClasses[theme];

    if (files.length === 0) {
        return <div className={`text-sm text-center p-4 ${tc.placeholder}`}>Waiting for the AI to create files...</div>
    }

  return (
    <ul className="space-y-1">
      {files.map(file => {
        const isActive = activeFile === file.path;
        const buttonClass = isActive ? tc.buttonActive : tc.button;
        const icon = getIconForFile(file.path);
        const iconWithClass = React.cloneElement(icon, {
            className: `${icon.props.className} ${isActive ? tc.iconActive : tc.icon}`
        });

        return (
            <li key={file.path} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <button
                onClick={() => onSelectFile(file.path)}
                className={`w-full flex items-center text-left p-1.5 rounded-md text-sm transition-colors duration-150 ${buttonClass}`}
            >
                {iconWithClass}
                <span className="truncate">{file.path}</span>
            </button>
            </li>
        )
      })}
    </ul>
  );
};