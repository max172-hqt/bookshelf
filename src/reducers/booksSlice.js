import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import {client} from 'utils/api-client'

const booksAdapter = createEntityAdapter()

const initialState = booksAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchBooksByQuery = createAsyncThunk(
  'books/fetchBooksByQuery',
  async (query, {getState}) => {
    const token = getState().auth.user?.token
    const data = await client(`books?query=${encodeURIComponent(query)}`, {
      token,
    })

    return data.books
  },
)

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId, {getState}) => {
    if (getState().books.ids.includes(bookId)) {
      return getState().books.entities[bookId]
    }

    const token = getState().auth.user?.token
    const data = await client(`books/${bookId}`, {
      token,
    })
    return data.book
  },
)

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    booksAdded: (state, action) => {
      booksAdapter.setAll(state, action.payload)
    },
  },
  extraReducers: {
    [fetchBooksByQuery.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      booksAdapter.setAll(state, action.payload)
    },
    [fetchBooksByQuery.pending]: (state, action) => {
      state.status = 'pending'
    },
    [fetchBooksByQuery.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error
    },
    [fetchBookById.fulfilled]: booksAdapter.addOne,
    [fetchBookById.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error
    },
  },
})

export default booksSlice.reducer

export const {booksAdded} = booksSlice.actions

export const {selectAll: selectBooks, selectById: selectBookById} =
  booksAdapter.getSelectors(state => state.books)

//export const selectBooks = state => state.books.books
export const selectError = state => state.books.error
export const selectBookFetchingStatus = state => state.books.status
