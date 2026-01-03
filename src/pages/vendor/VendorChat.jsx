import React, { useState, useEffect } from 'react';
import { Search, Send, User, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { chatApi } from '../../lib/api';
import { socketService } from '../../lib/socketService';

const VendorChat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Get current user to determine message ownership
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Ensure socket connection for vendor
    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                socketService.connect(null, token).then((connected) => {
                    setIsSocketConnected(connected);
                    if (!connected) {
                        console.error('[VendorChat] Failed to connect to chat server');
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

    // Fetch all chats for the logged-in vendor
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await chatApi.chatsForloggedUser();
                // Assuming response structure, adjust if needed (e.g. res.data.data)
                const chatList = res.data.data || res.data || [];
                setChats(chatList);

                // Auto-select first chat if available
                if (chatList.length > 0 && !selectedChat) {
                    setSelectedChat(chatList[0]);
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []); // Run once on mount

    // Fetch messages when a chat is selected
    useEffect(() => {
        if (!selectedChat?._id) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await chatApi.getAllMessages(selectedChat._id);
                // Assuming res.data.data contains array of messages
                setMessages(res.data.data || res.data || []);
                // join socket room for this conversation
                try { socketService.joinChat(selectedChat._id); } catch (e) { }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        // listen for incoming messages on socket
        const handleReceive = (msg) => {
            // msg is the full message object
            const chatId = msg.chat?._id || msg.chat;
            if (chatId === selectedChat._id) {
                setMessages((prev) => {
                    // Prevent duplicates
                    if (prev.some(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
            }
        };

        socketService.on('newMessage', handleReceive);

        // Optional: Set up polling or socket listener here for real-time

        // cleanup listeners when chat changes
        return () => {
            // socketService.leaveChat(selectedChat._id); // Not strictly implemented/needed on backend
            socketService.off('newMessage', handleReceive);
        };
    }, [selectedChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat?._id) return;

        const currentMessage = newMessage;
        const tempId = `local-${Date.now()}`;

        // Optimistic local update first
        const optimistic = {
            _id: tempId,
            content: currentMessage,
            sender: user,
            chat: selectedChat._id,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        setMessages((prev) => [...prev, optimistic]);
        setNewMessage("");

        // Send via socket for realtime delivery
        socketService.sendMessage(selectedChat._id, currentMessage, (response) => {
            if (response?.status !== 'ok') {
                console.error("Socket sendMessage failed:", response);

                // Remove optimistic message
                setMessages((prev) => prev.filter(m => m._id !== tempId));

                // Show error to user
                import('sweetalert2').then(Swal => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'Message Failed',
                        text: response?.message || 'Could not send message. Please try again.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });

                // Restore message to input
                setNewMessage(currentMessage);
            } else {
                // Success - Remove optimistic message, the 'newMessage' socket event will add the real one
                setMessages((prev) => prev.filter(m => m._id !== tempId));
            }
        });
    };

    // Helper to get the display name of the other participant (customer)
    const getChatName = (chat) => {
        // For vendor, the other party is likely the customer (not the owner)
        // Find participant that is NOT the current vendor (user)
        if (chat.participants && Array.isArray(chat.participants)) {
            const otherParticipant = chat.participants.find(p => {
                const pId = (p._id || p).toString();
                return pId !== user?._id;
            });
            if (otherParticipant && otherParticipant.name) {
                return otherParticipant.name;
            }
        }
        // Fallback to store name if available
        if (chat.store && chat.store.name) {
            return `Customer (${chat.store.name})`;
        }
        return `Chat #${chat._id?.substring(0, 6) || 'unknown'}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-2rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                        <span className={`text-xs flex items-center gap-1 ${isSocketConnected ? 'text-green-600' : 'text-red-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                            {isSocketConnected ? 'Live' : 'Offline'}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No chats found</div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b dark:border-gray-700/50 transition-colors ${selectedChat?._id === chat._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{getChatName(chat)}</h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(chat.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {chat.lastMessage?.content || "Click to view messages"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {getChatName(selectedChat).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {getChatName(selectedChat)}
                                </h3>
                                {/* Online status placeholder - can be implemented with sockets */}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loadingMessages ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="animate-spin text-gray-400" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">No messages yet.</div>
                            ) : (
                                messages.map((msg) => {
                                    // Determine if message is mine - convert to strings for proper comparison
                                    const senderId = (msg.sender?._id || msg.sender || '').toString();
                                    const myId = (user?._id || '').toString();
                                    const isMe = senderId === myId;

                                    return (
                                        <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMe
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm'
                                                }`}>
                                                <p className="text-sm">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    placeholder="Type your reply..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorChat;
