import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { ValidatedFormModel } from 'shared/components';

import { Button } from '@material-ui/core';

export default class ValidatedFormSubmitButton extends Component {
  static contextTypes = {
    validatedFormModel: PropTypes.instanceOf(ValidatedFormModel),
  };

  get validatedFormModel() {
    const { validatedFormModel } = this.props;

    if (!validatedFormModel && !this.context.validatedFormModel) {
      throw new Error('Cannot find a ValidatedFormModel for ValidatedFormSubmitButton!');
    }

    return validatedFormModel || this.context.validatedFormModel;
  }

  componentDidMount() {
    this.validatedFormModel.addEventListener(
      ValidatedFormModel.VALID_CHANGED,
      this.validatedFormModel_validChangedHandler,
    );
  }

  componentWillUnmount() {
    this.validatedFormModel.removeEventListener(
      ValidatedFormModel.VALID_CHANGED,
      this.validatedFormModel_validChangedHandler,
    );
  }

  render() {
    return (
      <Button
        color="primary"
        onClick={this.button_onClickHandler.bind(this)}
        disabled={!this.validatedFormModel.valid}
        {...this.props}
      />
    );
  }

  button_onClickHandler() {
    let { onSubmit } = this.props;

    if (onSubmit) {
      this.validatedFormModel.validate({ onlyTouched: false }).then(valid => {
        if (valid) {
          // We want to make a duplicate of the object values so that if the submit
          // handler holds on to them waiting for a call or something and some code
          // clears the model values we don't accidentally mutate the state during a submit!
          onSubmit({ ...this.validatedFormModel.valuesByElementId });
        }
      });
    }
  }

  validatedFormModel_validChangedHandler = () => {
    this.forceUpdate();
  };
}
