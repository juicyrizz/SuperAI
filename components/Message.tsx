
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Theme, Persona, GroundingSource } from '../types';
import { Persona as PersonaEnum } from '../types';
import { PERSONAS, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowPathIcon, EllipsisHorizontalIcon, XMarkIcon } from '../constants';
import { Theme as ThemeEnum } from '../types';
import MermaidDiagram from './MermaidDiagram.tsx';

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> );
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> );
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> );
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>);

const getThemeClasses = (theme: Theme, role: 'user' | 'model') => {
    const base = {
      [ThemeEnum.LIGHT]: {
        messageBg: role === 'user' ? 'bg-blue-100' : 'bg-gray-200',
        messageText: role === 'user' ? 'text-blue-900' : 'text-gray-800',
        avatarBg: role === 'user' ? 'bg-blue-200' : 'bg-gray-300',
        avatarIcon: role === 'user' ? 'text-blue-600' : 'text-gray-600',
        prose: 'prose-gray',
        sourceBg: 'bg-gray-200/50',
        sourceBorder: 'border-gray-300',
        sourceText: 'text-gray-600',
        sourceLink: 'text-blue-600 hover:underline',
        popover: 'bg-white border-gray-200',
        popoverButton: 'text-gray-700 hover:bg-gray-100',
        popoverIcon: 'text-gray-500',
      },
      [ThemeEnum.DARK]: {
        messageBg: role === 'user' ? 'bg-slate-700' : 'bg-gray-800',
        messageText: role === 'user' ? 'text-slate-100' : 'text-slate-200',
        avatarBg: role === 'user' ? 'bg-slate-600' : 'bg-gray-700',
        avatarIcon: role === 'user' ? 'text-slate-300' : 'text-gray-400',
        prose: 'prose-invert',
        sourceBg: 'bg-gray-900/50',
        sourceBorder: 'border-gray-700',
        sourceText: 'text-slate-400',
        sourceLink: 'text-blue-400 hover:underline',
        popover: 'bg-gray-800 border-gray-700',
        popoverButton: 'text-slate-200 hover:bg-gray-700',
        popoverIcon: 'text-slate-400',
      },
      [ThemeEnum.TRANSPARENT]: {
        messageBg: role === 'user' ? 'bg-white/10' : 'bg-black/20',
        messageText: role === 'user' ? 'text-slate-100' : 'text-slate-200',
        avatarBg: role === 'user' ? 'bg-white/20' : 'bg-black/30',
        avatarIcon: role === 'user' ? 'text-slate-300' : 'text-gray-400',
        prose: 'prose-invert',
        sourceBg: 'bg-black/20',
        sourceBorder: 'border-gray-700/50',
        sourceText: 'text-slate-400',
        sourceLink: 'text-blue-400 hover:underline',
        popover: 'bg-gray-800/80 border-gray-600/50 backdrop-blur-md',
        popoverButton: 'text-slate-200 hover:bg-white/10',
        popoverIcon: 'text-slate-400',
      }
    };
    return base[theme];
};

interface MessageContentProps {
    text: string;
    theme: Theme;
    persona: Persona;
    isStreaming: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ text, theme, persona, isStreaming }) => {
  const tc = getThemeClasses(theme, 'model');

  const contentParts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`prose ${tc.prose} max-w-none text-sm lg:text-base`}>
        {contentParts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const codeBlock = part.slice(3, -3);
                const lines = codeBlock.split('\n');
                const language = lines[0].trim();
                const code = lines.slice(1).join('\n');

                if (language === 'mermaid') {
                    return <MermaidDiagram key={index} chart={code} theme={theme} />;
                }
                
                return (
                    <pre key={index} className="not-prose my-2 p-3 rounded-md bg-black/30 text-sm font-mono whitespace-pre-wrap overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/50">
                        {code}
                    </pre>
                );
            }
            // Use pre-wrap to respect newlines and spaces, similar to how markdown would render them in paragraphs.
            return <p key={index} style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{part}</p>;
        })}
        {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />}
    </div>
  );
};


