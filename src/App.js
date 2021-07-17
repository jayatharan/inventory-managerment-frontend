import React from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom';

import Navigation from './components/Navigation'
import Home from './screens/Home';

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Route path='/' exact><Home /></Route>
        </BrowserRouter>
    )
}

export default App
