import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// --- Import Zustand Stores ---
import useAppStore from '../../store/store';
import useChatStore from '../../store/chatStore'; // Assuming this file exists as per previous context

import './Home.css';

// --- SVG Icon Components ---
const MenuIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const UserIcon = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const SearchIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const GeminiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.52299 3.55273C10.0315 2.53491 11.4685 2.53491 11.977 3.55273L13.2045 6.00729C13.4735 6.54477 14.2885 6.54477 14.5575 6.00729L15.785 3.55273C16.2935 2.53491 17.7305 2.53491 18.239 3.55273L21.363 9.79271C21.8715 10.8105 20.814 11.9473 19.863 11.3927L17.7005 10.2621C17.146 9.98486 16.354 10.4552 16.354 11.0876V14.9124C16.354 15.5448 17.146 16.0151 17.7005 15.7379L19.863 14.6073C20.814 14.0527 21.8715 15.1895 21.363 16.2073L18.239 22.4473C17.7305 23.4651 16.2935 23.4651 15.785 22.4473L14.5575 19.9927C14.2885 19.4552 13.4735 19.4552 13.2045 19.9927L11.977 22.4473C11.4685 23.4651 10.0315 23.4651 9.52299 22.4473L6.39901 16.2073C5.89051 15.1895 6.94801 14.0527 7.89901 14.6073L10.0615 15.7379C10.616 16.0151 11.408 15.5448 11.408 14.9124V11.0876C11.408 10.4552 10.616 9.98486 10.0615 10.2621L7.89901 11.3927C6.94801 11.9473 5.89051 10.8105 6.39901 9.79271L9.52299 3.55273Z" fill="url(#gemini-gradient)" />
        <defs><linearGradient id="gemini-gradient" x1="13.7845" y1="2.9" x2="10.2545" y2="23.1" gradientUnits="userSpaceOnUse"><stop stopColor="#4285F4" /><stop offset="0.5" stopColor="#9B72CB" /><stop offset="1" stopColor="#D96570" /></linearGradient></defs>
    </svg>
);
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const MessageIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>);
const TrashIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const SendIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const CopyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const ImageIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const RenameIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4h6M4 20l7-7 3 3 7-7L13 3 4 12v8z"></path></svg>);

