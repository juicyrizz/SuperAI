

import React, { useState, useMemo, useEffect } from 'react';
import { FileTree } from './FileTree';
import { CodeDisplay } from './CodeDisplay';
import { Preview } from './Preview';
import { ProjectState, Theme } from '../types';
import { Theme as ThemeEnum } from '../types';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon, ArrowTopRightOnSquareIcon, DownloadIcon, XMarkIcon } from '../constants';

interface ProjectViewProps {
  projectState: ProjectState;
  onEndProject: () => void;
  onDownloadProject: () => void;
  theme: Theme;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projectState, onEndProject, onDownloadProject, theme }) => {
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
    if (!activeFilePath && projectState.files.length > 0) {
      setActiveFilePath(projectState.files[0].path);
    }
     // Select newly created file
    if (projectState.files.length > 0) {
        const latestFile = projectState.files[projectState.files.length - 1];
        if (latestFile.path !== activeFilePath) {
            setActiveFilePath(latestFile.path);
        }
    }

  }, [projectState.files, activeFilePath]);

  const activeFile = projectState.files.find(f => f.path === activeFilePath);
  
  const srcDoc = useMemo(() => {
    const htmlFile = projectState.files.find(f => f.path.endsWith('.html'));
    if (!htmlFile) {
      return '<html><body style="font-family: sans-serif; color: #555; display: flex; align-items: center; justify-content: center; height: 100vh;">Waiting for index.html...</body></html>';
    }

    let htmlContent = htmlFile.code;

    // Inject CSS
    const cssFiles = projectState.files.filter(f => f.path.endsWith('.css'));
    const cssContent = cssFiles.map(f => `<style>${f.code}</style>`).join('\n');
    if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${cssContent}</head>`);
    } else {
        htmlContent = cssContent + htmlContent;
    }

    // Inject JS
    const jsFiles = projectState.files.filter(f => f.path.endsWith('.js'));
    const jsContent = jsFiles.map(f => `<script>${f.code}</script>`).join('\n');
    if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${jsContent}</body>`);
    } else {
        htmlContent += jsContent;
    }

    return htmlContent;
  }, [projectState.files]);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleOpenInNewTab = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);


  const themeClasses = {
    [ThemeEnum.LIGHT]: {
      container: "bg-gray-100 text-gray-800 border-b border-gray-200",
      header: "bg-gray-200/80 border-b border-gray-300",
      headerText: "text-gray-800",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
      exitButton: "text-gray-500 hover:text-red-600",
      panelBorder: "border-gray-300",
      fileTreeBg: "bg-gray-100",
      previewHeaderBg: "bg-gray-100",
      previewHeaderButton: "text-gray-500 hover:bg-gray-300/60"
    },
    [ThemeEnum.DARK]: {
      container: "bg-gray-900 text-slate-200 border-b border-gray-700",
      header: "bg-gray-800/80 border-b border-gray-700",
      headerText: "text-slate-200",
      button: "bg-slate-700 hover:bg-slate-600 text-slate-200",
      exitButton: "text-slate-400 hover:text-red-400",
      panelBorder: "border-gray-700",
      fileTreeBg: "bg-gray-800/50",
      previewHeaderBg: "bg-gray-800",
      previewHeaderButton: "text-slate-400 hover:bg-gray-700"
    },
    [ThemeEnum.TRANSPARENT]: {
      container: "bg-gray-900/70 text-slate-200 border-b border-gray-700/50 backdrop-blur-sm",
      header: "bg-gray-800/50 border-b border-gray-700/50",
      headerText: "text-slate-200",
      button: "bg-white/10 hover:bg-white/20 text-slate-200",
      exitButton: "text-slate-400 hover:text-red-400",
      panelBorder: "border-gray-700/50",
      fileTreeBg: "bg-gray-800/30",
      previewHeaderBg: "bg-gray-800/70",
      previewHeaderButton: "text-slate-400 hover:bg-white/10"
    },
  };
  const tc = themeClasses[theme];


  return (
    <div className={`flex flex-col h-[60vh] flex-shrink-0 animate-in fade-in duration-300 ${tc.container}`}>
      <div className={`flex items-center justify-between p-2 h-12 flex-shrink-0 ${tc.header}`}>
        <h3 className={`font-bold text-lg px-2 ${tc.headerText}`}>Project Mode</h3>
        <div className="flex items-center gap-2">
            <button onClick={onDownloadProject} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${tc.button}`}>
                <DownloadIcon className="w-4 h-4" />
                Download Project
            </button>
            <button onClick={onEndProject} title="Exit Project Mode" className={`p-1.5 rounded-full transition-colors ${tc.exitButton}`}>
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className={`w-1/4 min-w-[180px] max-w-[250px] p-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 ${tc.fileTreeBg}`}>
          <FileTree files={projectState.files} activeFile={activeFilePath} onSelectFile={setActiveFilePath} theme={theme}/>
        </div>
        <div className={`w-2/4 border-l border-r ${tc.panelBorder} overflow-y-auto`}>
          <CodeDisplay file={activeFile} theme={theme} />
        </div>
        <div className="w-2/4 flex flex-col">
            <div className={`flex-shrink-0 h-8 flex items-center justify-end px-2 gap-2 border-b ${tc.panelBorder}`}>
                <button onClick={handleOpenInNewTab} title="Open in New Tab" className={`p-1 rounded transition-colors ${tc.previewHeaderButton}`}>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
                <button onClick={handleToggleFullscreen} title="Fullscreen" className={`p-1 rounded transition-colors ${tc.previewHeaderButton}`}>
                    <ArrowsPointingOutIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-grow bg-white min-h-0">
                <Preview srcDoc={srcDoc} />
            </div>
        </div>
      </div>

      {/* Fullscreen Preview Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-150">
          <div className={`flex-shrink-0 h-10 border-b flex items-center justify-end px-2 gap-2 ${tc.previewHeaderBg} ${tc.panelBorder}`}>
             <button onClick={handleOpenInNewTab} title="Open in New Tab" className={`p-1.5 rounded transition-colors ${tc.previewHeaderButton}`}>
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </button>
            <button onClick={handleToggleFullscreen} title="Exit Fullscreen" className={`p-1.5 rounded transition-colors ${tc.previewHeaderButton}`}>
               <ArrowsPointingInIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-grow bg-white min-h-0">
             <Preview srcDoc={srcDoc} />
          </div>
        </div>
      )}

    </div>
  );
};