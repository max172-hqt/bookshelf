import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {listItemsAdded} from './listItemsSlice'
import {booksAdded} from './booksSlice'
import {client} from 'utils/api-client'
import * as auth from 'auth-provider'

const initialState = {
  user: null,
  status: 'unauthenticated',
  error: null,
}

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, {dispatch}) => {
    // TODO: Bootstrap
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

export const login = createAsyncThunk('auth/login', async form => {
  const user = await auth.login(form)
  return user
})

export const register = createAsyncThunk('auth/register', async form => {
  const user = await auth.register(form)
  return user
})

export const logout = createAsyncThunk('auth/logout', async form => {
  // TODO: reset store?
  await auth.logout(form)
})

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
      state.error = action.error
    },
    // Register
    [register.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
      state.error = null
    },
    [register.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error
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
export const selectError = state => state.auth.error
export const selectIsLoading = state => state.auth.status === 'pending'
export const selectIsFetchingUser = state =>
  state.auth.status === 'fetchingUser'
