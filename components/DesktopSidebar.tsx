
import React, {useState, useMemo} from 'react';
import { GENERATION_MODES, PERSONAS, THEMES } from '../constants';
import type { GenerationMode, Theme, Persona, Conversation } from '../types';
import { Theme as ThemeEnum } from '../types';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '../constants';

const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg> );

interface DesktopSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    activeConversation: Conversation | null | undefined;
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

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ 
    conversations, activeConversationId, activeConversation, onNewChat, onSwitchChat, onDeleteChat, onExportChat,
    currentMode, onSwitchMode, currentPersona, onSwitchPersona, onAboutClick, theme,
    currentTheme, onSwitchTheme
 }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const themeClasses = {
        [ThemeEnum.LIGHT]: {
            sidebar: "bg-gray-100 text-gray-800 border-r border-gray-200",
            title: "text-gray-800",
            sectionTitle: "text-gray-500",
            item: "text-gray-700 hover:bg-gray-200",
            itemSelected: "bg-blue-100 text-blue-800 font-semibold",
            itemIcon: "text-gray-500",
            itemIconSelected: "text-blue-700",
            itemDescription: "text-gray-500",
            itemDescriptionSelected: "text-blue-600",
            footer: "border-gray-200",
            deleteButton: "text-gray-500 hover:text-red-500",
            newChatButton: "bg-blue-500 text-white hover:bg-blue-600",
            searchInput: "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500",
            searchIcon: "text-gray-400",
        },
        [ThemeEnum.DARK]: {
            sidebar: "bg-gray-900 text-slate-200 border-r border-gray-800",
            title: "bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-400",
            sectionTitle: "text-gray-500",
            item: "text-slate-300 hover:bg-slate-800",
            itemSelected: "bg-slate-700 text-white font-semibold",
            itemIcon: "text-slate-400",
            itemIconSelected: "text-slate-200",
            itemDescription: "text-slate-400",
            itemDescriptionSelected: "text-slate-300",
            footer: "border-gray-800",
            deleteButton: "text-gray-500 hover:text-red-400",
            newChatButton: "bg-slate-700 text-slate-200 hover:bg-slate-600",
            searchInput: "bg-gray-800 border-gray-700 text-slate-200 placeholder-gray-500 focus:ring-slate-500 focus:border-slate-500",
            searchIcon: "text-gray-500",
        },
        [ThemeEnum.TRANSPARENT]: {
            sidebar: "bg-gray-900/60 text-slate-200 backdrop-blur-lg border-r border-gray-700/50",
            title: "bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-400",
            sectionTitle: "text-gray-500",
            item: "text-slate-300 hover:bg-white/5",
            itemSelected: "bg-white/10 text-white font-semibold",
            itemIcon: "text-slate-400",
            itemIconSelected: "text-slate-200",
            itemDescription: "text-slate-400",
            itemDescriptionSelected: "text-slate-300",
            footer: "border-gray-700/50",
            deleteButton: "text-gray-500 hover:text-red-400",
            newChatButton: "bg-white/10 text-slate-200 hover:bg-white/20",
            searchInput: "bg-white/5 border-gray-600/50 text-slate-200 placeholder-gray-400 focus:ring-slate-400 focus:border-slate-400",
            searchIcon: "text-gray-400",
        }
    };
    const tc = themeClasses[theme];

    const filteredConversations = useMemo(() => 
        conversations.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
        ), [conversations, searchQuery]
    );

    return (
        <div className={`w-72 h-full flex-shrink-0 flex flex-col transition-colors duration-300 ${tc.sidebar}`}>
            <div className="flex items-center justify-center p-4 border-b shrink-0 h-16 border-white/5">
                <h1 className={`text-2xl font-bold ${tc.title}`}>
                    Super Syntax
                </h1>
            </div>

            <div className="flex-grow p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700/50">
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
                    <div className="relative px-2 mb-2">
                        <MagnifyingGlassIcon className={`absolute top-1/2 left-5 -translate-y-1/2 w-4 h-4 ${tc.searchIcon}`} />
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
                            const Icon = PERSONAS[conv.persona]?.icon || PERSONAS.Genius.icon;
                            return (
                                <div key={conv.id} className="group flex items-center">
                                    <button
                                        onClick={() => onSwitchChat(conv.id)}
                                        className={`flex-grow flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                        title={`Switch to: ${conv.title}`}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                        <p className="text-sm truncate flex-grow">{conv.title}</p>
                                    </button>
                                    <button 
                                        onClick={() => onDeleteChat(conv.id)}
                                        className={`ml-2 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${tc.deleteButton}`} 
                                        aria-label="Delete chat"
                                        title="Delete Chat"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Persona Selector */}
                <div>
                    <h3 className={`text-sm font-semibold px-2 mb-2 uppercase tracking-wider ${tc.sectionTitle}`}>Persona</h3>
                    <div className="space-y-1">
                        {Object.values(PERSONAS).map((personaDetails) => {
                            const isSelected = currentPersona === personaDetails.id;
                            const Icon = personaDetails.icon;
                            return (
                                <button
                                    key={personaDetails.id}
                                    onClick={() => onSwitchPersona(personaDetails.id)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${ isSelected ? tc.itemSelected : tc.item }`}
                                    title={personaDetails.description}
                                >
                                    <Icon className={`w-6 h-6 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                    <div>
                                        <p className="text-sm">{personaDetails.title}</p>
                                        <p className={`text-xs ${isSelected ? tc.itemDescriptionSelected : tc.itemDescription}`}>{personaDetails.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Generation Mode Selector */}
                <div>
                    <h3 className={`text-sm font-semibold px-2 mb-2 uppercase tracking-wider ${tc.sectionTitle}`}>Mode</h3>
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
                                    <Icon className={`w-6 h-6 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                    <div>
                                        <p className="text-sm">{modeDetails.title}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Theme Selector */}
                <div>
                    <h3 className={`text-sm font-semibold px-2 mb-2 uppercase tracking-wider ${tc.sectionTitle}`}>Theme</h3>
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
                                    <Icon className={`w-6 h-6 flex-shrink-0 ${isSelected ? tc.itemIconSelected : tc.itemIcon}`} />
                                    <p className="text-sm">{themeDetails.title}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={`p-2 border-t shrink-0 transition-colors duration-300 ${tc.footer}`}>
                <button 
                    onClick={onAboutClick}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors duration-150 ${tc.item}`}
                    title="About Super Syntax">
                    <InformationCircleIcon className={`w-6 h-6 flex-shrink-0 ${tc.itemIcon}`} />
                    <p className="font-semibold text-sm">About</p>
                </button>
            </div>
        </div>
    );
};
