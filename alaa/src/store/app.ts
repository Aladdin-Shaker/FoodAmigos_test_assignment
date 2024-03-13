import { createSlice } from '@reduxjs/toolkit'

type Product = {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

interface AppState {
  cart: Product[]
  loggedIn: boolean
}

const initialState: AppState = {
  cart: [],
  loggedIn: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (state.cart.some((product) => product.id === action.payload.id)) {
        state.cart = state.cart.map((product) =>
          product.id === action.payload.id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        )
        return
      } else {
        state.cart.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload.id,
      )
    },
    login: (state) => {
      state.loggedIn = true
    },
    logout: (state) => {
      state.loggedIn = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, login, logout } = appSlice.actions

export default appSlice.reducer