// ----------------- ChatItem subcomponent (Corrected) -----------------
function ChatItem({
    chat,
    isActive,
    setActiveChatroom,
    deleteChatroom,
    createNewChat,
    renameChatroom,
}) {
    const [hovered, setHovered] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(chat.name);
    const inputRef = useRef(null); // Ref to focus the input element

    const handleDelete = (e) => {
        e.stopPropagation();
        if (!window.confirm(`Delete "${chat.name}"? This cannot be undone.`)) return;
        deleteChatroom?.(chat.id);
        toast.success('Chat deleted');
    };

    const handleClone = (e) => {
        e.stopPropagation();
        if (typeof createNewChat === 'function') {
            createNewChat(`${chat.name} (copy)`);
            toast.success('Chat cloned');
        } else {
            toast.error('Clone not supported by store');
        }
    };
    
    // --- RENAME LOGIC (REFACTORED) ---

    // 1. Core logic for saving the new name
    const performRename = () => {
        const trimmed = newName.trim();
        if (!trimmed || trimmed === chat.name) {
            // If name is empty or unchanged, cancel the edit.
            setEditing(false);
            setNewName(chat.name);
            return;
        }

        if (typeof renameChatroom === 'function') {
            renameChatroom(chat.id, trimmed);
            toast.success('Renamed');
        } else {
            // Fallback is confusing, better to show an error if not supported
            toast.error('Rename not supported by the store');
        }
        setEditing(false);
    };

    // 2. Handler for when the user clicks the rename icon
    const startRename = (e) => {
        e.stopPropagation();
        setEditing(true);
        // Use a callback with setState to focus after the component re-renders
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 0);
    };

    // 3. Handler for the form submission (i.e., pressing Enter)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        performRename();
    };

    // 4. Handler for canceling with the Escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            setEditing(false);
            setNewName(chat.name);
        }
    };

    return (
        <div
            className={`chat-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => !editing && setActiveChatroom(chat.id)} // Prevent switching chat while editing
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' && !editing) setActiveChatroom(chat.id); }}
        >
            <MessageIcon />
            <div className="chat-name" title={chat.name}>
                {!editing ? (
                    <span>{chat.name}</span>
                ) : (
                    <form onSubmit={handleFormSubmit} className="rename-form">
                        <input
                            ref={inputRef}
                            id={`rename-input-${chat.id}`}
                            className="rename-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Stop click from bubbling to the parent div
                            onBlur={performRename} // SAVE on click-away
                            onKeyDown={handleKeyDown} // CANCEL on Escape
                        />
                    </form>
                )}
            </div>

            <div className={`chat-actions ${hovered || isActive ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="chat-action-button" title="Rename" onClick={startRename} aria-label="Rename chat">
                    <RenameIcon />
                </button>
                <button className="chat-action-button" title="Clone" onClick={handleClone} aria-label="Clone chat">
                    <CopyIcon /> {/* Using a more intuitive icon for "clone" */}
                </button>
                <button className="chat-action-button danger" title="Delete" onClick={handleDelete} aria-label="Delete chat">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
}


// ----------------- Main Home component -----------------
export default function Home() {
    const navigate = useNavigate();

    // --- Local UI State ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [copiedMessageId, setCopiedMessageId] = useState(null);

    // --- Zustand App State ---
    const {
        user,
        chatrooms = [],
        activeChatroomId,
        setActiveChatroom,
        createNewChat,
        deleteChatroom,
        // optionally supported by store:
        renameChatroom,
    } = useAppStore();

    // --- Zustand Chat State ---
    const { messagesByChatId, sendingStatus, loadingStatus, sendMessage, loadMoreMessages, initializeMessages } = useChatStore();

    // --- REFS ---
    const endOfMessagesRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- Derived State ---
    const activeMessages = messagesByChatId?.[activeChatroomId] || [];
    const isTyping = sendingStatus?.[activeChatroomId];
    const isLoadingMore = loadingStatus?.[activeChatroomId];
    const activeChat = chatrooms.find(chat => chat.id === activeChatroomId);

    const filteredChats = chatrooms.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Effects ---
    useEffect(() => {
        // Ensure the active chat has a message array initialized
        if (activeChatroomId && initializeMessages) {
            initializeMessages(activeChatroomId);
        }
    }, [activeChatroomId, initializeMessages]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);

    // --- Handlers ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (sendMessage && currentMessage.trim()) {
            sendMessage(activeChatroomId, currentMessage);
            setCurrentMessage('');
        }
    };

    const handleCopyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedMessageId(id);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopiedMessageId(null), 2000);
        });
    };

    const handleScroll = () => {
        if (chatContainerRef.current.scrollTop === 0 && !isLoadingMore && loadMoreMessages) {
            loadMoreMessages(activeChatroomId);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className="home-container">
            <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                <div className="sidebar-header">
                    <button className="new-chat-button" onClick={() => createNewChat?.()}>
                        <PlusIcon /> New Chat
                    </button>
                    <div className="search-container">
                        <SearchIcon />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Filter chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <nav className="chat-list">
                    <p className="recent-header">Recent</p>
                    {filteredChats.map(chat => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === activeChatroomId}
                            setActiveChatroom={setActiveChatroom}
                            deleteChatroom={deleteChatroom}
                            createNewChat={createNewChat}
                            renameChatroom={renameChatroom}
                        />
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="chat-header">
                    <div className="header-left">
                        <button className="menu-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <MenuIcon />
                        </button>
                        <h2>{activeChat ? activeChat.name : "Select a Chat"}</h2>
                    </div>
                    <div className="profile-container" onClick={handleProfileClick}>
                        <div className="profile-icon">
                            <UserIcon />
                        </div>
                        {user && (
                            <div className="profile-tooltip">
                                {user.name}
                            </div>
                        )}
                    </div>
                </header>

                <div className="chat-window" ref={chatContainerRef} onScroll={handleScroll}>
                    {isLoadingMore && <div className="loader">Loading...</div>}
                    {activeMessages.map(msg => (
                        <div key={msg.id} className="message-wrapper">
                           <div className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                                {msg.sender === 'ai' && <div className="avatar-ai"><GeminiIcon /></div>}
                                <div className="message-content">
                                    <p>{msg.text}</p>
                                    <span className="timestamp">{msg.timestamp}</span>
                                </div>
                                <button className="copy-button" onClick={() => handleCopyToClipboard(msg.text, msg.id)}>
                                    {copiedMessageId === msg.id ? <CheckIcon /> : <CopyIcon />}
                                </button>
                           </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            <GeminiIcon /> <span>Gemini is typing...</span>
                        </div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className="input-area">
                    <form onSubmit={handleSendMessage} className="input-form">
                         <input
                            type="text"
                            className="text-input"
                            placeholder="Message Gemini..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                         />
                         <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                         />
                        <button type="button" className="icon-button" onClick={() => fileInputRef.current.click()}>
                            <ImageIcon />
                        </button>
                        <button type="submit" className="icon-button send-button" disabled={!currentMessage.trim() || isTyping}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}