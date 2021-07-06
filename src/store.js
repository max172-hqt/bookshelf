import {configureStore} from '@reduxjs/toolkit'
import authReducer from 'reducers/authSlice'
import booksReducer from 'reducers/booksSlice'
import listItemsReducer from 'reducers/listItemsSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    listItems: listItemsReducer,
  },
})
