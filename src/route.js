import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './home';
import Search from './search';
import About from './about';
import BookIntroduce from './bookIntroduce';
import Read from './read';

const RouterConfig = () => (
    <Router>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/search" component={Search}/>
            <Route path="/about" component={About}/>
            <Route path="/bookIntroduce/:id"  component={BookIntroduce} />
            <Route path="/read/:id"  component={Read} />
        </div>
    </Router>
)
export default RouterConfig;