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
import { customizeValidator } from '@rjsf/validator-ajv8';
import { getValidationData, hasErrors } from './utils';

describe('hasErrors', () => {
  it('should return false for empty _errors', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: jest.fn(),
        },
      }),
    ).toBe(false);
  });

  it('should return true for a single error', () => {
    expect(
      hasErrors({
        name: {
          __errors: ['an error'],
          addError: jest.fn(),
        },
      }),
    ).toBe(true);
  });

  it('should return true for more than one error', () => {
    expect(
      hasErrors({
        name: {
          __errors: [],
          addError: jest.fn(),
        },
        general: {
          address: {
            __errors: [],
            addError: jest.fn(),
          },
          name: {
            __errors: ['something is broken here!'],
            addError: jest.fn(),
          },
        },
      }),
    ).toBe(true);
  });

  it('should not return false when the error is an empty object', () => {
    const errors = {
      something: {},
      otherThing: {},
      someName: {
        __errors: [
          'Accepts alphanumeric values along with _(underscore) and -(hyphen) as special characters',
        ],
        addError: jest.fn(),
      },
      someOtherName: {
        __errors: ['Must start with an alphabet & not contain .(period)'],
        addError: jest.fn(),
      },
      aName: {
        __errors: [],
        addError: jest.fn(),
      },
      bName: {
        __errors: [],
        addError: jest.fn(),
      },
      cName: {
        __errors: [],
        addError: jest.fn(),
      },
    };

    expect(hasErrors(errors)).toBe(true);
  });
});

describe('getValidationData', () => {
  const validator = customizeValidator();

  it('tracks nested declared values, references and complete custom-field inputs without unrelated values', () => {
    const schema = {
      definitions: {
        Connection: { properties: { username: { type: 'string' } } },
      },
      properties: {
        connection: { $ref: '#/definitions/Connection' },
        custom: {
          type: 'object',
          'ui:field': 'Custom',
          properties: { value: { type: 'string' } },
        },
        rows: { type: 'array', items: { type: 'string' } },
      },
    };
    const data = {
      connection: { username: 'original', other: 'unrelated' },
      custom: { value: 'original', context: 'needed' },
      rows: ['original'],
      unrelated: 'ignore',
    };
    const inputs = getValidationData(schema, data, validator);
    data.connection.username = 'edited';
    data.custom.value = 'edited';
    data.rows.push('edited');
    expect(inputs).toEqual({
      connection: { username: 'original' },
      custom: { value: 'original', context: 'needed' },
      rows: ['original'],
    });
    expect(getValidationData({}, data, validator)).toEqual({});
    expect(
      getValidationData({ required: ['unrelated'] }, data, validator),
    ).toEqual({ unrelated: 'ignore' });
  });

  it('tracks dependency selectors and the active branch even when the selector is not a declared property', () => {
    const schema = {
      dependencies: {
        mode: {
          oneOf: [
            {
              properties: {
                mode: { const: 'create' },
                name: { type: 'string' },
              },
            },
            {
              properties: {
                mode: { const: 'manage' },
                project: { type: 'string' },
              },
            },
          ],
        },
      },
    };
    expect(
      getValidationData(
        schema,
        { mode: 'create', name: 'new', project: 'retained' },
        validator,
      ),
    ).toEqual({ mode: 'create', name: 'new' });
    expect(
      getValidationData(
        schema,
        { mode: 'manage', name: 'retained', project: 'existing' },
        validator,
      ),
    ).toEqual({ mode: 'manage', project: 'existing' });
  });
});
