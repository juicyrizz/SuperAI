import React, { useState, useEffect, useMemo } from 'react';
import { useSuperSyntax } from './hooks/useSuperSyntax';
import { Persona, Theme, GenerationMode } from './types';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { Sidebar } from './components/Sidebar.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { Intro } from './components/Intro.tsx';
import { useMediaQuery } from './hooks/useMediaQuery.ts';
import { DesktopSidebar } from './components/DesktopSidebar.tsx';
import { ContextPanel } from './components/ContextPanel.tsx';

declare const VANTA: any;

function App() {
  const { 
    conversations,
    activeConversation,
    activeConversationId,
    isLoading, 
    error, 
    sendMessage, 
    stopGeneration,
    saveTrainingExample,
    switchPersona, 
    switchGenerationMode,
    newChat,
    deleteChat,
    switchChat,
    exportActiveConversation,
    setDocumentContext,
    clearDocumentContext,
    regenerateResponse,
  } = useSuperSyntax();

  const [theme, setTheme] = useState<Theme>(Theme.TRANSPARENT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const persona = activeConversation?.persona ?? Persona.GENIUS;
  const generationMode = activeConversation?.generationMode ?? GenerationMode.BALANCED;
  const chatHistory = activeConversation?.messages ?? [];
  const documentContext = activeConversation?.documentContext;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

    const requestMicrophonePermissionForAndroid = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error('Microphone permission was denied by the user.', err);
        }
      }
    };
    
    if (/android/i.test(navigator.userAgent)) {
      requestMicrophonePermissionForAndroid();
    }

    return () => clearTimeout(timer);
  }, []);

  // Vanta.js background effect for desktop
  useEffect(() => {
    let vantaInstance: any;
    if (isDesktop && typeof VANTA !== 'undefined') {
       vantaInstance = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: theme === Theme.LIGHT ? 0x9ca3af : 0x4b5563, // gray-400 or gray-600
        backgroundColor: theme === Theme.LIGHT ? 0xffffff : 0x000000,
        points: 8.00,
        maxDistance: 18.00,
        spacing: 18.00,
      });
    }

    return () => {
      if (vantaInstance) {
        vantaInstance.destroy();
      }
    };
  }, [isDesktop, theme]);

  const themeClasses: Record<Theme, string> = {
    [Theme.LIGHT]: "bg-gray-100 border-gray-200",
    [Theme.DARK]: "bg-gray-900 border-gray-700 shadow-2xl shadow-gray-800/50",
    [Theme.TRANSPARENT]: "bg-gray-900/70 border-gray-600/50 shadow-2xl shadow-black/50 backdrop-blur-md"
  };
  
  const bodyThemeClass = useMemo(() => {
     if (isDesktop) return theme === Theme.LIGHT ? 'bg-white' : 'bg-black';
     return themeClasses[theme].split(' ').find(c => c.startsWith('bg-')) || 'bg-black';
  }, [isDesktop, theme]);

  useEffect(() => {
      document.body.className = `transition-colors duration-300 ${bodyThemeClass}`;
  }, [bodyThemeClass]);

  return (
    <>
      <div id="vanta-bg" className="fixed top-0 left-0 w-full h-full z-0"></div>
      <div className={`font-sans flex justify-center items-center min-h-[100dvh] transition-colors duration-300 relative z-10 sm:p-4`}>
        <div className={`w-full h-[100dvh] flex overflow-hidden transition-all duration-300 ${isDesktop ? `max-w-7xl sm:h-[95vh] sm:rounded-3xl ${themeClasses[theme]}` : ''}`}>
          
          {/* Intro Screen */}
          <div className={`absolute inset-0 z-50 transition-opacity duration-300 ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Intro theme={theme} />
          </div>

          {/* Desktop Layout */}
          {isDesktop && (
            <>
              <DesktopSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                activeConversation={activeConversation}
                onNewChat={newChat}
                onSwitchChat={switchChat}
                onDeleteChat={deleteChat}
                onExportChat={exportActiveConversation}
                currentMode={generationMode}
                onSwitchMode={switchGenerationMode}
                currentPersona={persona}
                onSwitchPersona={switchPersona}
                onAboutClick={() => setIsAboutModalOpen(true)}
                theme={theme}
                currentTheme={theme}
                onSwitchTheme={setTheme}
              />
               <main className="flex-grow flex flex-col min-w-0">
                  <div className="flex-grow relative overflow-hidden">
                    <ChatWindow
                      chatHistory={chatHistory}
                      onSaveTrainingExample={saveTrainingExample}
                      persona={persona}
                      theme={theme}
                      isLoading={isLoading}
                      generationMode={generationMode}
                      onRegenerateResponse={regenerateResponse}
                    />
                  </div>
                  <div className="w-full z-10 p-4">
                      {error && <div className="p-2 mx-4 mb-2 text-sm text-center text-red-300 bg-red-900/70 rounded-lg shadow-lg">{error}</div>}
                      <InputBar onSendMessage={sendMessage} onStopGeneration={stopGeneration} disabled={isLoading} theme={theme} onSetDocumentContext={setDocumentContext} />
                  </div>
              </main>
              <ContextPanel
                isOpen={isContextPanelOpen}
                onToggle={() => setIsContextPanelOpen(!isContextPanelOpen)}
                chatHistory={chatHistory}
                persona={persona}
                theme={theme}
                documentContext={documentContext}
                onClearDocumentContext={clearDocumentContext}
              />
            </>
          )}

          {/* Mobile Layout */}
          {!isDesktop && (
             <div className={`w-full max-w-2xl h-[100dvh] flex flex-col overflow-hidden transition-all duration-300 relative ${themeClasses[theme]}`}>
                <div className={`w-full h-full flex flex-col transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
                    <Header 
                      onMenuClick={() => setIsSidebarOpen(true)}
                      currentTheme={theme}
                      onSwitchTheme={setTheme}
                    />
                    <div className="flex-grow relative overflow-hidden">
                      <ChatWindow
                        chatHistory={chatHistory}
                        onSaveTrainingExample={saveTrainingExample}
                        persona={persona}
                        theme={theme}
                        isLoading={isLoading}
                        generationMode={generationMode}
                        onRegenerateResponse={regenerateResponse}
                      />
                    </div>
                     <div className="w-full z-10 p-2">
                        {error && <div className="p-2 mx-4 mb-1 text-sm text-center text-red-300 bg-red-900/70 rounded-lg shadow-lg">{error}</div>}
                        <InputBar onSendMessage={sendMessage} onStopGeneration={stopGeneration} disabled={isLoading} theme={theme} onSetDocumentContext={setDocumentContext} />
                    </div>
                </div>
            </div>
          )}
          
          {/* Modals & Mobile Sidebar (Common) */}
           <Sidebar 
              isOpen={isSidebarOpen && !isDesktop}
              onClose={() => setIsSidebarOpen(false)}
              conversations={conversations}
              activeConversationId={activeConversationId}
              activeConversation={activeConversation}
              onNewChat={newChat}
              onSwitchChat={switchChat}
              onDeleteChat={deleteChat}
              onExportChat={exportActiveConversation}
              currentMode={generationMode}
              onSwitchMode={switchGenerationMode}
              currentPersona={persona}
              onSwitchPersona={switchPersona}
              onAboutClick={() => setIsAboutModalOpen(true)}
              theme={theme}
              currentTheme={theme}
              onSwitchTheme={setTheme}
          />
          <AboutModal 
              isOpen={isAboutModalOpen}
              onClose={() => setIsAboutModalOpen(false)}
              theme={theme}
          />

        </div>
      </div>
    </>
  );
}

export default App;