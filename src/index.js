import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Profiler} from 'components/profiler'
import {App} from './app'
import {AppProviders} from './context'
import store from 'store'
import {fetchUser} from 'reducers/authSlice'

// We can run this before rendering
store.dispatch(fetchUser())

loadDevTools(() => {
  ReactDOM.render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>,
    document.getElementById('root'),
  )
})
