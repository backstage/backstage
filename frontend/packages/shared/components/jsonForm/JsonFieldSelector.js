import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JsonTextField from './JsonTextField';
import JsonSelectField from './JsonSelectField';
import JsonMultiSelectField from './JsonMultiSelectField';
import JsonCheckboxField from './JsonCheckboxField';
import JsonRadioGroupField from './JsonRadioGroupField';

import {
  ValidatorNumberRange,
  ValidatorStringRange,
  ValidatorRegex,
  ValidatorRequired,
} from 'shared/components/form/validators';

export default class JsonFieldSelector extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
  };

  render() {
    const { schema, ...otherProps } = this.props;

    const validators = !schema.validators
      ? []
      : schema.validators.map(validator => {
          switch (validator.type) {
            case 'required':
              return new ValidatorRequired();
            case 'number-range':
              return new ValidatorNumberRange(validator.min, validator.max);
            case 'string-range':
              return new ValidatorStringRange(validator.min, validator.max);
            case 'regex': {
              const regex = new RegExp(validator.match);
              const validatorInstance = validator.message
                ? new ValidatorRegex(regex, validator.message)
                : new ValidatorRegex(regex);
              return validatorInstance;
            }
            case 'custom':
              return validator.validator;
            default:
              return '';
          }
        });

    switch (schema.type) {
      case 'text':
        return <JsonTextField schema={schema} validators={validators} {...otherProps} />;
      case 'number':
        return <JsonTextField schema={schema} type="number" validators={validators} {...otherProps} />;
      case 'select':
        return <JsonSelectField schema={schema} validators={validators} {...otherProps} />;
      case 'multiselect':
        return <JsonMultiSelectField schema={schema} validators={validators} {...otherProps} />;
      case 'checkbox':
        return <JsonCheckboxField schema={schema} validators={validators} {...otherProps} />;
      case 'radiogroup':
        return <JsonRadioGroupField schema={schema} validators={validators} {...otherProps} />;
      default:
        console.error('JsonFieldSelector: unknown type:', schema.type);
        return null;
    }
  }
}
