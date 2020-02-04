import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormHelperText } from '@material-ui/core';

import { ValidatedTextField } from 'shared/components';

export default class JsonTextField extends Component {
  static propTypes = {
    schema: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      validators: PropTypes.array,
      defaultValue: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { schema, validators, ...otherProps } = this.props;

    return (
      <React.Fragment>
        <ValidatedTextField
          style={{ width: '100%' }}
          validators={validators}
          id={schema.id}
          defaultValue={schema.defaultValue}
          label={schema.title}
          {...otherProps}
        />
        <FormHelperText style={{ margin: '0' }}>{schema.description}</FormHelperText>
      </React.Fragment>
    );
  }
}
