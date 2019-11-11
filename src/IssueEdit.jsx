import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// eslint-disable-next-line
export default class IssueEdit extends React.Component {
    render() {
        const { match: { params: { id } } } = this.props
        return (
            <div>
                <p>
                    {`This is a placeholder for editing issue ${id}...`}
                </p>
                <Link to="/issues">
                    Back to issue list
                </Link>
            </div>
        )
    }
}

IssueEdit.propTypes = {
    match: PropTypes.object.isRequired,
}
