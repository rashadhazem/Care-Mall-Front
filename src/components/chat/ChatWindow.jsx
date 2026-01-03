import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { chatApi } from '../../lib/api';
// import { addMessage } from '../../store/slices/chatSlice'; 

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null); // The active chat ID for the user
    const [loading, setLoading] = useState(false);

    // Get current user
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // On open, fetch user's chats
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchUserChat();
        }
    }, [isOpen, isAuthenticated]);

    const fetchUserChat = async () => {
        try {
            setLoading(true);
            const res = await chatApi.chatsForloggedUser();
            const chats = res.data.data || res.data || [];

            // For the user chat window, we might want to default to the most recent one 
            // OR if we had context of "Chatting with Store X", we'd find that specific chat.
            // Since this is a global "Support" or generic chat window, we'll pick the first one 
            // or create one if none exist? 
            // For now, let's pick the first one if it exists.
            if (chats.length > 0) {
                const activeChat = chats[0];
                setChatId(activeChat._id);
                fetchMessages(activeChat._id);
            } else {
                // If no chats, we can't really "fetch messages". 
                // We might need to 'createChat' first.
                // But createChat requires a storeId. 
                // We don't have storeId context here.
                // So we'll leave it empty.
            }
        } catch (error) {
            console.error("Error fetching user chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const res = await chatApi.getAllMessages(id);
            setMessages(res.data.data || res.data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (!chatId) {
            // Cannot send message without a chat ID.
            // Maybe show error or prompt to go to a store page?
            console.warn("No active chat to send message to.");
            return;
        }

        try {
            const res = await chatApi.sendMessage({
                chatId: chatId,
                content: message
            });

            const sentMessage = res.data.data || res.data;
            setMessages([...messages, sentMessage]);
            setMessage('');

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!isAuthenticated) return null; // Don't show chat if not logged in

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110`}
            >
                <MessageCircle className="w-8 h-8" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 h-[500px] transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <div>
                            <h3 className="font-bold">Messages</h3>
                            <span className="text-xs text-blue-100">
                                {chatId ? "Connected" : "No active conversation"}
                            </span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                        {!chatId ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>You have no active chats.</p>
                                <p className="text-sm">Visit a store profile to start chatting!</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No messages yet.</p>
                                <p className="text-sm">Say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = (msg.sender?._id === user?._id) || (msg.sender === user?._id);
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={!chatId}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!message.trim() || !chatId}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
