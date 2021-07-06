import * as React from 'react'
import {FullPageSpinner} from './components/lib'
import {selectUser} from 'reducers/authSlice'
import {useSelector} from 'react-redux'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const user = useSelector(selectUser)

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
