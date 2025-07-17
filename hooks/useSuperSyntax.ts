import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Content, Part } from '@google/genai';
import { Persona, GenerationMode, ProjectState } from '../types';
import type { ChatMessage, GroundingSource, FineTuningExample, Attachment, Conversation } from '../types';
import { PERSONAS } from '../constants';
import * as trainingService from '../services/trainingService';
import JSZip from 'jszip';

const API_KEY = process.env.API_KEY;
const STORAGE_KEY = 'super-syntax-conversations';

const createNewConversation = (persona: Persona = Persona.GENIUS): Conversation => ({
  id: Date.now().toString(),
  title: 'New Chat',
  messages: [],
  persona: persona,
  generationMode: GenerationMode.BALANCED,
  createdAt: Date.now(),
  documentContext: undefined,
  projectState: { isActive: false, files: [] },
});

export interface UseSuperSyntaxReturn {
    conversations: Conversation[];
    activeConversation: Conversation | undefined;
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;
    sendMessage: (text: string, attachment?: Attachment, isHidden?: boolean) => Promise<void>;
    stopGeneration: () => void;
    saveTrainingExample: (messageId: string, editedText: string) => void;
    switchPersona: (newPersona: Persona) => void;
    switchGenerationMode: (mode: GenerationMode) => void;
    newChat: (persona?: Persona) => void;
    deleteChat: (id: string) => void;
    switchChat: (id: string) => void;
    exportActiveConversation: () => void;
    setDocumentContext: (filename: string, content: string) => void;
    clearDocumentContext: () => void;
    regenerateResponse: () => Promise<void>;
}

