import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeConversationId: null,
    conversations: [], // List of active chats/contacts
    messages: {}, // Map conversationId -> Array of messages
    onlineUsers: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload;
        },
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(message);
        },
        setMessages: (state, action) => {
            const { conversationId, messages } = action.payload;
            state.messages[conversationId] = messages;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase('auth/logout', () => initialState);
    }
});

export const { setActiveConversation, setConversations, addMessage, setMessages, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;
