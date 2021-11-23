import React, { Suspense, useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component'
const Home = loadable(() => import('./pages/index'));
const P404 = loadable(() => import('./pages/404'))
function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="*">
            <P404 />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
