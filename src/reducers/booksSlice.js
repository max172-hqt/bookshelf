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
  'BOOKS/FETCH_BOOKS_BY_QUERY',
  async (query, {getState}) => {
    const token = getState().auth.user?.token
    const data = await client(`books?query=${encodeURIComponent(query)}`, {
      token,
    })

    return data.books
  },
)

export const fetchBookById = createAsyncThunk(
  'BOOKS/FETCH_BOOK_BY_ID',
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
  name: 'BOOKS',
  initialState,
  reducers: {
    booksAdded: (state, action) => {
      booksAdapter.setAll(state, action.payload)
    },
    booksReset: (state, action) => {
      booksAdapter.removeAll(state)
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: {
    [fetchBooksByQuery.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      booksAdapter.setAll(state, action.payload)
    },
    [fetchBooksByQuery.pending]: (state, action) => {
      state.status = 'pending'
      state.error = null
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
    [fetchBookById.pending]: (state, action) => {
      state.status = 'pending'
      state.error = null
    },
  },
})

export default booksSlice.reducer

export const {booksAdded, booksReset} = booksSlice.actions

export const {selectAll: selectBooks, selectById: selectBookById} =
  booksAdapter.getSelectors(state => state.books)

export const selectError = state => state.books.error
export const selectBookFetchingStatus = state => state.books.status
