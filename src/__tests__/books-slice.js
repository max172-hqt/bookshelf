import reducer, {booksAdded, booksReset} from 'reducers/booksSlice'

test('initial state', async () => {
  const initialState = reducer(undefined, {})
  expect(initialState).toEqual({
    ids: [],
    entities: {},
    status: 'IDLE',
    error: null,
  })
})

test('should handle a book being added to an empty list', () => {
  const previousState = {
    ids: [],
    entities: {},
    status: 'IDLE',
    error: null,
  }
  const nextState = reducer(
    previousState,
    booksAdded([
      {
        id: 1,
        title: 'test title',
      },
    ]),
  )

  expect(nextState).toEqual({
    ids: [1],
    entities: {
      '1': {
        id: 1,
        title: 'test title'
      } 
    },
    status: 'IDLE',
    error: null,
  })
})

test('should handle book list to be reset', () => {
  const previousState = {
    ids: [1],
    entities: {
      '1': {
        id: 1,
        title: 'test title'
      }
    },
    status: 'IDLE',
    error: null,
  }
  const nextState = reducer(
    previousState,
    booksReset()
  )

  expect(nextState).toEqual({
    ids: [],
    entities: {},
    status: 'IDLE',
    error: null,
  })
})
