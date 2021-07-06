import {configureStore} from '@reduxjs/toolkit'
import authReducer from 'reducers/authSlice'
import booksReducer from 'reducers/booksSlice'

export default configureStore({
  reducer: {auth: authReducer, books: booksReducer},
})
