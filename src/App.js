import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './components/Home'
import Popular from './components/Popular'
import Search from './components/Search'
import Account from './components/Account'
import NotFound from './components/NotFound'

import DetailedView from './components/DetailedView'

import './App.css'

const App = () => {
  const num = 0
  return (
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/search" component={Search} />
      <ProtectedRoute exact path="/Popular" component={Popular} />
      <ProtectedRoute exact path="/account" component={Account} />
      <ProtectedRoute exact path="/movies/:id" component={DetailedView} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default App
