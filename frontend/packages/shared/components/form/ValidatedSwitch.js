import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, FormControlLabel } from '@material-ui/core';
import camelcase from 'lodash.camelcase';

import { generateId } from './utils/idUtil';
import { ValidatedFormModel } from 'shared/components';

export default class ValidatedSwitch extends Component {
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
    this.context.validatedFormModel.registerElement(this, !!this.props.checked);
  }

  componentWillUnmount() {
    this.context.validatedFormModel.unregisterElement(this);
  }

  render() {
    let { label, ...childProps } = this.props;
    const { validatedFormModel } = this.context;

    return (
      <FormControlLabel
        control={
          <Switch
            {...childProps}
            checked={!!validatedFormModel.getValueFor(this)}
            onChange={this.switch_onChangeHandler.bind(this)}
          />
        }
        label={label}
      />
    );
  }

  switch_onChangeHandler(event) {
    const { onChange } = this.props;

    this.context.validatedFormModel.userChangeElementValue(this, event.target.checked);
    this.forceUpdate();

    if (onChange) {
      onChange(event);
    }
  }

  valueChangeHandler() {
    this.forceUpdate();
  }
}
