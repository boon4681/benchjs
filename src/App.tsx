import React, { Suspense, useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/index'
import _404 from './pages/404'

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route exact path="*"><_404 /></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
