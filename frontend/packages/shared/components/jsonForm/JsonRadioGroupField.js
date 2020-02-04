import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormHelperText, FormControlLabel, Radio } from '@material-ui/core';

import { ValidatedRadioGroup } from 'shared/components';

export default class JsonRadioGroupField extends Component {
  static propTypes = {
    schema: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ),
      defaultValue: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { schema, ...otherProps } = this.props;

    return (
      <FormControl>
        <ValidatedRadioGroup
          id={schema.id}
          name={schema.id}
          label={schema.title}
          defaultValue={schema.defaultValue}
          {...otherProps}
        >
          {schema.values.map((option, index) => {
            return (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio color="primary" />}
                label={option.label}
              />
            );
          })}
        </ValidatedRadioGroup>
        <FormHelperText>{schema.description}</FormHelperText>
      </FormControl>
    );
  }
}
