import {logger} from 'store'

beforeAll(() => {
  jest.spyOn(console, 'group').mockImplementation(() => {})
  jest.spyOn(console, 'info').mockImplementation(() => {})
})

afterAll(() => {
  console.group.mockRestore()
  console.info.mockRestore()
})

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  }

  const next = jest.fn()
  const invoke = action => logger(store)(next)(action)
  return {next, invoke}
}

test('logger is called every time action is dispatched', () => {
  const {next, invoke} = create()
  const action = {type: 'TEST', body: {a: "TEST BODY"}}
  invoke(action)
  expect(next).toHaveBeenCalledWith(action)
  expect(console.group).toHaveBeenCalledWith(action.type)
  expect(console.info).toHaveBeenCalledWith("dispatching", action)
})
