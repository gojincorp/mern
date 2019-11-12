import React from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line
export default class IssueFilter extends React.Component {
    constructor(props) {
        super(props)
        const { initFilter } = props
        console.log('issueFilte::constructor:  ', initFilter)
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
    
    /*
    componentWillReceiveProps({ initFilter }) {
        const { status, effort_gte, effort_lte } = initFilter
        this.setState( {
            status: status || '',
            effort_gte: effort_gte || '',
            effort_lte: effort_lte || '',
            changed: false,
        })
    }
    */

    UNSAFE_componentWillReceiveProps({ initFilter }) {
        console.log('UNSAFE_componentWillReceiveProps:  ', initFilter)
        const { status, effort_gte, effort_lte } = initFilter
        this.setState( {
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
            this.setState({ effort_gte: e.target.value, changed: true})
        }
    }

    onChangeEffortLte(e) {
        const effortString = e.target.value
        if (effortString.match(/^\d*$/)) {
            this.setState({ effort_lte: e.target.value, changed: true})
        }
    }
    
    applyFilter() {
        let newFilter = ''
        if (this.state.status) newFilter += '&status=' + this.state.status
        if (this.state.effort_gte) newFilter += '&effort_gte=' + this.state.effort_gte
        if (this.state.effort_lte) newFilter += '&effort_lte=' + this.state.effort_lte
        this.props.setFilter(newFilter ? '?' + newFilter.slice(1) : '')
    }
    
    clearFilter() {
        this.props.setFilter('')
    }
    
    resetFilter() {
        const { initFilter } = this.props
        const { status, effort_gte, effort_lte } = initFilter
        this.setState( {
            status: status || '',
            effort_gte: effort_gte || '',
            effort_lte: effort_lte || '',
            changed: false,
        })
    }

    render() {
        const Separator = () => <span> | </span>
        console.log("render (filter):  ", this.state)
        return (
            <div>
                Status:
                <select value={this.state.status} onChange={this.onChangeStatus}>
                    <option value="">(Any)</option>
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Verifiec">Verified</option>
                    <option value="Closed">Closed</option>
                </select>
                &nbsp;Effort between:
                <input size={5} value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
                &nbsp;-&nbsp;
                <input size={5} value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
                <button onClick={this.applyFilter}>Apply</button>
                <button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</button>
                <button onClick={this.clearFilter}>Clear</button>
            </div>
        )
    }
}

IssueFilter.propTypes = {
    setFilter: PropTypes.func.isRequired,
    initFilter: PropTypes.object.isRequired
}
