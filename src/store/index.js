import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';

import languageReducer from './slices/languageSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        language: languageReducer,
        auth: authReducer,
        cart: cartReducer,
        chat: chatReducer,
    },
});
