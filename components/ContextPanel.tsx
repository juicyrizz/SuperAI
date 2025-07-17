
import React, { useState } from 'react';
import type { ChatMessage, Persona, Theme } from '../types';
import { Persona as PersonaEnum, Theme as ThemeEnum } from '../types';

const getFilenameForLanguage = (lang: string, index: number): string => {
    const sanitizedLang = lang.toLowerCase().trim();
    switch (sanitizedLang) {
        case 'html': return 'index.html';
        case 'css': return 'style.css';
        case 'javascript':
        case 'js': return 'script.js';
        case 'typescript':
        case 'ts': return 'index.ts';
        case 'jsx': return 'Component.jsx';
        case 'tsx': return 'Component.tsx';
        case 'python':
        case 'py': return 'main.py';
        case 'java': return 'Main.java';
        case 'shell':
        case 'bash':
        case 'sh': return 'script.sh';
        case 'json': return 'data.json';
        case 'xml': return 'data.xml';
        case 'mermaid': return `Diagram-${index + 1}.mmd`;
        case '':
        case 'code':
            return `snippet-${index + 1}.txt`;
        default:
            return `snippet-${index + 1}.${sanitizedLang}`;
    }
};

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg> );
const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg> );
const DiagramIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3.75h16.5M3.75 12h16.5m-16.5 4.5h16.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> );
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> );
const PanelLeftClose = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
const PanelLeftOpen = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg> );

interface ContextPanelProps {
    isOpen: boolean;
    onToggle: () => void;
    chatHistory: ChatMessage[];
    persona: Persona;
    theme: Theme;
    documentContext?: { filename: string; content: string };
    onClearDocumentContext: () => void;
}

