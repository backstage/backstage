import React, { Component } from 'react';

import PropTypes from 'prop-types';

import ValidatedFormModel from './ValidatedFormModel';

export default class ValidatedForm extends Component {
  static childContextTypes = {
    validatedFormModel: PropTypes.instanceOf(ValidatedFormModel).isRequired,
  };

  constructor(props) {
    super(props);

    this.model = props.model || new ValidatedFormModel();

    this.model.initialize(this, props.validatorContext, props.localStorageId);

    this.model.addEventListener(ValidatedFormModel.VALID_CHANGED, this.model_validChangedHandler);
    this.model.addEventListener(ValidatedFormModel.VALUE_CHANGED, this.model_valueChangedHandler);
    this.model.addEventListener(ValidatedFormModel.USER_VALUE_CHANGED, this.model_userValueChangedHandler);
    this.model.addEventListener(ValidatedFormModel.ERRORS_CHANGED, this.model_errorsChangedHandler);
  }

  componentDidMount() {
    const { onInitialize } = this.props;

    if (onInitialize) {
      onInitialize(this.model);
    }
  }

  componentWillUnmount() {
    this.model.removeEventListener(ValidatedFormModel.VALID_CHANGED, this.model_validChangedHandler);
    this.model.removeEventListener(ValidatedFormModel.VALUE_CHANGED, this.model_valueChangedHandler);
    this.model.removeEventListener(ValidatedFormModel.USER_VALUE_CHANGED, this.model_userValueChangedHandler);
    this.model.removeEventListener(ValidatedFormModel.ERRORS_CHANGED, this.model_errorsChangedHandler);
  }

  getChildContext() {
    const { model } = this;

    return { validatedFormModel: model };
  }

  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }

  model_validChangedHandler = () => {
    this.forceUpdate();
  };

  model_valueChangedHandler = event => {
    const { onValueChange } = this.props;

    this.forceUpdate();

    if (onValueChange) {
      onValueChange(this.model, event.detail);
    }
  };

  model_userValueChangedHandler = event => {
    const { onUserValueChange } = this.props;

    this.forceUpdate();

    if (onUserValueChange) {
      onUserValueChange(this.model, event.detail);
    }
  };

  model_errorsChangedHandler = () => {
    this.forceUpdate();
  };
}
