import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import store from 'store'
import {Provider} from 'react-redux'
import {fetchUser} from 'reducers/authSlice'

function AppProviders({children}) {
  React.useEffect(() => {
    store.dispatch(fetchUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  )
}

export {AppProviders}
