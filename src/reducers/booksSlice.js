import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import {useAuthClient} from './authSlice'

const BooksStatus = {
  IDLE: 'IDLE',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
}

const booksAdapter = createEntityAdapter()

const initialState = booksAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const fetchBooksByQuery = createAsyncThunk(
  'BOOKS/FETCH_BOOKS_BY_QUERY',
  async (query, {getState}) => {
    const client = useAuthClient(getState())
    const data = await client(`books?query=${encodeURIComponent(query)}`)

    return data.books
  },
)

export const fetchBookById = createAsyncThunk(
  'BOOKS/FETCH_BOOK_BY_ID',
  async (bookId, {getState}) => {
    const state = getState()
    const client = useAuthClient(state)
    if (state.books.ids.includes(bookId)) {
      return state.books.entities[bookId]
    }

    const data = await client(`books/${bookId}`)
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
      state.status = BooksStatus.IDLE
      state.error = null
    },
  },
  extraReducers: {
    [fetchBooksByQuery.fulfilled]: (state, action) => {
      state.status = BooksStatus.SUCCESS
      booksAdapter.setAll(state, action.payload)
    },
    [fetchBooksByQuery.pending]: (state, action) => {
      state.status = BooksStatus.PENDING
      state.error = null
    },
    [fetchBooksByQuery.rejected]: (state, action) => {
      state.status = BooksStatus.FAILED
      state.error = action.error
    },
    [fetchBookById.fulfilled]: booksAdapter.addOne,
    [fetchBookById.rejected]: (state, action) => {
      state.status = BooksStatus.FAILED
      state.error = action.error
    },
    [fetchBookById.pending]: (state, action) => {
      state.status = BooksStatus.PENDING
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
