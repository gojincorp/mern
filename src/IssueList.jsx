import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import 'whatwg-fetch'
import IssueAdd from './IssueAdd'
import IssueFilter from './IssueFilter'

function IssueTable({ issues, deleteIssue }) { // Destructing assignment from props
    const issueRows = issues.map((issue) => <IssueRow key={issue._id} issue={issue} deleteIssue={deleteIssue} />)
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Completion Date</th>
                    <th>Title</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    )
}

IssueTable.propTypes = {
    issues: PropTypes.array,
    deleteIssue: PropTypes.func.isRequired,
}

IssueTable.defaultProps = {
    issues: [],
}

const IssueRow = ({
    issue: {
        _id,
        status,
        owner,
        created,
        effort,
        completionDate,
        title,
    },
    deleteIssue,
}) => {
    function onDeleteClick() {
        deleteIssue(_id)
    }

    return (
        <tr>
            <td>
                <Link to={`/issues/${_id}`}>
                    {_id.substr(-4)}
                </Link>
            </td>
            <td>{status}</td>
            <td>{owner}</td>
            <td>{created.toDateString()}</td>
            <td>{effort}</td>
            <td>{(completionDate) ? completionDate.toDateString() : ''}</td>
            <td>{title}</td>
            <td><button type="button" onClick={onDeleteClick}>Delete</button></td>
        </tr>
    )
}

IssueRow.propTypes = {
    issue: PropTypes.object,
    deleteIssue: PropTypes.func.isRequired,
}

IssueRow.defaultProps = {
    issue: {},
}

export default class IssueList extends React.Component {
    constructor() {
        super()
        this.state = {
            issues: [],
        }

        this.setFilter = this.setFilter.bind(this)
        this.createIssue = this.createIssue.bind(this)
        this.deleteIssue = this.deleteIssue.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        const { location: { search: oldSearch } } = prevProps
        const { location: { search: newSearch } } = this.props
        if (oldSearch === newSearch) {
            return
        }

        this.loadData()
    }

    setFilter(query) {
        const {
            location: {
                pathname,
            },
            history,
        } = this.props
        history.push(`${pathname}${query}`)
    }

    loadData() {
        const { location: { search } } = this.props
        fetch(`/api/issues${search}`).then((response) => {
            // response.json()
            if (response.ok) {
                response.json().then((data) => {
                    console.log('Total count of records:  ', data._metadata.total_count)
                    data.records.forEach((issue) => {
                        issue.created = new Date(issue.created)
                        if (issue.completionDate) {
                            issue.completionDate = new Date(issue.completionDate)
                        }
                    })
                    this.setState({ issues: data.records })
                })
            } else {
                response.json().then((error) => {
                    alert('Failed to fetch issues:  ', error.message)
                })
            }
        }).catch((err) => {
            alert('Error fetching data from server:  ', err)
        })
    }

    createIssue(newIssue) {
        console.log('createIssue:  ', newIssue)
        const { issues } = this.state
        fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIssue),
        }).then((response) => {
            if (response.ok) {
                response.json().then((updatedIssue) => {
                    updatedIssue.created = new Date(updatedIssue.created)
                    if (updatedIssue.completionDate) {
                        updatedIssue.completionDate = new Date(updatedIssue.completionDate)
                    }
                    const newIssues = issues.concat(updatedIssue)
                    this.setState({ issues: newIssues })
                })
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue:  ${error.message}`)
                })
            }
        }).catch((err) => {
            alert('Error sending data to server:  ', err.message)
        })
    }

    deleteIssue(id) {
        fetch(`/api/issues/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) alert('Failed to delete issue')
                else this.loadData()
            })
    }

    render() {
        const { issues } = this.state
        const { location: { search } } = this.props
        return (
            <div>
                <IssueFilter setFilter={this.setFilter} initFilter={queryString.parse(search)} />
                <hr />
                <IssueTable issues={issues} deleteIssue={this.deleteIssue} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </div>
        )
    }
}

IssueList.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}