const SnippetItem: React.FC<{ snippet: { language: string; code: string }, theme: Theme }> = ({ snippet, theme }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            item: "hover:bg-gray-200", text: "text-gray-700", icon: "text-gray-500",
            copyButton: "text-gray-500 hover:text-gray-800", copiedButton: "text-green-600"
        },
        [ThemeEnum.DARK]: {
            item: "hover:bg-gray-700/50", text: "text-slate-300", icon: "text-slate-400",
            copyButton: "text-slate-400 hover:text-slate-200", copiedButton: "text-green-400"
        },
        [ThemeEnum.TRANSPARENT]: {
            item: "hover:bg-white/10", text: "text-slate-300", icon: "text-slate-400",
            copyButton: "text-slate-400 hover:text-slate-200", copiedButton: "text-green-400"
        }
    }
    const tc = themeClasses[theme];
    
    const handleCopy = () => {
        if (!snippet.code) return;
        navigator.clipboard.writeText(snippet.code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const isDiagram = snippet.language.toLowerCase().startsWith('diagram');
    const Icon = isDiagram ? DiagramIcon : CodeIcon;

    return (
        <li className={`group/item flex items-center justify-between p-2 rounded-md transition-colors duration-150 ${tc.item}`}>
            <div className="flex items-center gap-2 truncate min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${tc.icon}`} />
                <span className={`font-mono text-sm truncate ${tc.text}`}>{snippet.language}</span>
            </div>
            <button
                onClick={handleCopy}
                className={`p-1 rounded-md transition-all duration-200 flex-shrink-0 opacity-0 group-hover/item:opacity-100 focus:opacity-100 ${isCopied ? tc.copiedButton : tc.copyButton}`}
            >
                {isCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
            </button>
        </li>
    );
};

export const ContextPanel: React.FC<ContextPanelProps> = ({ isOpen, onToggle, chatHistory, persona, theme, documentContext, onClearDocumentContext }) => {

    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            panel: "bg-gray-100 text-gray-800 border-l border-gray-200",
            header: "border-b border-gray-200",
            title: "text-gray-800",
            toggleButton: "text-gray-500 hover:bg-gray-200 hover:text-gray-800",
            sourceLink: "text-blue-600",
            sourceIcon: "text-gray-500",
            sourceItem: "hover:bg-gray-200",
            placeholderText: "text-gray-500",
            clearButton: "text-slate-500 hover:text-red-500",
            docContextBg: "bg-green-500/10",
            docContextIcon: "text-green-500",
            docContextText: "text-gray-700",
            docContextSubtext: "text-gray-500"
        },
        [ThemeEnum.DARK]: {
            panel: "bg-gray-900 text-slate-200 border-l border-gray-800",
            header: "border-b border-gray-800",
            title: "text-slate-200",
            toggleButton: "text-slate-400 hover:bg-gray-800 hover:text-slate-200",
            sourceLink: "text-blue-400",
            sourceIcon: "text-slate-400",
            sourceItem: "hover:bg-gray-800",
            placeholderText: "text-gray-500",
            clearButton: "text-slate-400 hover:text-red-400",
            docContextBg: "bg-green-500/10",
            docContextIcon: "text-green-400",
            docContextText: "text-slate-200",
            docContextSubtext: "text-slate-400"
        },
        [ThemeEnum.TRANSPARENT]: {
            panel: "bg-gray-900/60 text-slate-200 backdrop-blur-lg border-l border-gray-700/50",
            header: "border-b border-gray-700/50",
            title: "text-slate-200",
            toggleButton: "text-slate-400 hover:bg-white/10 hover:text-slate-200",
            sourceLink: "text-blue-400",
            sourceIcon: "text-slate-400",
            sourceItem: "hover:bg-white/10",
            placeholderText: "text-gray-500",
            clearButton: "text-slate-400 hover:text-red-400",
            docContextBg: "bg-green-500/20",
            docContextIcon: "text-green-400",
            docContextText: "text-slate-200",
            docContextSubtext: "text-slate-400"
        }
    };
    const tc = themeClasses[theme];

    const modelMessages = chatHistory.filter(msg => msg.role === 'model');

    let content = null;
    let title = "Context";
    
    if (documentContext) {
        title = "Loaded Document";
        content = (
          <div>
            <div className={`flex items-center justify-between p-2 rounded-md ${tc.docContextBg}`}>
              <div className="flex items-center gap-2 min-w-0">
                <FileTextIcon className={`w-5 h-5 ${tc.docContextIcon} flex-shrink-0`} />
                <p className={`text-sm font-medium truncate ${tc.docContextText}`}>{documentContext.filename}</p>
              </div>
              <button onClick={onClearDocumentContext} title="Clear document context" className={`p-1 rounded-full ${tc.clearButton}`}>
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs ${tc.docContextSubtext} mt-2 p-1`}>
              The AI will use this document as the primary context for its responses in this chat.
            </p>
          </div>
        );
    } else if ([PersonaEnum.GENIUS, PersonaEnum.ARCHITECT, PersonaEnum.CSV_ANALYST].includes(persona)) {
        title = persona === PersonaEnum.GENIUS ? "Code Snippets" : "Diagrams";
        const allSnippets = modelMessages.flatMap((message, msgIndex) => 
            message.text.split(/```/g)
                .map((part, partIndex) => ({ part, index: partIndex }))
                .filter(p => p.index % 2 !== 0)
                .map((p, snippetIndex) => {
                    const lines = p.part.split('\n');
                    let language = '';
                    let code = p.part;
                    if (lines.length > 1 && !/\s/.test(lines[0].trim()) && lines[0].trim().length < 20) {
                        language = lines[0].trim().toLowerCase();
                        code = lines.slice(1).join('\n');
                    }
                    return { language, code: code.trim(), key: `${msgIndex}-${snippetIndex}`};
                })
        ).filter(s => {
            if (!s.code) return false;
            if (persona === PersonaEnum.GENIUS && s.language !== 'mermaid') return true;
            if ([PersonaEnum.ARCHITECT, PersonaEnum.CSV_ANALYST].includes(persona) && s.language === 'mermaid') return true;
            return false;
        }).map((s, i) => ({ ...s, language: getFilenameForLanguage(s.language, i)}));
        
        content = allSnippets.length > 0 ? (
            <ul className="space-y-1">
                {allSnippets.map((snippet) => (
                    <SnippetItem key={snippet.key} snippet={snippet} theme={theme} />
                ))}
            </ul>
        ) : <p className={`text-sm ${tc.placeholderText}`}>{title} from the conversation will appear here.</p>;

    } else if (persona === PersonaEnum.RESEARCHER) {
        title = "Sources";
        const allSources = modelMessages.flatMap(msg => msg.sources || []);
        const uniqueSources = Array.from(new Map(allSources.map(s => [s.uri, s])).values());
        
        content = uniqueSources.length > 0 ? (
            <ul className="space-y-1">
                {uniqueSources.map(source => (
                    <li key={source.uri}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className={`p-2 text-sm flex items-start gap-2 rounded-md ${tc.sourceItem} ${tc.sourceLink}`}>
                            <LinkIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tc.sourceIcon}`} />
                            <span className="truncate hover:underline">{source.title || source.uri}</span>
                        </a>
                    </li>
                ))}
            </ul>
        ) : <p className={`text-sm ${tc.placeholderText}`}>Cited sources from the conversation will appear here.</p>;
    } else {
         content = <p className={`text-sm ${tc.placeholderText}`}>Context-aware information will appear here based on the active persona.</p>;
    }


    return (
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-16'} h-full flex-shrink-0`}>
             <div className={`h-full flex flex-col transition-colors duration-300 ${tc.panel}`}>
                <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4 border-b shrink-0 h-16 ${tc.header}`}>
                    {isOpen && <h2 className={`text-lg font-bold animate-in fade-in duration-500 ${tc.title}`}>{title}</h2>}
                    <button onClick={onToggle} className={`p-2 rounded-full transition-colors ${tc.toggleButton}`} aria-label={isOpen ? "Collapse panel" : "Expand panel"}>
                       {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                    </button>
                </div>
                {isOpen && (
                     <div className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700/50 animate-in fade-in duration-500">
                        {content}
                    </div>
                )}
            </div>
        </div>
    );
};
