import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from '@material-ui/core';

import { ValidatedForm, ValidatedFormClearButton, ValidatedFormSubmitButton } from 'shared/components';

import JsonFieldSelector from './JsonFieldSelector';

export default class JsonForm extends Component {
  static propTypes = {
    schema: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string,
    testId: PropTypes.string,
  };

  onSubmitHandler = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    const { schema, submitButtonText, testId } = this.props;

    if (!schema) {
      return null;
    }

    return (
      <ValidatedForm data-testid={testId}>
        <FormGroup>
          {schema.map((fieldSchema, index) => (
            <JsonFieldSelector key={index} schema={fieldSchema} />
          ))}

          <ValidatedFormSubmitButton onSubmit={this.onSubmitHandler}>
            {submitButtonText || 'Submit'}
          </ValidatedFormSubmitButton>
          <ValidatedFormClearButton>Clear</ValidatedFormClearButton>
        </FormGroup>
      </ValidatedForm>
    );
  }
}
