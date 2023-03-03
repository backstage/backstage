/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useMemo } from 'react';
import {
  Form,
  FormProps,
  NextFieldExtensionOptions,
  createAsyncValidators,
  FormValidation,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useCustomFieldExtensions } from '@backstage/plugin-scaffolder-react';
import { JsonObject, JsonValue } from '@backstage/types';
import validator from '@rjsf/validator-ajv8';
import { useApiHolder } from '@backstage/core-plugin-api';

export type ValidateInput = {
  errors: FormValidation;
  formData: Record<string, JsonValue>;
};

type FormHelperProps = React.PropsWithChildren<
  Omit<FormProps, 'extensions'>
> & {
  onValidate: (input: ValidateInput) => void;
};

export const FormHelper = (props: FormHelperProps) => {
  const childrenExtensions = useCustomFieldExtensions(
    props.children,
  ) as NextFieldExtensionOptions<unknown, unknown>[];
  const apiHolder = useApiHolder();

  const extensions = useMemo(() => {
    return Object.fromEntries(
      childrenExtensions.map(({ name, component }) => [name, component]),
    );
  }, [childrenExtensions]);

  const extensionToUse = childrenExtensions[0];

  if (!extensionToUse) {
    throw new Error('No custom field extensions found');
  }

  const schema: JsonObject = {
    type: 'object',
    properties: {
      [extensionToUse.name]: {
        type: 'string', // TODO: pull this from input schema
        'ui:field': extensionToUse.name,
      },
    },
  };

  const validators = useMemo(() => {
    return Object.fromEntries(
      childrenExtensions.map(({ name, validation }) => [name, validation]),
    );
  }, [childrenExtensions]);

  const validation = useMemo(() => {
    return createAsyncValidators(schema, validators, {
      apiHolder,
    });
  }, [validators, apiHolder]);

  const validate = async ({
    formData = {},
  }: {
    formData?: Record<string, JsonValue>;
  }) => {
    props.onValidate({ errors: await validation(formData), formData });
  };
  return (
    <Form
      {...props}
      fields={extensions}
      schema={schema}
      validator={validator}
      onSubmit={validate}
    >
      {/* eslint-disable-next-line react/forbid-elements */}
      <button type="submit" data-testid="form-helper-submit">
        Submit
      </button>
    </Form>
  );
};
