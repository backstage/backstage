import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@material-ui/core';
import camelcase from 'lodash.camelcase';

import { generateId } from './utils/idUtil';
import { ValidatedFormModel } from 'shared/components';
import FormHelperErrorText from './FormHelperErrorText';

export default class ValidatedSelect extends Component {
  static contextTypes = {
    validatedFormModel: PropTypes.instanceOf(ValidatedFormModel).isRequired,
  };

  get id() {
    return this._id || this.props.id || camelcase(this.props.label) || (this._id = generateId());
  }

  set id(value) {
    this._id = value;
  }

  get defaultValue() {
    return this._defaultValue || this.props.defaultValue;
  }

  set defaultValue(value) {
    this._defaultValue = value;
  }

  get validators() {
    return this._validators || this.props.validators;
  }

  componentDidMount() {
    this.context.validatedFormModel.registerElement(this, this.props.defaultValue);
  }

  componentWillUnmount() {
    this.context.validatedFormModel.unregisterElement(this);
  }

  render() {
    let { ...childProps } = this.props;
    delete childProps.validators;
    delete childProps.onChange;
    delete childProps.label;
    const { validatedFormModel } = this.context;
    const error = validatedFormModel.getErrorsFor(this);
    const isTouched = !!validatedFormModel.isTouched(this);
    const showError = !!error && isTouched;
    // passing 'value' and 'defaultValue' props to the TextField component results in a console warning
    // this does not affect the values in this.props
    delete childProps.defaultValue;

    return (
      <Fragment>
        <Select
          {...childProps}
          value={validatedFormModel.getValueFor(this)}
          onChange={this.select_onChangeHandler.bind(this)}
        />
        {showError && <FormHelperErrorText error>{error}</FormHelperErrorText>}
      </Fragment>
    );
  }

  select_onChangeHandler(event) {
    const { onChange } = this.props;
    const { value } = event.target;

    this.context.validatedFormModel.userChangeElementValue(this, value);
    this.forceUpdate();

    if (onChange) {
      onChange(event);
    }
  }

  valueChangeHandler() {
    this.forceUpdate();
  }
}
