import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('mall_cart');
        if (serializedCart === null) {
            return { items: [], totalStruct: { total: 0 } };
        }
        return JSON.parse(serializedCart);
    } catch (err) {
        return { items: [], totalStruct: { total: 0 } };
    }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity || 1;
            } else {
                state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
            }

            state.totalStruct.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            localStorage.setItem('mall_cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalStruct.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            localStorage.setItem('mall_cart', JSON.stringify(state));
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem && quantity > 0) {
                existingItem.quantity = quantity;
                state.totalStruct.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                localStorage.setItem('mall_cart', JSON.stringify(state));
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalStruct.total = 0;
            localStorage.removeItem('mall_cart');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
