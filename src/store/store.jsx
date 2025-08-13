import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { toast } from 'react-toastify';
// Import the chat store to call its actions
import useChatStore from './chatStore'; 

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // --- STATE ---
        isAuthenticated: false,
        user: null, // Stores user data { name, email, dialCode, phoneNumber }
        chatrooms: [
          { id: 1, name: "React component brainstorming" },
          { id: 2, name: "Plan a trip to Japan" },
          { id: 3, name: "Weekly meal prep ideas" },
        ],
        activeChatroomId: 1,

        // --- ACTIONS ---
        login: (userData) => {
          set({ isAuthenticated: true, user: userData });
        },
        
        logout: () => {
          set({ isAuthenticated: false, user: null });
        },

        setActiveChatroom: (id) => {
          set({ activeChatroomId: id });
        },

        createNewChat: () => {
          const newId = Date.now();
          const newRoom = { id: newId, name: `New Chat` };
          set((state) => ({
            chatrooms: [newRoom, ...state.chatrooms],
            activeChatroomId: newId, // Automatically switch to the new chat
          }));
          // Initialize messages for the new chat
          useChatStore.getState().initializeMessages(newId);
          toast.success(`Chatroom "${newRoom.name}" created!`);
        },

        deleteChatroom: (idToDelete) => {
          const room = get().chatrooms.find((r) => r.id === idToDelete);
          if (!room) return;

          if (get().chatrooms.length <= 1) {
            toast.warn("You can't delete the last chatroom.");
            return;
          }

          if (get().activeChatroomId === idToDelete) {
            const newActiveRoom = get().chatrooms.find(r => r.id !== idToDelete);
            set({ activeChatroomId: newActiveRoom.id });
          }

          set((state) => ({
            chatrooms: state.chatrooms.filter((r) => r.id !== idToDelete),
          }));

          // Also delete the messages from the chat store
          useChatStore.getState().deleteChatMessages(idToDelete);

          toast.info(`Chatroom "${room.name}" deleted.`);
        },

        // --- NEWLY ADDED FUNCTION ---
        renameChatroom: (chatroomId, newName) => {
            set((state) => ({
                chatrooms: state.chatrooms.map((room) =>
                    room.id === chatroomId
                        ? { ...room, name: newName.trim() } // Update the name if the ID matches
                        : room // Otherwise, return the room as is
                ),
            }));
        },
      }),
      {
        name: 'gemini-clone-app-storage', // Name for the local storage item
      }
    )
  )
);

export default useAppStore;
