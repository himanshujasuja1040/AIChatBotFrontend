import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// --- DUMMY DATA FOR DEMONSTRATION ---
const initialMessages = {
    1: [
        { id: 1, text: 'Give me ideas for a complex React component.', sender: 'user', timestamp: '3:25 PM' },
        { id: 2, text: 'Sure! How about a drag-and-drop kanban board, an interactive data visualization chart, or a real-time collaborative text editor?', sender: 'ai', timestamp: '3:26 PM' },
    ],
    2: [{ id: 1, text: 'What\'s a good 7-day itinerary for Tokyo?', sender: 'user', timestamp: '1:10 PM' }],
    3: [{ id: 1, text: 'I need some healthy and easy meal prep recipes.', sender: 'user', timestamp: 'Yesterday'}],
};

const dummyOldMessages = Array.from({ length: 100 }, (_, i) => ({
    id: `old-${100 - i}`, text: `This is an older simulated message, number ${100 - i}.`, sender: i % 2 === 0 ? 'user' : 'ai', timestamp: 'Older',
}));


const useChatStore = create(
  devtools((set, get) => ({
    // --- STATE ---
    messagesByChatId: initialMessages,
    sendingStatus: {}, // To track typing indicators, e.g., { chatId: true }
    loadingStatus: {}, // To track loading more messages, e.g., { chatId: true }

    // --- ACTIONS ---
    
    initializeMessages: (chatId) => {
        const currentMessages = get().messagesByChatId;
        if (!currentMessages[chatId]) {
            set(state => ({
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chatId]: [],
                }
            }));
        }
    },

    sendMessage: async (chatId, messageText) => {
      if (!messageText.trim()) return;

      const newUserMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };

      set(state => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: [...(state.messagesByChatId[chatId] || []), newUserMessage],
        },
        sendingStatus: { ...state.sendingStatus, [chatId]: true },
      }));

      await new Promise(res => setTimeout(res, 1500 + Math.random() * 1000));

      const aiReply = {
        id: Date.now() + 1,
        text: `This is a simulated AI response for chat ID ${chatId}. The time is ${new Date().toLocaleTimeString()}.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };

      set(state => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: [...state.messagesByChatId[chatId], aiReply],
        },
        sendingStatus: { ...state.sendingStatus, [chatId]: false },
      }));
    },

    loadMoreMessages: async (chatId) => {
        set(state => ({ loadingStatus: { ...state.loadingStatus, [chatId]: true }}));
        await new Promise(res => setTimeout(res, 1500)); 
        set(state => {
            const currentMessages = state.messagesByChatId[chatId] || [];
            const moreMessages = dummyOldMessages.slice(0, 20);
            return {
                messagesByChatId: {
                    ...state.messagesByChatId,
                    [chatId]: [...moreMessages, ...currentMessages],
                },
                loadingStatus: { ...state.loadingStatus, [chatId]: false },
            };
        });
    },

    // --- NEWLY ADDED FUNCTION ---
    deleteChatMessages: (chatId) => {
        set(state => {
            const newMessagesByChatId = { ...state.messagesByChatId };
            delete newMessagesByChatId[chatId]; // Remove the message history for the deleted chat
            return {
                messagesByChatId: newMessagesByChatId,
            };
        });
    },

  }))
);

export default useChatStore;
