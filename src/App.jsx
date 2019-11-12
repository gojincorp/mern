import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
// eslint-disable-next-line
import { Route, HashRouter, BrowserRouter, Switch, Redirect, withRouter } from 'react-router-dom'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import IssueList from './IssueList'
import IssueEdit from './IssueEdit'

const contentNode = document.getElementById('contents')
const NoMatch = () => <p>Page Not Found</p>

const App = ({ children }) => (
    <div>
        <div className="header">
            <h1>Issue Tracker</h1>
        </div>
        <div className="contents">
            {children}
        </div>
        <div className="footer">
            &copy; 2019 IdeasBeyond
        </div>
    </div>
)

App.propTypes = {
    children: PropTypes.object.isRequired,
}

const RoutedApp = () => (
    <BrowserRouter>
        <App>
            <Switch>
                <Redirect exact from="/" to="/issues" />
                <Route exact path="/issues" component={withRouter(IssueList)} />
                <Route path="/issues/:id" component={IssueEdit} />
                <Route path="*" component={NoMatch} />
            </Switch>
        </App>
    </BrowserRouter>
)

ReactDOM.render(<RoutedApp />, contentNode)

if (module.hot) {
    module.hot.accept()
}
