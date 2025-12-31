import React, { useState } from 'react';
import { Search, Send, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../../store/slices/chatSlice';

const VendorChat = () => {
    const [selectedChat, setSelectedChat] = useState("chat-1");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    // Mock Chats
    const chats = [
        { id: "chat-1", user: "John Doe", lastMessage: "Is this available?", time: "2m", unread: 2 },
        { id: "chat-2", user: "Jane Smith", lastMessage: "Thanks!", time: "1h", unread: 0 },
        { id: "chat-3", user: "Alice Johnson", lastMessage: "When will it ship?", time: "3h", unread: 0 },
    ];

    // Mock Messages for selected chat
    // In real app, select from Redux store based on ID
    const [localMessages, setLocalMessages] = useState([
        { id: 1, content: "Hi, is this item in stock?", sender: "user", time: "10:00 AM" },
        { id: 2, content: "Yes, we have plenty!", sender: "me", time: "10:05 AM" },
        { id: 3, content: "Great, I'll order one.", sender: "user", time: "10:06 AM" },
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newItem = {
            id: Date.now(),
            content: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setLocalMessages([...localMessages, newItem]);
        setMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white mb-4">Messages</h2>
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
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b dark:border-gray-700/50 transition-colors ${selectedChat === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{chat.user}</h3>
                                <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {selectedChat ? 'J' : '?'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">John Doe</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {localMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-sm'}`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            placeholder="Type your reply..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorChat;
