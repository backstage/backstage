import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { ValidatedFormModel } from 'shared/components';

export default class ValidatedFormClearButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static contextTypes = {
    validatedFormModel: PropTypes.instanceOf(ValidatedFormModel).isRequired,
  };

  render() {
    return <Button color="initial" {...this.props} onClick={this.button_onClickHandler.bind(this)} />;
  }

  button_onClickHandler(event) {
    let { onClick } = this.props;

    let allowDefault = true;

    if (onClick) {
      allowDefault = this.onClick(event);
    }

    if (allowDefault) {
      this.context.validatedFormModel.clear();
    }
  }
}
