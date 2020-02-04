import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormLabel as MUIFormLabel, RadioGroup, withStyles } from '@material-ui/core';
import camelcase from 'lodash.camelcase';

import { generateId } from './utils/idUtil';
import { ValidatedFormModel } from 'shared/components';
import FormHelperErrorText from './FormHelperErrorText';

const formLabelStyles = theme => ({
  radioGroupTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
});

export class ValidatedRadioGroup extends Component {
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

  componentDidMount() {
    this.context.validatedFormModel.registerElement(this, this.props.defaultValue);
  }

  componentWillUnmount() {
    this.context.validatedFormModel.unregisterElement(this);
  }

  render() {
    const { label, classes, ...childProps } = this.props;
    delete childProps.id;
    const { validatedFormModel } = this.context;
    const error = validatedFormModel.getErrorsFor(this);
    const isTouched = validatedFormModel.isTouched(this);
    const showError = !!error && isTouched;

    return (
      <Fragment>
        <MUIFormLabel
          classes={{ root: classes.radioGroupTitle }}
          required={this.validators && this.validators.includes('required')}
        >
          {label}
        </MUIFormLabel>
        <RadioGroup
          {...childProps}
          label={label}
          aria-label={label}
          value={validatedFormModel.getValueFor(this)}
          onChange={this.radioGroup_onChangeHandler.bind(this)}
          onBlur={this.radioGroup_onBlurHandler.bind(this)}
        />
        {showError && <FormHelperErrorText error>{error}</FormHelperErrorText>}
      </Fragment>
    );
  }

  radioGroup_onChangeHandler(event) {
    const { onChange } = this.props;
    const { value } = event.target;

    this.context.validatedFormModel.userChangeElementValue(this, value);

    this.forceUpdate();

    if (onChange) {
      onChange(event);
    }
  }

  radioGroup_onBlurHandler() {
    this.context.validatedFormModel.userTouchElement(this);
  }

  valueChangeHandler() {
    this.forceUpdate();
  }
}
export default withStyles(formLabelStyles)(ValidatedRadioGroup);
