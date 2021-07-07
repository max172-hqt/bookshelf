import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {listItemsAdded, listItemsReset} from './listItemsSlice'
import {booksAdded, booksReset} from './booksSlice'
import {client} from 'utils/api-client'
import * as auth from 'auth-provider'

const initialState = {
  user: null,
  status: 'unauthenticated',
}

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, {dispatch}) => {
    let user = null

    const token = await auth.getToken()
    if (token) {
      const data = await client('bootstrap', {token})
      user = data.user
      dispatch(listItemsAdded(data.listItems))

      const books = data.listItems.map(li => li.book)
      dispatch(booksAdded(books))
    }
    return user
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (form, {dispatch}) => {
    const user = await auth.login(form)
    return user
  },
)

export const register = createAsyncThunk('auth/register', async form => {
  const user = await auth.register(form)
  return user
})

export const logout = createAsyncThunk(
  'auth/logout',
  async (form, {dispatch}) => {
    await auth.logout(form)
    dispatch(listItemsReset())
    dispatch(booksReset())
  },
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUser.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
    },
    [fetchUser.pending]: (state, action) => {
      state.status = 'fetchingUser'
    },
    // Login
    [login.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
    },
    [login.pending]: (state, action) => {
      state.status = 'pending'
    },
    [login.rejected]: (state, action) => {
      state.status = 'failed'
    },
    // Register
    [register.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed'
    },
    [register.pending]: (state, action) => {
      state.status = 'pending'
    },
    // Logout
    [logout.fulfilled]: (state, action) => {
      state.status = 'unauthenticated'
      state.user = null
    },
  },
})

//export const {} = authSlice.actions

export default authSlice.reducer

export const selectUser = state => state.auth.user
export const selectAuthToken = state => state.auth.user.token
export const selectIsLoading = state => state.auth.status === 'pending'
export const selectIsFetchingUser = state =>
  state.auth.status === 'fetchingUser'
