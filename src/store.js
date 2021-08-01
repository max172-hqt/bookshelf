import {configureStore} from '@reduxjs/toolkit'
import authReducer from 'reducers/authSlice'
import booksReducer from 'reducers/booksSlice'
import listItemsReducer from 'reducers/listItemsSlice'

export const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.groupEnd()
  return result
}

export default configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    listItems: listItemsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})
