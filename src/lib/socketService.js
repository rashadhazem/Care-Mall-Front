import io from 'socket.io-client';
import api from './api';
import { store } from '../store';
import { addMessage, setOnlineUsers } from '../store/slices/chatSlice';

class SocketService {
    socket = null;
    isConnected = false;
    connectionPromise = null;
    currentAccessToken = null;

    connect(url, token) {
        // Return existing connection promise if connecting and token matches
        if (this.connectionPromise && this.currentAccessToken === token) {
            return this.connectionPromise;
        }

        // Check if we need to disconnect first (token changed)
        if ((this.socket || this.isConnected) && this.currentAccessToken !== token) {
            console.log('[Socket] Token changed, disconnecting old socket...');
            this.disconnect();
        }

        // Already connected with same token
        if (this.socket && this.isConnected && this.currentAccessToken === token) {
            return Promise.resolve(true);
        }

        if (!token) {
            console.warn('[Socket] No token provided, cannot connect');
            return Promise.resolve(false);
        }

        // Derive socket URL from API baseURL
        let socketUrl = url;
        if (!socketUrl) {
            const apiBase = api?.defaults?.baseURL || '';
            socketUrl = apiBase.replace(/\/api\/.+$/, '') || window.location.origin;
        }

        console.log('[Socket] Attempting to connect to:', socketUrl);

        this.currentAccessToken = token;

        this.connectionPromise = new Promise((resolve) => {
            this.socket = io(socketUrl, {
                query: { token },
                transports: ['websocket', 'polling'], // Allow fallback to polling
                timeout: 10000,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.socket.on('connect', () => {
                console.log('[Socket] Connected successfully! Socket ID:', this.socket.id);
                this.isConnected = true;
                this.connectionPromise = null;
                resolve(true);
            });

            this.socket.on('connect_error', (error) => {
                console.error('[Socket] Connection error:', error.message);
                this.isConnected = false;
                this.connectionPromise = null;
                resolve(false);
            });

            this.socket.on('disconnect', (reason) => {
                console.log('[Socket] Disconnected:', reason);
                this.isConnected = false;
            });

            this.socket.on('newMessage', (message) => {
                // Global handler for Redux
                store.dispatch(addMessage({ conversationId: message.chat._id || message.chat, message }));
            });

            this.socket.on('onlineUsers', (users) => {
                store.dispatch(setOnlineUsers(users));
            });

            // Timeout handler
            setTimeout(() => {
                if (!this.isConnected) {
                    console.warn('[Socket] Connection timeout after 10s');
                    this.connectionPromise = null;
                    resolve(false);
                }
            }, 10000);
        });

        return this.connectionPromise;
    }

    getConnectionStatus() {
        return this.isConnected && this.socket?.connected;
    }

    on(event, cb) {
        if (this.socket) this.socket.on(event, cb);
    }

    off(event, cb) {
        if (this.socket) this.socket.off(event, cb);
    }

    joinChat(chatId) {
        if (this.socket && this.isConnected) {
            console.log('[Socket] Joining chat room:', chatId);
            this.socket.emit('joinChat', { chatId });
        } else {
            console.warn('[Socket] Cannot join chat - not connected');
        }
    }

    leaveChat(chatId) {
        // Backend doesn't explicitly have leaveChat but it's good practice
    }

    sendMessage(chatId, content, cb) {
        if (!this.socket || !this.isConnected) {
            console.error('[Socket] Cannot send message - not connected');
            // Call callback with error immediately
            if (cb) {
                cb({ status: 'error', message: 'Socket not connected. Please refresh the page.' });
            }
            return;
        }

        console.log('[Socket] Sending message to chat:', chatId);

        // Set a timeout in case server never responds
        const timeoutId = setTimeout(() => {
            console.error('[Socket] sendMessage timeout - no response from server');
            if (cb) {
                cb({ status: 'error', message: 'Server did not respond. Please try again.' });
            }
        }, 10000);

        this.socket.emit('sendMessage', { chatId, content }, (response) => {
            clearTimeout(timeoutId);
            console.log('[Socket] sendMessage response:', response);
            if (cb) cb(response);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.currentAccessToken = null;
        }
    }
}

export const socketService = new SocketService();
