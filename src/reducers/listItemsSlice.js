import {
  createSelector,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import {useAuthClient} from './authSlice'

const listItemsAdapter = createEntityAdapter()
const initialState = listItemsAdapter.getInitialState({})

export const fetchListItems = createAsyncThunk(
  'LIST_ITEMS/FETCH_LIST_ITEMS',
  async (_, {getState}) => {
    const client = useAuthClient(getState())
    const data = await client(`list-items`)
    return data.listItems
  },
)

export const createListItem = createAsyncThunk(
  'LIST_ITEMS/CREATE_LIST_ITEM',
  async (bookId, {getState}) => {
    const client = useAuthClient(getState())
    const data = await client(`list-items`, {
      data: {bookId},
    })
    return data.listItem
  },
)

export const removeListItem = createAsyncThunk(
  'LIST_ITEMS/REMOVE_LIST_ITEM',
  async (id, { getState }) => {
    const client = useAuthClient(getState())
    await client(`list-items/${id}`, {
      method: 'DELETE',
    })
    return id
  },
)

export const updateListItem = createAsyncThunk(
  'LIST_ITEMS/UPDATE_LIST_ITEM',
  async (updates, {getState}) => {
    const client = useAuthClient(getState())
    const data = await client(`list-items/${updates.id}`, {
      method: 'PUT',
      data: updates,
    })

    return data.listItem
  },
)

export const listItemsSlice = createSlice({
  name: 'LIST_ITEMS',
  initialState,
  reducers: {
    listItemsAdded: (state, action) => {
      listItemsAdapter.setAll(state, action.payload)
    },
    listItemsReset: (state, action) => {
      listItemsAdapter.removeAll(state)
    },
  },
  extraReducers: {
    [createListItem.fulfilled]: listItemsAdapter.addOne,
    [removeListItem.fulfilled]: listItemsAdapter.removeOne,
    [updateListItem.fulfilled]: listItemsAdapter.upsertOne,
    [fetchListItems.fulfilled]: listItemsAdapter.setAll,
  },
})

export default listItemsSlice.reducer

export const {selectAll: selectAllListItems} = listItemsAdapter.getSelectors(
  state => state.listItems,
)

const {listItemsAdded, listItemsReset} = listItemsSlice.actions
export {listItemsAdded, listItemsReset}

export const selectListItemByBookId = createSelector(
  [selectAllListItems, (state, bookId) => bookId],
  (listItems, bookId) => listItems?.find(li => li.bookId === bookId) ?? null,
)
