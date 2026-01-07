import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.patch('/notifications/read-all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.items = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                // If page 1, replace. If pagination implemented fully, might append.
                // For simplified dropdown, we usually just fetch latest.
                state.items = action.payload.data;
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mark Read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload.data._id);
                if (index !== -1) {
                    state.items[index] = action.payload.data;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Mark All Read
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.items.forEach(item => { item.isRead = true; });
                state.unreadCount = 0;
            });
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
