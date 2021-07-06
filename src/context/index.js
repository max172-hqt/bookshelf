import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {AuthProvider} from './auth-context'
import store from 'store'
import { Provider } from 'react-redux'

// TODO remove later
const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
  },
}

function AppProviders({children}) {
  return (
    // TODO remove react query later
    <Provider store={store}>
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
    </Provider>
  )
}

export {AppProviders}
