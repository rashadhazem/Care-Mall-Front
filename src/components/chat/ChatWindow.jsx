import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronLeft, Store, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { chatApi } from '../../lib/api';
import { socketService } from '../../lib/socketService';
import Swal from 'sweetalert2';

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list' or 'chat'
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    // Get current user
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Ensure socket connection when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                socketService.connect(null, token).then((connected) => {
                    setIsSocketConnected(connected);
                    if (!connected) {
                        console.error('[ChatWindow] Failed to connect to chat server');
                    }
                });
            }
        }

        // Check connection status periodically
        const interval = setInterval(() => {
            setIsSocketConnected(socketService.getConnectionStatus());
        }, 2000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // On open, fetch user's chats
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchUserChats();
        }
    }, [isOpen, isAuthenticated]);

    // Cleanup listeners
    useEffect(() => {
        return () => {
            // Removing listeners generically if possible, or per chat
            // socketService.off('newMessage'); 
            // We'll manage per-chat listeners inside the chat view effect
        };
    }, []);

    const fetchUserChats = async () => {
        try {
            setLoading(true);
            const res = await chatApi.chatsForloggedUser();
            const chatList = res.data.data || res.data || [];
            setChats(chatList);

            // If only one chat and we haven't selected one, maybe select it? 
            // Better to show list if multiple, or list if > 0. 
            // If 0, show empty state.
            if (chatList.length === 0) {
                setView('list');
            }
        } catch (error) {
            console.error("Error fetching user chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setView('chat');
        setMessages([]); // Clear previous messages
        fetchMessages(chat._id);
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedChat(null);
    };

    const fetchMessages = async (id) => {
        try {
            const res = await chatApi.getAllMessages(id);
            setMessages(res.data.data || res.data || []);

            try { socketService.joinChat(id); } catch (e) { }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Socket Listener for active chat
    useEffect(() => {
        if (!selectedChat) return;

        const handleReceive = (msg) => {
            const msgChatId = msg.chat?._id || msg.chat;
            if (msgChatId !== selectedChat._id) return;

            setMessages((prev) => {
                if (prev.some(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        };

        socketService.on('newMessage', handleReceive);

        return () => {
            socketService.off('newMessage', handleReceive);
        };
    }, [selectedChat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        const currentMessage = message;
        const tempId = `local-${Date.now()}`;

        // Optimistic Update
        const optimistic = {
            _id: tempId,
            content: currentMessage,
            sender: user, // user object from redux
            chat: selectedChat._id,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        setMessages((prev) => [...prev, optimistic]);
        setMessage('');
        setSending(true);

        // Send via Socket
        socketService.sendMessage(selectedChat._id, currentMessage, (response) => {
            setSending(false);
            if (response?.status !== 'ok') {
                console.error("Socket Send Failed:", response);

                // Remove optimistic message
                setMessages((prev) => prev.filter(m => m._id !== tempId));

                // Alert User
                Swal.fire({
                    icon: 'error',
                    title: 'Message Failed',
                    text: response?.message || 'Could not send message. Please try again.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                // Restore text to input (optional, good UX)
                setMessage(currentMessage);
            } else {
                // Success - Remove optimistic message, the 'newMessage' event will add the real one
                setMessages((prev) => prev.filter(m => m._id !== tempId));
            }
        });
    };

    // Helper to get chat name (Store Name)
    const getChatName = (chat) => {
        // Typically for a user, the 'store' field is populated.
        if (chat.store && chat.store.name) return chat.store.name;
        // Or if it's a direct user chat (less likely in this app structure)
        return "Support Chat";
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110`}
            >
                <MessageCircle className="w-8 h-8" />
            </button>

            {/* Window */}
            {isOpen && (
                <div className="bg-white dark:bg-gray-900 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 h-[500px] transition-all animate-in slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center gap-2">
                            {view === 'chat' && (
                                <button onClick={handleBackToList} className="hover:bg-blue-700 p-1 rounded-full">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div>
                                <h3 className="font-bold text-lg">
                                    {view === 'list' ? 'My Messages' : getChatName(selectedChat)}
                                </h3>
                                {view === 'chat' && (
                                    <span className={`text-xs flex items-center gap-1 ${isSocketConnected ? 'text-blue-100' : 'text-red-200'}`}>
                                        <span className={`w-2 h-2 rounded-full inline-block ${isSocketConnected ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></span>
                                        {isSocketConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-hidden relative">

                        {/* VIEW: LIST */}
                        {view === 'list' && (
                            <div className="h-full overflow-y-auto">
                                {loading ? (
                                    <div className="p-10 text-center text-gray-500">Loading chats...</div>
                                ) : chats.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                            <MessageCircle className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p>No conversations yet.</p>
                                        <p className="text-sm mt-2">Visit a store page to start chatting!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {chats.map(chat => (
                                            <div
                                                key={chat._id}
                                                onClick={() => handleSelectChat(chat)}
                                                className="p-4 hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-3"
                                            >
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    <Store className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{getChatName(chat)}</h4>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {chat.latestMessage ? chat.latestMessage.content : "Tap to chat"}
                                                    </p>
                                                </div>
                                                {/* <span className="text-xs text-gray-400">12:30</span> */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW: CHAT */}
                        {view === 'chat' && (
                            <div className="flex flex-col h-full">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-10 text-sm">
                                            <p>This is the start of your conversation.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            // Handle populated sender vs ID - convert both to strings for comparison
                                            const senderId = (msg.sender?._id || msg.sender || '').toString();
                                            const myId = (user?._id || '').toString();
                                            const isMe = senderId === myId;

                                            // Optional: Display name if not me
                                            // const senderName = !isMe && msg.sender?.name ? msg.sender.name : 'Store';

                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div
                                                            className={`p-3 rounded-2xl text-sm shadow-sm ${isMe
                                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700'
                                                                } ${msg.isOptimistic ? 'opacity-70' : ''}`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            {msg.isOptimistic && ' • Sending...'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            disabled={sending}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || sending}
                                            className="absolute right-1 top-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
