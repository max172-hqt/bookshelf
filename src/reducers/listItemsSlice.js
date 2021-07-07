import {
  createSelector,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import {client} from 'utils/api-client'

const listItemsAdapter = createEntityAdapter()
const initialState = listItemsAdapter.getInitialState({
  error: null,
})

export const createListItem = createAsyncThunk(
  'list-items/createListItem',
  async (bookId, {getState}) => {
    const token = getState().auth.user?.token
    const data = await client(`list-items`, {
      token,
      data: {bookId},
    })
    return data.listItem
  },
)

export const removeListItem = createAsyncThunk(
  'list-items/removeListItem',
  async (id, {getState}) => {
    const token = getState().auth.user?.token
    await client(`list-items/${id}`, {
      token,
      method: 'DELETE',
    })
    return id
  },
)

export const updateListItem = createAsyncThunk(
  'list-items/updateListItem',
  async (updates, {getState}) => {
    const token = getState().auth.user?.token
    const data = await client(`list-items/${updates.id}`, {
      token,
      method: 'PUT',
      data: updates,
    })

    return data.listItem
  },
)

export const listItemsSlice = createSlice({
  name: 'list-items',
  initialState,
  reducers: {
    listItemsAdded: (state, action) => {
      listItemsAdapter.setAll(state, action.payload)
    },
    errorCleared: (state, action) => {
      state.error = null
    },
  },
  extraReducers: {
    [createListItem.fulfilled]: listItemsAdapter.addOne,
    [removeListItem.fulfilled]: listItemsAdapter.removeOne,
    [updateListItem.fulfilled]: (state, action) => {
      state.error = null
      listItemsAdapter.upsertOne(state, action.payload)
    },
    [updateListItem.rejected]: (state, action) => {
      state.error = action.error
    },
  },
})

export default listItemsSlice.reducer

export const {
  selectAll: selectAllListItems,
  //selectById: selectBookById
} = listItemsAdapter.getSelectors(state => state.listItems)

export const {listItemsAdded} = listItemsSlice.actions

export const selectListItemByBookId = createSelector(
  [selectAllListItems, (state, bookId) => bookId],
  (listItems, bookId) => listItems?.find(li => li.bookId === bookId) ?? null,
)
export const selectListItemError = state => state.listItems.error
