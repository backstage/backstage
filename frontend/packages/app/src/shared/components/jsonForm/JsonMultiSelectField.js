import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormHelperText, FormLabel, MenuItem } from '@material-ui/core';

import { ValidatedSelect } from 'shared/components';

export default class JsonMultiSelectField extends Component {
  static propTypes = {
    schema: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired,
        }),
      ),
      defaultValue: PropTypes.array,
    }).isRequired,
  };

  render() {
    const { schema } = this.props;

    return (
      <FormControl style={{ margin: '48px 0 16px 0' }}>
        <FormLabel htmlFor={schema.id}>{schema.title}</FormLabel>
        <ValidatedSelect displayEmpty multiple id={schema.id} defaultValue={schema.defaultValue || []}>
          {schema.values.map(option => (
            <MenuItem dense key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </ValidatedSelect>
        <FormHelperText>{schema.description}</FormHelperText>
      </FormControl>
    );
  }
}
