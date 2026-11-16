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
import { FormValidation } from './createAsyncValidators';

describe('hasErrors', () => {
  it('recognizes schema errors on the root object as well as individual fields', () => {
    const { errorSchema } = customizeValidator().validateFormData(
      { mode: 'blocked' },
      {
        not: { properties: { mode: { const: 'blocked' } }, required: ['mode'] },
      },
    );
    expect(hasErrors(errorSchema as FormValidation)).toBe(true);
    expect(hasErrors({ __errors: [] } as unknown as FormValidation)).toBe(
      false,
    );
  });

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

  it('captures the whole form only when a registered custom validator can use it', () => {
    const schema = {
      properties: { name: { type: 'string', 'ui:field': 'Custom' } },
    };
    const data = { name: 'unchanged', context: 'approved' };
    const snapshot = getValidationData(
      schema,
      data,
      validator,
      new Set(['Custom']),
    );
    data.context = 'blocked';
    expect(snapshot.values).toEqual({ name: 'unchanged', context: 'approved' });
    expect(
      getValidationData(schema, data, validator, new Set(['Custom'])),
    ).not.toEqual(snapshot);
    expect(getValidationData(schema, data, validator).values).toEqual({
      name: 'unchanged',
    });
  });

  it('captures resolved constraints inside nested objects and array items', () => {
    const item = {
      properties: { answer: { type: 'string' } },
      allOf: [
        {
          if: { required: ['selector'] },
          then: { properties: { answer: { minLength: 8 } } },
        },
      ],
    };
    const schema = {
      properties: { nested: item, rows: { type: 'array', items: item } },
    };
    const before = getValidationData(
      schema,
      { nested: { answer: 'short' }, rows: [{ answer: 'short' }] },
      validator,
    );
    const after = getValidationData(
      schema,
      {
        nested: { answer: 'short', selector: true },
        rows: [{ answer: 'short', selector: true }],
      },
      validator,
    );
    expect(after.schemas).not.toEqual(before.schemas);
  });

  it.each(['if', 'allOf', '$ref'])(
    'captures effective constraints for %s presence conditions',
    composition => {
      const condition = {
        if: { required: ['selector'] },
        then: {
          properties: { answer: { minLength: 8 } },
          required: ['answer'],
        },
      };
      const compositions = {
        if: condition,
        allOf: { allOf: [condition] },
        $ref: {
          definitions: { conditional: condition },
          $ref: '#/definitions/conditional',
        },
      };
      const composed = compositions[composition as keyof typeof compositions];
      const schema = {
        properties: { answer: { type: 'string' } },
        ...composed,
      };
      const before = getValidationData(schema, { answer: 'short' }, validator);
      const after = getValidationData(
        schema,
        { answer: 'short', selector: true },
        validator,
      );
      expect(before.values).toEqual(after.values);
      expect(before.schemas).not.toEqual(after.schemas);
      expect(after).toEqual(
        getValidationData(
          schema,
          { answer: 'short', selector: true, unrelated: 'ignored' },
          validator,
        ),
      );
    },
  );

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
    const inputs = getValidationData(schema, data, validator).values;
    data.connection.username = 'edited';
    data.custom.value = 'edited';
    data.rows.push('edited');
    expect(inputs).toEqual({
      connection: { username: 'original' },
      custom: { value: 'original', context: 'needed' },
      rows: ['original'],
    });
    expect(getValidationData({}, data, validator).values).toEqual({});
    expect(
      getValidationData({ required: ['unrelated'] }, data, validator).values,
    ).toEqual({ unrelated: 'ignore' });
  });

  it('tracks dependency selectors and the active branch even when the selector is not a declared property', () => {
    const schema = {
      dependencies: {
        mode: {
          oneOf: [
            {
              properties: {
                mode: { const: 'first' },
                name: { type: 'string' },
              },
            },
            {
              properties: {
                mode: { const: 'second' },
                context: { type: 'string' },
              },
            },
          ],
        },
      },
    };
    expect(
      getValidationData(
        schema,
        { mode: 'first', name: 'new', context: 'retained' },
        validator,
      ).values,
    ).toEqual({ mode: 'first', name: 'new' });
    expect(
      getValidationData(
        schema,
        { mode: 'second', name: 'retained', context: 'existing' },
        validator,
      ).values,
    ).toEqual({ mode: 'second', context: 'existing' });
  });
});
