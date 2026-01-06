// src/redux/cart/cartThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {cartApi} from "../../lib/api";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, thunkAPI) => {
    const res = await cartApi.getCart();
    return res.data?.data || res.data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity, color }, thunkAPI) => {
    try {
      const res = await cartApi.addToCart({
        productId,
        quantity,
        color,
      });
      return res.data?.data || res.data; // return cart object
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add to cart failed"
      );
    }
  }
);


export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ itemId, quantity }) => {
    // itemId is the cart item _id
    const res = await cartApi.updateCartItem(itemId, { quantity });
    return res.data?.data || res.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId) => {
    const res = await cartApi.removeFromCart(productId);
    return res.data?.data || res.data;
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async () => {
    // backend returns 204 No Content on clear, so return an empty cart shape
    await cartApi.clearCart();
    return { cartItems: [] };
  }
);
