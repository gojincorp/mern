import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
export default class IssueFilter extends React.Component {
    constructor(props) {
        super(props)
        const { initFilter } = props
        this.state = {
            status: initFilter.status || '',
            effort_gte: initFilter.effort_gte || '',
            effort_lte: initFilter.effort_lte || '',
            changed: false,
        }
        this.onChangeStatus = this.onChangeStatus.bind(this)
        this.onChangeEffortGte = this.onChangeEffortGte.bind(this)
        this.onChangeEffortLte = this.onChangeEffortLte.bind(this)
        this.applyFilter = this.applyFilter.bind(this)
        this.resetFilter = this.resetFilter.bind(this)
        this.clearFilter = this.clearFilter.bind(this)
    }

    UNSAFE_componentWillReceiveProps({ initFilter }) {
        const { status, effort_gte, effort_lte } = initFilter
        this.setState({
            status: status || '',
            effort_gte: effort_gte || '',
            effort_lte: effort_lte || '',
            changed: false,
        })
    }

    onChangeStatus(e) {
        this.setState({ status: e.target.value, changed: true })
    }

    onChangeEffortGte(e) {
        const effortString = e.target.value
        if (effortString.match(/^\d*$/)) {
            this.setState({ effort_gte: e.target.value, changed: true })
        }
    }

    onChangeEffortLte(e) {
        const effortString = e.target.value
        if (effortString.match(/^\d*$/)) {
            this.setState({ effort_lte: e.target.value, changed: true })
        }
    }

    applyFilter() {
        let newFilter = ''
        const { status, effort_gte, effort_lte } = this.state
        const { setFilter } = this.props
        if (status) newFilter += `&status=${status}`
        if (effort_gte) newFilter += `&effort_gte=${effort_gte}`
        if (effort_lte) newFilter += `&effort_lte=${effort_lte}`
        setFilter(newFilter ? `?${newFilter.slice(1)}` : '')
    }

    clearFilter() {
        const { setFilter } = this.props
        setFilter('')
    }

    resetFilter() {
        const { initFilter } = this.props
        const { status, effort_gte, effort_lte } = initFilter
        this.setState({
            status: status || '',
            effort_gte: effort_gte || '',
            effort_lte: effort_lte || '',
            changed: false,
        })
    }

    render() {
        const {
            status,
            effort_gte,
            effort_lte,
            changed,
        } = this.state
        return (
            <div>
                Status:
                <select value={status} onChange={this.onChangeStatus}>
                    <option value="">(Any)</option>
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Verifiec">Verified</option>
                    <option value="Closed">Closed</option>
                </select>
                &nbsp;Effort between:
                <input size={5} value={effort_gte} onChange={this.onChangeEffortGte} />
                &nbsp;-&nbsp;
                <input size={5} value={effort_lte} onChange={this.onChangeEffortLte} />
                <button type="button" onClick={this.applyFilter}>Apply</button>
                <button type="button" onClick={this.resetFilter} disabled={!changed}>Reset</button>
                <button type="button" onClick={this.clearFilter}>Clear</button>
            </div>
        )
    }
}

IssueFilter.propTypes = {
    setFilter: PropTypes.func.isRequired,
    initFilter: PropTypes.object.isRequired,
}
