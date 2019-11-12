import React from 'react'
import PropTypes from 'prop-types'

export default class DateInput extends React.Component {
    static displayFormat(date) {
        return (date != null) ? date.toDateString() : ''
    }

    static editFormat(date) {
        return (date != null) ? date.toISOString().substr(0, 10) : ''
    }

    static unformat(str) {
        const val = new Date(str)
        return Number.isNaN(val.getTime()) ? null : val
    }

    constructor(props) {
        super(props)
        this.state = {
            value: DateInput.editFormat(props.value),
            focused: false,
            valid: true,
        }
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    UNSAFE_componentWillReceiveProps({ value: newValue }) {
        const { value: oldValue } = this.props
        if (oldValue !== newValue) {
            this.setState({ value: DateInput.editFormat(newValue) })
        }
    }

    onFocus() {
        this.setState({ focused: true })
    }

    onBlur(e) {
        const { value, valid } = this.state
        const { onChange, onValidityChange } = this.props
        const newValue = DateInput.unformat(value)
        const newValid = value === '' || newValue != null
        if (newValid !== valid && onValidityChange) {
            onValidityChange(e, newValid)
        }
        this.setState({ focused: false, valid: newValid })
        if (newValid) onChange(e, newValue)
    }

    onChange(e) {
        if (e.target.value.match(/^[\d-]*$/)) {
            this.setState({ value: e.target.value })
        }
    }

    /* eslint-disable */
    render() {
        const { valid, focused, value: transientValue } = this.state
        const { name, value: persistentVal } = this.props
        const className = (!valid && !focused) ? 'invalid' : null
        const value = (focused || !valid) ? transientValue : DateInput.displayFormat(persistentVal)
        return (
            <input
              type="text"
              size={20}
              name={name}
              className={className}
              value={value}
              placeholder={focused ? 'yyyy-mm-dd' : null}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
            />
        )
    }
    /* eslint-enable */
}

DateInput.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onValidityChange: PropTypes.func,
    name: PropTypes.string.isRequired,
}

DateInput.defaultProps = {
    value: null,
    onValidityChange: () => {},
}
