/**
 * Zustand store for chat functionality with MMKV persistence
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from './mmkv';
import { 
  ChatMessage, 
  ChatSession,
  AIResponse
} from '../../types/database';

// Interface for the chat store
interface ChatStore {
  sessions: ChatSession[];
  currentSessionId: string | null;
  
  // Session actions
  createSession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  // Message actions
  addMessage: (message: Omit<ChatMessage, 'id'>) => string;
  updateMessage: (messageId: string, updates: Partial<Omit<ChatMessage, 'id'>>) => void;
  deleteMessage: (messageId: string) => void;
  
  // Getters
  getCurrentSession: () => ChatSession | null;
  getSessionById: (sessionId: string) => ChatSession | null;
  getSessionMessages: (sessionId: string) => ChatMessage[];
  
  // Context management
  getContextForAI: (maxMessages?: number) => ChatMessage[];
  
  // General actions
  clearAllData: () => void;
}

// Create the store with persistence
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      
      createSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const timestamp = Date.now();
        
        const newSession: ChatSession = {
          id: sessionId,
          messages: [],
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        set(state => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: sessionId
        }));
        
        return sessionId;
      },
      
      switchSession: (sessionId) => {
        const sessionExists = get().sessions.some(session => session.id === sessionId);
        
        if (sessionExists) {
          set({ currentSessionId: sessionId });
        }
      },
      
      deleteSession: (sessionId) => {
        const { sessions, currentSessionId } = get();
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        
        // If deleting the current session, switch to the most recent one or null
        let newCurrentSessionId = currentSessionId;
        if (currentSessionId === sessionId) {
          newCurrentSessionId = updatedSessions.length > 0 
            ? updatedSessions[updatedSessions.length - 1].id 
            : null;
        }
        
        set({
          sessions: updatedSessions,
          currentSessionId: newCurrentSessionId
        });
      },
      
      addMessage: (messageData) => {
        const { currentSessionId, sessions } = get();
        
        // If no current session, create one
        if (!currentSessionId) {
          const newSessionId = get().createSession();
          return get().addMessage(messageData); // Recursive call with new session
        }
        
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newMessage: ChatMessage = {
          ...messageData,
          id: messageId
        };
        
        const updatedSessions = sessions.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: Date.now()
            };
          }
          return session;
        });
        
        set({ sessions: updatedSessions });
        return messageId;
      },
      
      updateMessage: (messageId, updates) => {
        const { sessions } = get();
        
        const updatedSessions = sessions.map(session => {
          const messageIndex = session.messages.findIndex(msg => msg.id === messageId);
          
          if (messageIndex >= 0) {
            const updatedMessages = [...session.messages];
            updatedMessages[messageIndex] = {
              ...updatedMessages[messageIndex],
              ...updates
            };
            
            return {
              ...session,
              messages: updatedMessages,
              updatedAt: Date.now()
            };
          }
          
          return session;
        });
        
        set({ sessions: updatedSessions });
      },
      
      deleteMessage: (messageId) => {
        const { sessions } = get();
        
        const updatedSessions = sessions.map(session => {
          const messageIndex = session.messages.findIndex(msg => msg.id === messageId);
          
          if (messageIndex >= 0) {
            const updatedMessages = session.messages.filter(msg => msg.id !== messageId);
            
            return {
              ...session,
              messages: updatedMessages,
              updatedAt: Date.now()
            };
          }
          
          return session;
        });
        
        set({ sessions: updatedSessions });
      },
      
      getCurrentSession: () => {
        const { currentSessionId, sessions } = get();
        
        if (!currentSessionId) return null;
        
        return sessions.find(session => session.id === currentSessionId) || null;
      },
      
      getSessionById: (sessionId) => {
        return get().sessions.find(session => session.id === sessionId) || null;
      },
      
      getSessionMessages: (sessionId) => {
        const session = get().getSessionById(sessionId);
        return session ? session.messages : [];
      },
      
      getContextForAI: (maxMessages = 10) => {
        const currentSession = get().getCurrentSession();
        
        if (!currentSession) return [];
        
        // Get the most recent messages up to maxMessages
        const recentMessages = [...currentSession.messages]
          .slice(-maxMessages);
        
        return recentMessages;
      },
      
      clearAllData: () => {
        set({
          sessions: [],
          currentSessionId: null
        });
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
    }
  )
);
