
import React, {useState, useMemo} from 'react';
import { GENERATION_MODES, PERSONAS, THEMES } from '../constants';
import type { GenerationMode, Theme, Persona, Conversation } from '../types';
import { Theme as ThemeEnum } from '../types';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '../constants';

const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> );
const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg> );


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    activeConversationId: string | null;
    activeConversation: Conversation | undefined | null;
    onNewChat: (persona?: Persona) => void;
    onSwitchChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onExportChat: () => void;
    currentMode: GenerationMode;
    onSwitchMode: (mode: GenerationMode) => void;
    currentPersona: Persona;
    onSwitchPersona: (persona: Persona) => void;
    onAboutClick: () => void;
    theme: Theme;
    currentTheme: Theme;
    onSwitchTheme: (theme: Theme) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose, conversations, activeConversationId, activeConversation, onNewChat, onSwitchChat, onDeleteChat, onExportChat,
    currentMode, onSwitchMode, currentPersona, onSwitchPersona, onAboutClick, theme,
    currentTheme, onSwitchTheme,
}) => {
    
    const [searchQuery, setSearchQuery] = useState('');

    const handleSwitch = (id: string) => {
        onSwitchChat(id);
        onClose();
    };
    
    const handlePersonaSelect = (persona: Persona) => {
        onSwitchPersona(persona);
        onClose();
    };

    const handleAboutClick = () => {
        onAboutClick();
        onClose();
    }

    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            overlay: "bg-black/40",
            sidebar: "bg-gray-50 text-gray-800",
            title: "text-gray-800",
            closeButton: "text-gray-500 hover:bg-gray-200 hover:text-gray-800",
            item: "text-gray-700 hover:bg-gray-200",
            itemSelected: "bg-blue-100/80 text-blue-800 font-semibold",
            itemIcon: "text-gray-500",
            itemIconSelected: "text-blue-700",
            itemDescription: "text-gray-500",
            itemCheck: "text-blue-700",
            footer: "border-gray-200",
            scrollbar: "scrollbar-thumb-gray-400 [&::-webkit-scrollbar-thumb]:bg-gray-400/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400",
            sectionTitle: "text-gray-500",
            deleteButton: "text-gray-500 hover:text-red-500",
            newChatButton: "bg-blue-500 text-white hover:bg-blue-600",
            searchInput: "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
            searchIcon: "text-gray-400",
        },
        [ThemeEnum.DARK]: {
            overlay: "bg-black/60",
            sidebar: "bg-gray-900 text-slate-200",
            title: "text-slate-200",
            closeButton: "text-gray-400 hover:bg-gray-700 hover:text-white",
            item: "text-slate-300 hover:bg-slate-800/80",
            itemSelected: "bg-slate-700/80 text-white font-semibold",
            itemIcon: "text-slate-400",
            itemIconSelected: "text-slate-200",
            itemDescription: "text-slate-400",
            itemCheck: "text-slate-300",
            footer: "border-gray-700",
            scrollbar: "scrollbar-thumb-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-600/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600",
            sectionTitle: "text-gray-500",
            deleteButton: "text-gray-500 hover:text-red-400",
            newChatButton: "bg-slate-700 text-slate-200 hover:bg-slate-600",
            searchInput: "bg-gray-800 border-gray-600 text-slate-200 placeholder-gray-500 focus:ring-slate-500 focus:border-slate-500",
            searchIcon: "text-gray-500",
        },
        [ThemeEnum.TRANSPARENT]: {
            overlay: "bg-black/70 backdrop-blur-sm",
            sidebar: "bg-gray-900/80 text-slate-200 backdrop-blur-md border-r border-gray-600/50",
            title: "text-slate-200",
            closeButton: "text-gray-400 hover:bg-white/10 hover:text-white",
            item: "text-slate-300 hover:bg-white/10",
            itemSelected: "bg-white/20 text-white font-semibold",
            itemIcon: "text-slate-400",
            itemIconSelected: "text-slate-200",
            itemDescription: "text-slate-400",
            itemCheck: "text-slate-300",
            footer: "border-gray-700",
            scrollbar: "scrollbar-thumb-gray-600 [&::-webkit-scrollbar-thumb]:bg-gray-600/70 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600",
            sectionTitle: "text-gray-500",
            deleteButton: "text-gray-500 hover:text-red-400",
            newChatButton: "bg-white/10 text-slate-200 hover:bg-white/20",
            searchInput: "bg-white/5 border-gray-600/50 text-slate-200 placeholder-gray-400 focus:ring-slate-400 focus:border-slate-400",
            searchIcon: "text-gray-400",
        }
    };
    const tc = themeClasses[theme];

    const filteredConversations = useMemo(() => 
        conversations.filter(conv => 
            conv.title.toLowerCase().includes(searchQuery.toLowerCase())
        ), [conversations, searchQuery]
    );

    return (
        <>
            <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${tc.overlay}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className={`fixed top-0 left-0 h-full w-full max-w-xs z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${tc.sidebar}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b shrink-0 border-white/5">
                        <h2 className={`text-xl font-bold ${tc.title}`}>Features</h2>
                        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${tc.closeButton}`} aria-label="Close menu">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className={`
                        flex-grow p-4 space-y-6 overflow-y-auto
                        scrollbar-thin scrollbar-track-transparent
                        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors
                        ${tc.scrollbar}
                    `}>
                        {/* History */}
                        <div>
                            <div className="flex justify-between items-center px-2 mb-2">
                                <h3 className={`text-sm font-semibold uppercase tracking-wider ${tc.sectionTitle}`}>History</h3>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={onExportChat}
                                        disabled={!activeConversation || activeConversation.messages.length === 0}
                                        className={`p-1.5 rounded-md ${tc.newChatButton} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label="Export Chat"
                                        title="Export Chat as Markdown"
                                    >
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onNewChat()} className={`p-1.5 rounded-md ${tc.newChatButton}`} aria-label="New Chat" title="Start a New Chat">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                             <div className="relative mb-2">
                                <MagnifyingGlassIcon className={`absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 ${tc.searchIcon}`} />
                                <input 
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full rounded-md border py-1.5 pl-9 pr-3 text-sm transition-colors ${tc.searchInput}`}
                                />
                            </div>
                            <div className="space-y-1">
                                {filteredConversations.map((conv) => {
                                    const isSelected = activeConversationId === conv.id;
                                    const Icon = PERSONAS[conv.persona].icon;
                                    return (
                                        <div key={conv.id} className="group flex items-center">
                                            <button
                                                onClick={() => handleSwitch(conv.id)}
                                                className={`flex-grow flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                                title={`Switch to: ${conv.title}`}
                                            >
                                                <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                                <p className="text-sm truncate flex-grow">{conv.title}</p>
                                            </button>
                                            <button 
                                                onClick={() => onDeleteChat(conv.id)}
                                                className={`ml-2 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${tc.deleteButton}`} 
                                                aria-label="Delete chat" title="Delete Chat">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Persona */}
                        <div>
                            <h3 className={`text-sm font-semibold uppercase tracking-wider px-2 mb-2 ${tc.sectionTitle}`}>Persona</h3>
                            <div className="space-y-1">
                                {Object.values(PERSONAS).map((personaDetails) => {
                                    const isSelected = currentPersona === personaDetails.id;
                                    const Icon = personaDetails.icon;
                                    return (
                                        <button
                                            key={personaDetails.id}
                                            onClick={() => handlePersonaSelect(personaDetails.id)}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                            title={personaDetails.description}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm">{personaDetails.title}</p>
                                                <p className={`text-xs ${tc.itemDescription}`}>{personaDetails.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                         
                        {/* Generation Mode */}
                        <div>
                            <h3 className={`text-sm font-semibold uppercase tracking-wider px-2 mb-2 ${tc.sectionTitle}`}>Mode</h3>
                            <div className="space-y-1">
                                {Object.values(GENERATION_MODES).map((modeDetails) => {
                                    const isSelected = currentMode === modeDetails.id;
                                    const Icon = modeDetails.icon;
                                    return (
                                        <button
                                            key={modeDetails.id}
                                            onClick={() => onSwitchMode(modeDetails.id)}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                            title={modeDetails.description}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                            <p className="font-semibold text-sm">{modeDetails.title}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Theme */}
                        <div>
                            <h3 className={`text-sm font-semibold uppercase tracking-wider px-2 mb-2 ${tc.sectionTitle}`}>Theme</h3>
                            <div className="space-y-1">
                                {Object.values(THEMES).map((themeDetails) => {
                                    const isSelected = currentTheme === themeDetails.id;
                                    const Icon = themeDetails.icon;
                                    return (
                                        <button
                                            key={themeDetails.id}
                                            onClick={() => onSwitchTheme(themeDetails.id)}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                            title={`Switch to ${themeDetails.title} Theme`}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                            <p className="text-sm">{themeDetails.title}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={`p-2 border-t shrink-0 transition-colors duration-300 ${tc.footer}`}>
                        <button 
                            onClick={handleAboutClick}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${tc.item}`}
                            title="About Super Syntax">
                            <InformationCircleIcon className={`w-6 h-6 flex-shrink-0 ${tc.itemIcon}`} />
                            <p className="font-semibold text-sm">About</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
