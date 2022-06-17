/*
 * Copyright 2022 The Backstage Authors
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

import { createValidator } from './createValidator';
import { CustomFieldValidator } from '../../extensions';
import { ApiHolder } from '@backstage/core-plugin-api';
import { FormValidation } from '@rjsf/core';

describe('createValidator', () => {
  const validators: Record<string, undefined | CustomFieldValidator<unknown>> =
    {
      CustomPicker: (value, validation, _context) => {
        if (!value || !(value as { value?: unknown }).value) {
          validation.addError('Error !');
        }
      },
    };

  const apiHolderMock: jest.Mocked<ApiHolder> = {
    get: jest.fn().mockImplementation(() => {
      return null;
    }),
  };

  const context = {
    apiHolder: apiHolderMock,
  };

  it('Should call validator for object property from a custom field extension', () => {
    /* GIVEN */
    const rootSchema = {
      title: 'Title',
      properties: {
        p1: {
          title: 'PropertyOn',
          type: 'object',
          'ui:field': 'CustomPicker',
        },
      },
    };
    const validator = createValidator(rootSchema, validators, context);

    const formData = {
      p1: {},
    };
    const errors = {
      addError: jest.fn(),
      p1: {
        addError: jest.fn(),
      } as unknown as FormValidation,
    } as unknown as FormValidation;

    /* WHEN */
    const result = validator(formData, errors);

    /* THEN */
    expect(result).not.toBeNull();
    expect(result.p1.addError).toBeCalledTimes(1);
  });
});
