import React, { useState } from 'react';
import { ProjectFile, Theme } from '../types';
import { Theme as ThemeEnum } from '../types';

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> );

const getThemeClasses = (theme: Theme) => ({
    [ThemeEnum.LIGHT]: {
        placeholder: 'text-gray-500',
        codeBlockBg: 'bg-gray-800',
        codeText: 'text-gray-200',
        codeLangText: 'text-gray-400',
        copyButton: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        copyButtonCopied: 'bg-green-600 text-white',
    },
    [ThemeEnum.DARK]: {
        placeholder: 'text-gray-500',
        codeBlockBg: 'bg-black/50',
        codeText: 'text-slate-300',
        codeLangText: 'text-slate-400',
        copyButton: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        copyButtonCopied: 'bg-green-600 text-white',
    },
    [ThemeEnum.TRANSPARENT]: {
        placeholder: 'text-gray-500',
        codeBlockBg: 'bg-black/50 backdrop-blur-sm',
        codeText: 'text-slate-300',
        codeLangText: 'text-slate-400',
        copyButton: 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80',
        copyButtonCopied: 'bg-green-600/80 text-white',
    }
}[theme]);

interface CodeDisplayProps {
  file: ProjectFile | undefined;
  theme: Theme;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ file, theme }) => {
  const [isCopied, setIsCopied] = useState(false);
  const tc = getThemeClasses(theme);

  if (!file) {
    return <div className={`flex items-center justify-center h-full text-sm ${tc.placeholder}`}>Select a file to view its code.</div>;
  }

  const handleCopyClick = () => {
    if (!file.code) return;
    navigator.clipboard.writeText(file.code)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy code: ', err);
      });
  };

  const language = file.path.split('.').pop() || '';

  return (
    <div className={`relative h-full ${tc.codeBlockBg}`}>
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10 p-1.5 rounded-md">
        <span className={`text-xs ${tc.codeLangText}`}>{language}</span>
        <button
          onClick={handleCopyClick}
          className={`p-1.5 rounded-md transition-all duration-200 ${isCopied ? tc.copyButtonCopied : tc.copyButton}`}
          aria-label={isCopied ? "Copied" : "Copy code"}
        >
          {isCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 h-full text-sm overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/50">
        <code className={`font-mono whitespace-pre break-words ${tc.codeText}`}>
          {file.code}
        </code>
      </pre>
    </div>
  );
};