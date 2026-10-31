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
import type { JsonObject, JsonValue } from '@backstage/types';
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

  it('omits unrestricted hidden properties of a shared object while preserving visible fields', () => {
    const visible = step({
      properties: {
        connection: {
          type: 'object',
          properties: { username: { type: 'string' } },
        },
      },
    });
    const hidden = step({
      properties: {
        connection: {
          type: 'object',
          additionalProperties: true,
          'ui:backstage': { review: { show: false } },
        },
      },
    });
    const formState = {
      connection: {
        username: 'user',
        password: 'SECRET',
        nested: { token: 'SECRET-token' },
        tokens: ['SECRET-array'],
      },
    };
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      connection: { username: 'user' },
    });
    expect(formState.connection.password).toBe('SECRET');
    expect(formState.connection.nested.token).toBe('SECRET-token');
    expect(formState.connection.tokens).toEqual(['SECRET-array']);
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
  it.each([
    ['properties', true],
    ['patternProperties', true],
    ['properties', { properties: { password: { type: 'string' } } }],
    ['patternProperties', { properties: { password: { type: 'string' } } }],
  ] as [string, JsonValue][])(
    'does not apply additionalProperties to a key matched by %s (%j)',
    (keyword, additionalProperties) => {
      const formState = {
        connection: { username: 'visible-user', password: 'hidden-password' },
        other: { password: 'visible-additional-value' },
      };
      const visible = step({
        [keyword]: {
          [keyword === 'properties' ? 'connection' : '^connection$']: {
            properties: { username: { type: 'string' } },
          },
        },
        additionalProperties,
      });
      const hidden = step({
        properties: {
          connection: {
            properties: {
              password: { type: 'string', 'ui:widget': 'password' },
            },
          },
        },
      });
      expect(filterReviewState(formState, [visible], [hidden])).toEqual({
        connection: { username: 'visible-user' },
        other: { password: 'visible-additional-value' },
      });
      expect(formState.connection.password).toBe('hidden-password');
    },
  );

  it('preserves overlapping fields only when their visible dependency branch is active', () => {
    const visible = step({
      properties: { action: { type: 'string' }, username: { type: 'string' } },
      dependencies: {
        action: {
          oneOf: [
            {
              properties: {
                action: { const: 'create' },
                password: { type: 'string', 'ui:widget': 'password' },
              },
            },
            { properties: { action: { const: 'manage' } } },
          ],
        },
      },
    });
    const hidden = step({
      properties: { password: { type: 'string', 'ui:widget': 'password' } },
    });
    const formState = {
      action: 'manage',
      username: 'visible-user',
      password: 'retained-password',
    };
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      action: 'manage',
      username: 'visible-user',
    });
    const creationState = { ...formState, action: 'create' };
    expect(filterReviewState(creationState, [visible], [hidden])).toEqual(
      creationState,
    );
    expect(formState.password).toBe('retained-password');
  });
  it('evaluates referenced nested conditions against local data while keeping root references', () => {
    const visible = step({
      properties: { connection: { $ref: '#/definitions/connection' } },
      definitions: {
        creation: {
          required: ['mode'],
          properties: { mode: { const: 'create' } },
        },
        connection: {
          properties: { mode: { type: 'string' } },
          if: { $ref: '#/definitions/creation' },
          then: {
            properties: {
              password: { type: 'string', 'ui:widget': 'password' },
            },
          },
          else: { properties: { username: { type: 'string' } } },
        },
      },
    });
    const hidden = step({
      properties: {
        connection: { properties: { password: { type: 'string' } } },
      },
    });
    const formState = {
      connection: {
        mode: 'manage',
        username: 'visible-user',
        password: 'retained-password',
      },
    };
    expect(filterReviewState(formState, [visible], [hidden])).toEqual({
      connection: { mode: 'manage', username: 'visible-user' },
    });
    const creation = {
      connection: { mode: 'create', password: 'retained-password' },
    };
    expect(filterReviewState(creation, [visible], [hidden])).toEqual(creation);
  });

  it('activates a visible dependency only when its trigger is present, including a false value', () => {
    const visible = step({
      properties: { enabled: { type: 'boolean' } },
      dependencies: {
        enabled: {
          properties: { password: { type: 'string', 'ui:widget': 'password' } },
        },
      },
    });
    const hidden = step({ properties: { password: { type: 'string' } } });
    expect(
      filterReviewState({ password: 'retained-password' }, [visible], [hidden]),
    ).toEqual({});
    const formState = { enabled: false, password: 'retained-password' };
    expect(filterReviewState(formState, [visible], [hidden])).toEqual(
      formState,
    );
  });
});
