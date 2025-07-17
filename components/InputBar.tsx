import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Attachment, Theme } from '../types';
import { Theme as ThemeEnum } from '../types';
import { StopIcon } from '../constants';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface InputBarProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onSetDocumentContext: (filename: string, content: string) => void;
  onStopGeneration: () => void;
  disabled: boolean;
  theme: Theme;
}

const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" /></svg>
);
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
);
const PaperClipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 18.375 12.74Z" /></svg>
);
const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
);

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, onSetDocumentContext, onStopGeneration, disabled, theme }) => {
  const [inputValue, setInputValue] = useState('');
  const [attachedFile, setAttachedFile] = useState<Attachment | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptBaseRef = useRef('');

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const TEXT_MIME_TYPES = ['text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/html', 'text/css', 'text/javascript', 'application/x-javascript'];

  const processFile = (file: File) => {
    if (TEXT_MIME_TYPES.includes(file.type) || file.name.endsWith('.md') || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onSetDocumentContext(file.name, content);
            setAttachedFile(null);
        };
        reader.readAsText(file);
    } else {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const base64 = dataUrl.split(',')[1];
            setAttachedFile({
                url: dataUrl,
                base64,
                mimeType: file.type,
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let final_transcript = '';
        let interim_transcript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        setInputValue(transcriptBaseRef.current + final_transcript + interim_transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        transcriptBaseRef.current = '';
      };

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current = recognition;
    }

    const handlePaste = (event: ClipboardEvent) => {
      if (disabled) return;
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
             processFile(file);
             event.preventDefault();
             break;
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => {
        document.removeEventListener('paste', handlePaste);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [disabled, onSetDocumentContext]);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        processFile(file);
    }
    if (event.target) event.target.value = "";
  };

  const handleSend = () => {
    if ((inputValue.trim() || attachedFile) && !disabled) {
      onSendMessage(inputValue, attachedFile);
      setInputValue('');
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current) {
      console.warn('Speech Recognition not available.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      transcriptBaseRef.current = inputValue.trim() ? inputValue.trim() + ' ' : '';
      recognitionRef.current.start();
    }
  }, [isListening, inputValue]);

  const themeClasses = {
    [ThemeEnum.LIGHT]: {
      container: "",
      attachmentPreview: "bg-gray-200",
      attachmentIcon: "text-gray-500",
      attachmentText: "text-gray-600",
      removeButtonBg: "bg-gray-200",
      removeButtonText: "text-gray-600",
      inputContainer: "bg-white border border-gray-300",
      button: "text-gray-500 hover:text-gray-800",
      textarea: "text-gray-800 placeholder-gray-400",
      micListening: "text-red-500",
      sendButton: "text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300",
      stopButton: "text-white bg-red-500 hover:bg-red-600",
    },
    [ThemeEnum.DARK]: {
      container: "",
      attachmentPreview: "bg-gray-800",
      attachmentIcon: "text-slate-400",
      attachmentText: "text-slate-400",
      removeButtonBg: "bg-gray-800",
      removeButtonText: "text-gray-200",
      inputContainer: "bg-gray-800/80 border border-gray-700",
      button: "text-gray-400 hover:text-white",
      textarea: "text-white placeholder-gray-500",
      micListening: "text-red-500",
      sendButton: "text-white bg-slate-600 hover:bg-slate-500 disabled:bg-gray-700 disabled:text-gray-400",
      stopButton: "text-white bg-red-600 hover:bg-red-500",
    },
    [ThemeEnum.TRANSPARENT]: {
      container: "",
      attachmentPreview: "bg-gray-800/80",
      attachmentIcon: "text-slate-400",
      attachmentText: "text-slate-300",
      removeButtonBg: "bg-gray-800/90",
      removeButtonText: "text-gray-200",
      inputContainer: "bg-gray-900/50 border border-gray-600/50 backdrop-blur-sm",
      button: "text-gray-400 hover:text-white",
      textarea: "text-white placeholder-gray-400",
      micListening: "text-red-500",
      sendButton: "text-white bg-slate-600 hover:bg-slate-500 disabled:bg-gray-700 disabled:text-gray-400",
      stopButton: "text-white bg-red-600/80 hover:bg-red-500/80",
    }
  };
  const tc = themeClasses[theme];
  
  const placeholderText = attachedFile ? "Describe the file..." : "Ask Super Syntax...";

  return (
    <div className={`transition-colors duration-300 ${tc.container}`}>
      {attachedFile && (
        <div className={`relative inline-block mb-2 p-2 rounded-lg transition-colors duration-300 ${tc.attachmentPreview}`}>
          {attachedFile.mimeType.startsWith('image/') ? (
             <img src={attachedFile.url} alt="Pasted content" className="w-24 h-24 object-cover rounded-md" />
          ): (
            <div className="w-24 h-24 flex flex-col items-center justify-center text-center">
                <DocumentIcon className={`w-10 h-10 ${tc.attachmentIcon}`} />
                <p className={`text-xs mt-2 break-all line-clamp-2 ${tc.attachmentText}`}>{attachedFile.name}</p>
            </div>
          )}
          <button onClick={() => setAttachedFile(null)} className={`absolute -top-2 -right-2 rounded-full ${tc.removeButtonBg}`}>
            <XCircleIcon className={`w-6 h-6 ${tc.removeButtonText}`}/>
          </button>
        </div>
      )}
      <div className={`flex items-end rounded-xl p-2 transition-colors duration-300 ${tc.inputContainer}`}>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden"
            accept="image/*,text/*,.md,.csv,.json"
        />
        <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || !!attachedFile}
            className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${tc.button}`}
            aria-label="Attach file"
        >
          <PaperClipIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholderText}
          className={`flex-grow bg-transparent focus:outline-none resize-none px-2 sm:px-3 py-1.5 max-h-48 overflow-y-auto transition-colors duration-300 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/50 ${tc.textarea}`}
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={handleMicClick}
          disabled={disabled}
          className={`p-2 rounded-full transition-colors ${tc.button} ${isListening ? `animate-pulse ${tc.micListening}` : ''}`}
        >
          <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {disabled ? (
            <button
              onClick={onStopGeneration}
              className={`ml-2 p-2 rounded-lg transition-all duration-200 ${tc.stopButton}`}
              aria-label="Stop generation"
            >
              <StopIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        ) : (
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && !attachedFile}
              className={`ml-2 p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed ${tc.sendButton}`}
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        )}
      </div>
    </div>
  );
};