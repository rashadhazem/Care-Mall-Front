import io from 'socket.io-client';
import { store } from '../store';
import { addMessage, setOnlineUsers } from '../store/slices/chatSlice';

class SocketService {
    socket = null;

    connect(url, userId) {
        if (!this.socket) {
            this.socket = io(url, {
                query: { userId },
                transports: ['websocket'],
            });

            this.socket.on('connect', () => {
                console.log('Connected to chat server');
            });

            this.socket.on('receiveMessage', (message) => {
                store.dispatch(addMessage({ conversationId: message.conversationId, message }));
            });

            this.socket.on('onlineUsers', (users) => {
                store.dispatch(setOnlineUsers(users));
            });
        }
    }

    sendMessage(conversationId, content, senderId) {
        if (this.socket) {
            const message = { conversationId, content, senderId, timestamp: new Date() };
            this.socket.emit('sendMessage', message);
            // Optimistically add to store
            store.dispatch(addMessage({ conversationId, message }));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
