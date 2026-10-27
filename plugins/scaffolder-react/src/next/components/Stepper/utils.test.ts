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
import type { JsonObject } from '@backstage/types';
import type { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';
import { filterReviewState, hasErrors } from './utils';

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

describe('filterReviewState', () => {
  const step = (schema: JsonObject): ParsedTemplateSchema => ({
    title: 'Parameters',
    schema,
    mergedSchema: schema,
    uiSchema: {},
  });

  it('excludes retained fields from inactive hidden dependency branches while preserving shared fields', () => {
    const formState = {
      action: 'manage',
      password: 'retained-password',
      shared: 'shared-value',
      extra: 'extra-value',
    };
    const visible = step({
      properties: { action: { type: 'string' }, shared: { type: 'string' } },
    });
    const hidden = step({
      dependencies: {
        action: {
          oneOf: [
            {
              properties: {
                action: { const: 'create' },
                password: { type: 'string', 'ui:widget': 'password' },
                shared: { type: 'string' },
              },
            },
            { properties: { action: { const: 'manage' } } },
          ],
        },
      },
    });
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      action: 'manage',
      shared: 'shared-value',
      extra: 'extra-value',
    });
    expect(formState.password).toBe('retained-password');
  });

  it('does not infer ownership of hidden nested fields from an object-valued dependency', () => {
    const formState = {
      connection: {
        username: 'visible-user',
        password: 'retained-password',
        extra: 'extra-value',
      },
    };
    const visible = step({
      properties: {
        connection: {
          type: 'object',
          properties: { username: { type: 'string' } },
        },
      },
      dependencies: {
        connection: {
          properties: {
            connection: {
              type: 'object',
              properties: { username: { type: 'string' } },
            },
          },
        },
      },
    });
    const hidden = step({
      properties: {
        connection: {
          type: 'object',
          properties: { password: { type: 'string', 'ui:widget': 'password' } },
        },
      },
    });
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      connection: { username: 'visible-user', extra: 'extra-value' },
    });
    expect(formState.connection.password).toBe('retained-password');
  });
  it('tracks declarations through conditional branches, local references and array items without following reference cycles', () => {
    const formState = {
      servers: [{ host: 'visible-host', password: 'hidden-password' }],
      tokens: { public: 'visible-token', privateToken: 'hidden-token' },
      extra: 'extra-value',
    };
    const visible = step({
      properties: {
        servers: {
          type: 'array',
          items: { properties: { host: { type: 'string' } } },
        },
        tokens: { properties: { public: { type: 'string' } } },
      },
    });
    const hidden = step({
      definitions: {
        credentials: { properties: { password: { type: 'string' } } },
      },
      allOf: [
        { $ref: '#' },
        {
          if: { properties: { action: { const: 'create' } } },
          then: {
            properties: {
              servers: {
                type: 'array',
                items: { $ref: '#/definitions/credentials' },
              },
            },
          },
          else: {
            properties: {
              tokens: { patternProperties: { '^private': { type: 'string' } } },
            },
          },
        },
      ],
    });
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      servers: [{ host: 'visible-host' }],
      tokens: { public: 'visible-token' },
      extra: 'extra-value',
    });
  });
});
