import React from 'react'
import PropTypes from 'prop-types'

export default class NumInput extends React.Component {
    static format(num) {
        return num != null ? num.toString() : ''
    }

    static unformat(str) {
        const num = parseInt(str, 10)
        return Number.isNaN(num) ? null : num
    }

    constructor(props) {
        super(props)
        this.state = { value: NumInput.format(props.value) }
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps({ value }) {
        this.setState({ value: NumInput.format(value) })
    }

    onBlur(e) {
        const { onChange } = this.props
        const { value } = this.state
        onChange(e, NumInput.unformat(value))
    }

    onChange(e) {
        if (e.target.value.match(/^\d*$/)) {
            this.setState({ value: e.target.value })
        }
    }

    render() {
        const { value } = this.state
        return (
            <input type="text" {...this.props} value={value} onBlur={this.onBlur} onChange={this.onChange} />
        )
    }
}

NumInput.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
}

NumInput.defaultProps = {
    value: null,
}