export const useSuperSyntax = (): UseSuperSyntaxReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!API_KEY) {
      setError('API key not found. Please set the API_KEY environment variable.');
      return;
    }
    aiRef.current = new GoogleGenAI({ apiKey: API_KEY });

    // Load conversations from local storage
    try {
      const storedConversations = localStorage.getItem(STORAGE_KEY);
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations) as Conversation[];
        if(parsed.length > 0) {
            setConversations(parsed.map(c => ({...c, projectState: c.projectState || { isActive: false, files: [] }}))); // Backwards compatibility
            setActiveConversationId(parsed[0].id); // Activate the most recent one
        } else {
             const newConv = createNewConversation();
             setConversations([newConv]);
             setActiveConversationId(newConv.id);
        }
      } else {
        const newConv = createNewConversation();
        setConversations([newConv]);
        setActiveConversationId(newConv.id);
      }
    } catch (e) {
      console.error("Failed to load conversations from storage", e);
      const newConv = createNewConversation();
      setConversations([newConv]);
      setActiveConversationId(newConv.id);
    }
  }, []);
  
  // Save conversations to local storage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      try {
        // Sort by creation date descending before saving
        const sortedConversations = [...conversations].sort((a, b) => b.createdAt - a.createdAt);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedConversations));
      } catch (e) {
        console.error("Failed to save conversations to storage", e);
      }
    }
  }, [conversations]);

  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId);
  }, [conversations, activeConversationId]);
  
  const updateConversation = useCallback((id: string, updates: Partial<Conversation> | ((conv: Conversation) => Partial<Conversation>)) => {
      setConversations(prev =>
          prev.map(c =>
              c.id === id ? { ...c, ...(typeof updates === 'function' ? updates(c) : updates) } : c
          )
      );
  }, []);

  const generateTitleForConversation = useCallback(async (conversation: Conversation) => {
    if (!aiRef.current || conversation.messages.length < 2 || (conversation.projectState?.isActive)) return;
    
    const historyForTitle: Content[] = conversation.messages.map(msg => ({
        role: msg.role,
        parts: [{text: msg.text}]
    })).slice(0, 3); // Use first 3 messages for context

    try {
        const response = await aiRef.current.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: historyForTitle,
            config: {
                systemInstruction: "Based on the conversation so far, create a short, descriptive title (5 words or less). Respond with only the title text, nothing else.",
                temperature: 0.2,
                stopSequences: ['\n'],
            }
        });
        const newTitle = response.text.trim().replace(/"/g, '');
        if (newTitle) {
            updateConversation(conversation.id, { title: newTitle });
        }
    } catch(e) {
        console.error("Failed to generate title:", e);
    }
  }, [updateConversation]);

  useEffect(() => {
    // Automatically generate a title for a new chat after the first exchange.
    if (activeConversation && activeConversation.messages.length === 2 && activeConversation.title === 'New Chat') {
      generateTitleForConversation(activeConversation);
    }
  }, [activeConversation, generateTitleForConversation]);
  
  const sendMessage = useCallback(async (text: string, attachment?: Attachment, isHidden = false) => {
    if (!aiRef.current) {
      setError("AI client is not initialized.");
      return;
    }
    if (!activeConversation) {
        setError("No active conversation.");
        return;
    }
    
    if (!isHidden) {
        setIsLoading(true);
    }
    setError(null);
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      isHidden,
      ...(attachment && { attachment }),
    };
    
    updateConversation(activeConversation.id, (conv) => ({
      messages: [...conv.messages, userMessage],
    }));
    
    const modelMessageId = (Date.now() + 1).toString();
    const modelMessage: ChatMessage = { id: modelMessageId, role: 'model', text: '', sources: [] };
    updateConversation(activeConversation.id, conv => ({ messages: [...conv.messages, modelMessage] }));

    try {
        const currentPersonaDetails = PERSONAS[activeConversation.persona];
        const systemInstruction = activeConversation.documentContext
          ? `The user has provided the following document named "${activeConversation.documentContext.filename}" as context. Use its content as the primary source of truth for your answers. Do not mention that you are using it unless asked. Any question you receive should be interpreted in the context of this document.\n\n---DOCUMENT CONTENT---\n${activeConversation.documentContext.content}\n---END OF DOCUMENT---\n\nOriginal instructions: ${currentPersonaDetails.systemInstruction}`
          : currentPersonaDetails.systemInstruction;
          
        const trainingExamples = trainingService.getExamples(activeConversation.persona);
        const trainingHistory: Content[] = trainingExamples.reverse().flatMap(ex => ([
            { role: 'user', parts: [{ text: ex.userInput }] },
            { role: 'model', parts: [{ text: ex.editedModelOutput }] }
        ]));

        const personaHistory: Content[] = activeConversation.messages
          .slice(0, -2) // Exclude the just-added user and blank model messages
          .map(msg => {
            const parts: Part[] = [];
            if (msg.text && msg.text.trim()) parts.push({ text: msg.text });
            if (msg.attachment) parts.push({ inlineData: { mimeType: msg.attachment.mimeType, data: msg.attachment.base64 } });
            return { role: msg.role, parts: parts };
          }).filter(content => content.parts.length > 0);

        const historyForAPI: Content[] = [...trainingHistory, ...personaHistory];
        
        const config: any = {
            systemInstruction,
        };
        
        if (activeConversation.persona === Persona.RESEARCHER) {
          config.tools = [{ googleSearch: {} }];
        }

        switch (activeConversation.generationMode) {
          case GenerationMode.FAST: config.thinkingConfig = { thinkingBudget: 0 }; break;
          case GenerationMode.THINKING: config.temperature = 0.3; break;
          case GenerationMode.BALANCED: default: break;
        }

        const userParts: Part[] = [];
        if (text.trim()) userParts.push({ text });
        if (attachment) userParts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.base64 } });
      
        const stream = await aiRef.current.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: [...historyForAPI, { role: 'user', parts: userParts }],
          config,
          // @ts-ignore AbortSignal is not yet in the official type, but supported
          signal: abortControllerRef.current.signal,
        });

        let fullText = '';
        const sources: GroundingSource[] = [];
        const uniqueSourceUris = new Set<string>();

        for await (const chunk of stream) {
          fullText += chunk.text;
          
          chunk.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach(gc => {
              if (gc.web?.uri && !uniqueSourceUris.has(gc.web.uri)) {
                  sources.push({ uri: gc.web.uri, title: gc.web.title || gc.web.uri });
                  uniqueSourceUris.add(gc.web.uri);
              }
          });
          
          updateConversation(activeConversation.id, c => ({
              messages: c.messages.map(msg => msg.id === modelMessageId ? { ...msg, text: fullText, sources: [...sources] } : msg)
          }));
        }
    } catch (e: any) {
        if (e.name === 'AbortError') {
            console.log("Generation stopped by user.");
        } else {
            const errorMessage = `Error: ${e.message || 'An unknown error occurred.'}`;
            setError(errorMessage);
             updateConversation(activeConversation.id, c => ({
                  messages: c.messages.map(msg => msg.id === modelMessageId ? { ...msg, text: errorMessage } : msg)
              }));
        }
    } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
    }
  }, [activeConversation, conversations, updateConversation, generateTitleForConversation, setError, setIsLoading]);
  
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsLoading(false);
    }
  }, []);

  const newChat = useCallback((persona?: Persona) => {
      const newConv = createNewConversation(persona);
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
  }, []);
  
  const deleteChat = useCallback((id: string) => {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
          const remainingConversations = conversations.filter(c => c.id !== id);
          if(remainingConversations.length > 0) {
              // Sort by creation date to find the most recent
              const sorted = [...remainingConversations].sort((a,b) => b.createdAt - a.createdAt);
              setActiveConversationId(sorted[0].id)
          } else {
              const newConv = createNewConversation();
              setConversations([newConv]);
              setActiveConversationId(newConv.id);
          }
      }
  }, [activeConversationId, conversations]);

  const switchChat = useCallback((id: string) => {
      setActiveConversationId(id);
  }, []);
  
  const switchPersona = (newPersona: Persona) => {
      if(activeConversationId) {
          if (activeConversation?.messages.length === 0) {
            updateConversation(activeConversationId, { persona: newPersona });
          } else {
            newChat(newPersona);
          }
      }
  };
  
  const switchGenerationMode = (mode: GenerationMode) => {
      if(activeConversationId) {
          updateConversation(activeConversationId, { generationMode: mode });
      }
  };

  const saveTrainingExample = useCallback((messageId: string, editedText: string) => {
    if (!activeConversation) return;
    
    const messageIndex = activeConversation.messages.findIndex(m => m.id === messageId);
    let userPrompt = '';
    if (messageIndex > 0) {
        for(let i = messageIndex - 1; i >= 0; i--) {
            if (activeConversation.messages[i].role === 'user') {
                userPrompt = activeConversation.messages[i].text;
                break;
            }
        }
    }
    if (!userPrompt) return;

    const example: FineTuningExample = {
      userInput: userPrompt,
      editedModelOutput: editedText,
    };
    trainingService.addExample(activeConversation.persona, example);

    updateConversation(activeConversation.id, c => ({
        messages: c.messages.map(msg => msg.id === messageId ? { ...msg, text: editedText } : msg)
    }));
  }, [activeConversation, updateConversation]);

  const exportActiveConversation = useCallback(() => {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    const { title, messages, persona } = activeConversation;
    const personaDetails = PERSONAS[persona];
    const personaTitle = personaDetails ? personaDetails.title : 'Model';

    const markdownContent = messages.map(msg => {
        let content = '';
        if (msg.role === 'user') {
            content += `**User:**\n\n`;
        } else {
            content += `**Super Syntax (${personaTitle}):**\n\n`;
        }

        if (msg.attachment) {
            if (msg.attachment.mimeType.startsWith('image/')) {
                 content += `![Attachment: ${msg.attachment.name}](${msg.attachment.url})\n\n`;
            } else {
                content += `*[Attachment: ${msg.attachment.name}]*\n\n`;
            }
        }
        
        content += msg.text;

        if (msg.sources && msg.sources.length > 0) {
            content += '\n\n**Sources:**\n';
            content += msg.sources.map(s => `- [${s.title || s.uri}](${s.uri})`).join('\n');
        }

        return content;
    }).join('\n\n---\n\n');

    const blob = new Blob([`# ${title}\n\n` + markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[ /]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [activeConversation]);
  
  const setDocumentContext = useCallback((filename: string, content: string) => {
    if (!activeConversationId) return;
    updateConversation(activeConversationId, {
      documentContext: { filename, content }
    });
    // Set attachment to null to avoid conflicts
    setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, messages: c.messages.map(m => ({ ...m, attachment: undefined })) } : c));
  }, [activeConversationId, updateConversation]);

  const clearDocumentContext = useCallback(() => {
    if (!activeConversationId) return;
    updateConversation(activeConversationId, {
      documentContext: undefined
    });
  }, [activeConversationId, updateConversation]);

  const regenerateResponse = useCallback(async () => {
    if (!activeConversation || isLoading) return;

    const messages = activeConversation.messages;
    const lastModelMessageIndex = messages.map(m => m.role).lastIndexOf('model');
    
    if (lastModelMessageIndex === -1) return;

    let lastUserMessage: ChatMessage | null = null;
    for (let i = lastModelMessageIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user' && !messages[i].isHidden) {
            lastUserMessage = messages[i];
            break;
        }
    }

    if (!lastUserMessage) {
        console.error("Could not find a preceding user message to regenerate from.");
        return;
    };

    const newMessages = messages.slice(0, lastModelMessageIndex);
    
    updateConversation(activeConversation.id, { messages: newMessages });
    
    setTimeout(() => {
        sendMessage(lastUserMessage!.text, lastUserMessage!.attachment);
    }, 50);

  }, [activeConversation, isLoading, sendMessage, updateConversation]);

  return { 
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
  };
};