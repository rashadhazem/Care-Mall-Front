import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { socketService } from '../../lib/socketService';
import { addMessage } from '../../store/slices/chatSlice';

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { messages, activeConversationId } = useSelector((state) => state.chat);

    // Mock conversation ID for demo if none selected
    const currentConversationId = activeConversationId || 'demo-chat';
    const currentMessages = messages[currentConversationId] || [];

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Simulate sending via socket service (which would dispatch to store)
        // For now, we manually dispatch if socket server isn't running
        const newMessage = {
            id: Date.now(),
            content: message,
            senderId: 'user', // Replace with real user ID
            timestamp: new Date().toISOString(),
        };

        // socketService.sendMessage(currentConversationId, message, 'user'); 
        // Direct dispatch for demo since backend might not be ready
        // store.dispatch(addMessage({ conversationId: currentConversationId, message: newMessage }));

        // Use dispatch from hook
        // but we need to import useDispatch
    };

    // We can't use store.dispatch directly inside component easily without hook usually, 
    // but here we are inside component.
    const dispatch = useDispatch();
    const submitMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            content: message,
            senderId: 'user',
            timestamp: new Date().toISOString(),
            isMine: true
        };

        dispatch(addMessage({ conversationId: currentConversationId, message: newMessage }));
        setMessage('');

        // Mock auto-reply
        setTimeout(() => {
            dispatch(addMessage({
                conversationId: currentConversationId,
                message: {
                    id: Date.now() + 1,
                    content: "Thanks for your message! We'll get back to you shortly.",
                    senderId: 'store',
                    timestamp: new Date().toISOString(),
                    isMine: false
                }
            }));
        }, 1000);
    };

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
                            <h3 className="font-bold">Chat Support</h3>
                            <span className="text-xs text-blue-100">Usually replies in minutes</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                        {currentMessages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No messages yet.</p>
                                <p className="text-sm">Start the conversation!</p>
                            </div>
                        )}
                        {currentMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.isMine
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={submitMessage} className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center transition"
                                disabled={!message.trim()}
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
