import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import NumInput from './NumInput'
import DateInput from './DateInput'

// eslint-disable-next-line
export default class IssueEdit extends React.Component {
    constructor() {
        super()
        this.state = {
            issue: {
                _id: '',
                title: '',
                status: '',
                owner: '',
                effort: null,
                completionDate: null,
                created: '',
            },
            invalidFields: {},
        }

        this.onChange = this.onChange.bind(this)
        this.onValidityChange = this.onValidityChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        const { match: { params: { oldId } } } = prevProps
        const { match: { params: { newId } } } = this.props
        if (oldId !== newId) {
            this.loadData()
        }
    }

    onChange(event, convertedValue) {
        const { issue } = this.state
        const newIssue = { ...issue }
        const value = (convertedValue !== undefined) ? convertedValue : event.target.value
        newIssue[event.target.name] = value
        this.setState({ issue: newIssue })
    }

    onValidityChange(event, valid) {
        const { invalidFields } = this.state
        const newInvalidFields = { ...invalidFields }

        if (!valid) {
            newInvalidFields[event.target.name] = true
        } else {
            delete newInvalidFields[event.target.name]
        }
        this.setState({ invalidFields: newInvalidFields })
    }

    onSubmit(event) {
        event.preventDefault()
        const { invalidFields, issue } = this.state
        const { match: { params: { id } } } = this.props

        if (Object.keys(invalidFields).length !== 0) {
            return
        }

        fetch(`/api/issues/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issue),
        })
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(updatedIssue => {
                            updatedIssue.created = new Date(updatedIssue.created)
                            if (updatedIssue.completionDate) {
                                updatedIssue.completionDate = new Date(updatedIssue.completionDate)
                            }
                            this.setState({ issue: updatedIssue })
                            alert('Updated issue successfully...')
                        })
                } else {
                    res.json()
                        .then(err => {
                            alert(`Failed to update issue:  ${err.message}`)
                        })
                }
            })
            .catch(err => {
                alert(`Error in sending data to server:  ${err.message}`)
            })
    }

    loadData() {
        const { match: { params: { id } } } = this.props
        fetch(`/api/issues/${id}`)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(issue => {
                            issue.created = new Date(issue.created)
                            issue.completionDate = issue.completionDate != null ? new Date(issue.completionDate) : null
                            this.setState({ issue })
                        })
                } else {
                    res.json()
                        .then(err => {
                            alert(`Failed to fetch issue:  ${err.message}`)
                        })
                }
            })
            .catch(err => {
                alert(`Error in fetching data from server:  ${err.message}`)
            })
    }

    /* eslint-disable */
    render() {
        const { issue, invalidFields } = this.state
        const validateMessage = Object.keys(invalidFields).length === 0 ? null : (<div className="error">Please correct invalid fields...</div>)
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    ID: {issue._id}
                    <br />
                    Create: {issue.created ? issue.created.toDateString() : ''}
                    <br />
                    Status:
                    <select name="status" value={issue.status} onChange={this.onChange}>
                        <option value="New">New</option>
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Fixed">Fixed</option>
                        <option value="Verified">Verified</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <br />
                    Owner: <input name="owner" value={issue.owner} onChange={this.onChange} />
                    <br />
                    Effort: <NumInput size={5} name="effort" value={issue.effort} onChange={this.onChange} />
                    <br />
                    Completion Date: <DateInput name="completionDate" value={issue.completionDate} onChange={this.onChange} onValidityChange={this.onValidityChange} />
                    <br />
                    Title: <input name="title" size={50} value={issue.title} onChange={this.onChange} />
                    <br />
                    {validateMessage}
                    <button type="submit">Submit</button>
                    <Link to="/issues">Back to issue list</Link>
                </form>
            </div>
        )
    }
    /* eslint-enable */
}

IssueEdit.propTypes = {
    match: PropTypes.object.isRequired,
}
