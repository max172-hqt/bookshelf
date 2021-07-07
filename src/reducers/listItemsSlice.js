import {
  createSelector,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import {client} from 'utils/api-client'

const listItemsAdapter = createEntityAdapter()
const initialState = listItemsAdapter.getInitialState({})

export const fetchListItems = createAsyncThunk(
  'list-items/fetchListItems',
  async (_, {getState}) => {
    const token = getState().auth.user?.token
    const data = await client(`list-items`, {
      token,
    })
    return data.listItems
  },
)

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
    listItemsReset: (state, action) => {
      listItemsAdapter.removeAll(state)
    }
  },
  extraReducers: {
    [createListItem.fulfilled]: listItemsAdapter.addOne,
    [removeListItem.fulfilled]: listItemsAdapter.removeOne,
    [updateListItem.fulfilled]: listItemsAdapter.upsertOne,
    [fetchListItems.fulfilled]: listItemsAdapter.setAll,
  },
})

export default listItemsSlice.reducer

export const {
  selectAll: selectAllListItems,
} = listItemsAdapter.getSelectors(state => state.listItems)

export const {listItemsAdded, listItemsReset} = listItemsSlice.actions

export const selectListItemByBookId = createSelector(
  [selectAllListItems, (state, bookId) => bookId],
  (listItems, bookId) => listItems?.find(li => li.bookId === bookId) ?? null,
)
