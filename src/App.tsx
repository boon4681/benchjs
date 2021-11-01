import React, { Suspense, useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/index'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/"><Home /></Route>
      </Router>
    </div>
  )
}

export default App
