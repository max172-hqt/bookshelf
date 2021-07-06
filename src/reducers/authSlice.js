import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {client} from 'utils/api-client'
import * as auth from 'auth-provider'

const initialState = {
  user: null,
  status: 'unauthenticated',
  error: null,
}

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }
  return user
})

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
    // Login
    [login.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
    },
    [login.pending]: (state, action) => {
      state.status = 'pending'
    },
    [login.failed]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    // Register
    [register.fulfilled]: (state, action) => {
      state.status = 'authenticated'
      state.user = action.payload
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
