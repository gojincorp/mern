import React from 'react'
import ReactDOM from 'react-dom'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import IssueList from './IssueList.jsx'

const contentNode = document.getElementById('contents')
ReactDOM.render(<IssueList />, contentNode)

if (module.hot) {
	module.hot.accept()
}