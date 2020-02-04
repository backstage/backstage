import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import camelcase from 'lodash.camelcase';

import { generateId } from './utils/idUtil';
import { ValidatedFormModel } from 'shared/components';
import { ValidatorRequired } from 'shared/components/form/validators';
import FormHelperErrorText from './FormHelperErrorText';

export default class ValidatedTextField extends Component {
  static contextTypes = {
    validatedFormModel: PropTypes.instanceOf(ValidatedFormModel).isRequired,
  };

  get id() {
    return this._id || this.props.id || camelcase(this.props.label) || (this._id = generateId());
  }

  set id(value) {
    this._id = value;
  }

  get validators() {
    return this._validators || this.props.validators;
  }

  get label() {
    return this.props.label || '[Please provide a label]';
  }

  componentDidMount() {
    this.context.validatedFormModel.registerElement(this, this.props.defaultValue);
  }

  componentWillUnmount() {
    this.context.validatedFormModel.unregisterElement(this);
  }

  render() {
    let { validators = [], label, ...childProps } = this.props;
    validators = validators instanceof Array ? validators : [validators];
    const { validatedFormModel } = this.context;
    const isTextFieldRequired = validators.some(
      validator => validatedFormModel.resolveValidator(validator) instanceof ValidatorRequired,
    );
    const error = validatedFormModel.getErrorsFor(this);
    const isTouched = validatedFormModel.isTouched(this);
    const showError = !!error && isTouched;
    // passing 'value' and 'defaultValue' props to the TextField component results in a console warning
    // this does not affect the values in this.props
    delete childProps.defaultValue;

    return (
      <Fragment>
        <TextField
          {...childProps}
          onBlur={this.textField_onBlurHandler.bind(this)}
          value={validatedFormModel.getValueFor(this)}
          label={label}
          error={showError}
          required={isTextFieldRequired}
          onChange={this.textField_onChangeHandler.bind(this)}
          margin="normal"
        />
        {showError && <FormHelperErrorText error>{error}</FormHelperErrorText>}
      </Fragment>
    );
  }

  textField_onChangeHandler(event) {
    const { onChange } = this.props;
    const { value } = event.target;

    this.context.validatedFormModel.userChangeElementValue(this, value);

    this.forceUpdate();

    if (onChange) {
      onChange(event);
    }
  }

  textField_onBlurHandler() {
    this.context.validatedFormModel.userTouchElement(this);
  }

  valueChangeHandler() {
    this.forceUpdate();
  }
}
