import * as React from 'react'
import {FullPageSpinner} from './components/lib'
import {selectUser, selectIsLoading} from 'reducers/authSlice'
import {useSelector} from 'react-redux'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const user = useSelector(selectUser)
  const isLoading = useSelector(selectIsLoading)

  if (isLoading) {
    return <FullPageSpinner />
  }

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
