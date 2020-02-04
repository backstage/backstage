import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormHelperText, FormControlLabel } from '@material-ui/core';

import { ValidatedCheckbox } from 'shared/components';

export default class JsonCheckboxField extends Component {
  static propTypes = {
    schema: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    }).isRequired,
  };

  render() {
    const { schema } = this.props;

    return (
      <FormControl margin="normal">
        <FormControlLabel
          control={<ValidatedCheckbox id={schema.id} checked={schema.checked} />}
          label={schema.title}
        />
        <FormHelperText style={{ margin: '0' }}>{schema.description}</FormHelperText>
      </FormControl>
    );
  }
}