interface MessageProps {
  message: ChatMessage;
  persona: Persona;
  onSaveEdit: (messageId: string, editedText: string) => void;
  isEditable: boolean;
  isStreaming: boolean;
  theme: Theme;
  onRegenerate: () => void;
  isLastModelMessage: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, persona, onSaveEdit, isEditable, isStreaming, theme, onRegenerate, isLastModelMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message.text);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showActions, setShowActions] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const tc = getThemeClasses(theme, message.role);
    const PersonaIcon = PERSONAS[persona].icon;

    useEffect(() => setEditedText(message.text), [message.text]);
    
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.focus();
        }
    }, [isEditing, editedText]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleSave = () => {
        onSaveEdit(message.id, editedText);
        setIsEditing(false);
    };

    const handleToggleSpeech = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(message.text);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            utteranceRef.current = utterance;
            speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setShowActions(false);
            }, 1500);
        });
    };

    const handleRegenerate = () => {
        onRegenerate();
        setShowActions(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowActions(false);
    };

    const actionItems = [
      { id: 'copy', label: isCopied ? 'Copied!' : 'Copy', icon: isCopied ? CheckIcon : ClipboardIcon, action: handleCopy, disabled: isCopied },
      { id: 'speak', label: isSpeaking ? 'Stop' : 'Speak', icon: isSpeaking ? SpeakerXMarkIcon : SpeakerWaveIcon, action: handleToggleSpeech },
      ...(isEditable ? [{ id: 'edit', label: 'Edit', icon: PencilIcon, action: handleEdit }] : []),
      ...(isLastModelMessage ? [{ id: 'regenerate', label: 'Regenerate', icon: ArrowPathIcon, action: handleRegenerate }] : []),
    ];

    return (
        <div className={`group flex gap-3 lg:gap-4 animate-in fade-in-25 slide-in-from-bottom-2 duration-300 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'model' && (
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${tc.avatarBg}`}>
                    <PersonaIcon className={`w-5 h-5 lg:w-6 lg:h-6 ${tc.avatarIcon}`} />
                </div>
            )}
            <div className={`w-full max-w-xl xl:max-w-3xl rounded-xl p-3 lg:p-4 ${tc.messageBg} ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.attachment && (
                    <div className="mb-2">
                        <img src={message.attachment.url} alt={message.attachment.name} className="max-w-xs max-h-64 rounded-lg object-contain" />
                    </div>
                )}
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            ref={textareaRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className={`w-full bg-black/20 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none ${tc.messageText}`}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md bg-gray-600 hover:bg-gray-500 text-white">Cancel</button>
                            <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white">Save</button>
                        </div>
                    </div>
                ) : (
                    <MessageContent text={message.text} theme={theme} persona={persona} isStreaming={isStreaming} />
                )}
                {message.sources && message.sources.length > 0 && (
                     <div className={`mt-3 pt-3 border-t ${tc.sourceBorder}`}>
                        <h4 className={`text-xs font-semibold mb-1 ${tc.sourceText}`}>Sources</h4>
                        <ul className="text-xs space-y-1">
                            {message.sources.map(source => (
                                <li key={source.uri} className="flex items-start gap-1.5">
                                    <LinkIcon className="w-3 h-3 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className={`truncate ${tc.sourceLink}`}>{source.title || source.uri}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className={`relative flex-shrink-0 self-start ${message.role === 'user' ? 'order-1 mr-1' : 'order-2 ml-1'}`} ref={actionsRef}>
                <button 
                    onClick={() => setShowActions(!showActions)}
                    className={`p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${showActions ? `opacity-100 ${tc.popoverButton}`: `text-gray-500 hover:bg-gray-500/10`}`}
                >
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>

                {showActions && (
                    <div className={`absolute top-8 z-20 w-36 rounded-lg border shadow-lg animate-in fade-in-75 zoom-in-95 ${tc.popover} ${message.role === 'user' ? 'right-0' : 'left-0'}`}>
                        <div className="p-1">
                            {actionItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    disabled={item.disabled}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-left transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${tc.popoverButton}`}
                                >
                                    <item.icon className={`w-4 h-4 ${tc.popoverIcon}`} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {message.role === 'user' && (
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tc.avatarBg} order-3`}>
                    <UserIcon className={`w-5 h-5 lg:w-6 lg:h-6 ${tc.avatarIcon}`} />
                </div>
            )}
        </div>
    );
};
