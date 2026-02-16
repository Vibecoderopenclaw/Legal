import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  practiceAreas: [],
  currentArea: null,
  skills: [],
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  sidebarOpen: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PRACTICE_AREAS':
      return { ...state, practiceAreas: action.payload };
    case 'SET_CURRENT_AREA':
      return { ...state, currentArea: action.payload };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLEAR_CHAT':
      return { ...state, messages: [], currentConversation: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchPracticeAreas = useCallback(async () => {
    try {
      const res = await fetch('/api/practice-areas');
      const data = await res.json();
      dispatch({ type: 'SET_PRACTICE_AREAS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchSkills = useCallback(async (areaId) => {
    try {
      const res = await fetch(`/api/practice-areas/${areaId}/skills`);
      const data = await res.json();
      dispatch({ type: 'SET_SKILLS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const sendMessage = useCallback(
    async (skillId, message, practiceArea) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add user message immediately
      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMsg });

      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: state.currentConversation,
            skillId,
            message,
            practiceArea,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to send message');
        }

        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: data.conversationId });
        dispatch({ type: 'ADD_MESSAGE', payload: data.message });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.currentConversation]
  );

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions/conversations');
      const data = await res.json();
      dispatch({ type: 'SET_CONVERSATIONS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const loadConversation = useCallback(async (conversationId) => {
    try {
      const res = await fetch(`/api/chat/conversation/${conversationId}`);
      const data = await res.json();
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: data.id });
      dispatch({ type: 'SET_MESSAGES', payload: data.messages });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const value = {
    ...state,
    dispatch,
    fetchPracticeAreas,
    fetchSkills,
    sendMessage,
    fetchConversations,
    loadConversation,
    clearChat,
    toggleSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default useApp;
