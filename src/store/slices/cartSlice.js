// src/redux/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "./cartThunks";

const calculateTotals = (items = []) => {
  let total = 0;
  let totalQuantity = 0;

  items.forEach((item) => {
    total += (item.price || 0) * (item.quantity || 0);
    totalQuantity += item.quantity || 0;
  });

  return { total, totalQuantity };
};

const initialState = {
  cartId:null,
  items: [],
  total: 0,
  totalQuantity: 0, // 👈 Navbar
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        const cart = action.payload || {};
        state.cartId = cart._id || cart._id;
        state.items = cart.items || cart.cartItems || [];
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalQuantity = totals.totalQuantity;
        state.status = "succeeded";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const cart = action.payload || {};
        state.items = cart.items || cart.cartItems || [];
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        const cart = action.payload || {};
        state.items = cart.items || cart.cartItems || [];
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const cart = action.payload || {};
        state.items = cart.items || cart.cartItems || [];
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.totalQuantity = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
