/*
 * Copyright 2026 The Backstage Authors
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
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createInitialConfig,
  generateConfigYaml,
  validateConfig,
  type ConfigValue,
} from './config';
import type { ConfigSchema } from './manifest';

const schema = {
  type: 'object',
  properties: {
    example: {
      type: 'object',
      properties: {
        endpoint: { type: 'string', default: 'https://example.com/api' },
        retries: { type: 'integer', default: 3 },
        enabled: { type: 'boolean', default: false },
        token: {
          type: 'string',
          'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
        },
        labels: {
          type: 'array',
          items: { type: 'string', enum: ['primary', 'secondary'] },
        },
        optionalText: { type: 'string' },
        optionalEmptyGroup: {
          type: 'object',
          properties: { note: { type: 'string' } },
        },
        optionalNestedEmptyGroup: {
          type: 'object',
          properties: {
            nested: {
              type: 'object',
              properties: { note: { type: 'string' } },
            },
          },
          required: ['nested'],
        },
        optionalDefaultGroup: {
          type: 'object',
          properties: { region: { type: 'string', default: 'us-east-1' } },
        },
        requiredGroup: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      },
      required: ['endpoint', 'token', 'requiredGroup'],
    },
  },
  required: ['example'],
} satisfies ConfigSchema;

describe('createInitialConfig', () => {
  it('initializes defaults, required objects, and secret placeholders without empty optional branches', () => {
    const value = createInitialConfig(schema);

    assert.deepEqual(value, {
      example: {
        endpoint: 'https://example.com/api',
        retries: 3,
        enabled: false,
        token: '${EXAMPLE_TOKEN}',
        optionalDefaultGroup: { region: 'us-east-1' },
        requiredGroup: {},
      },
    });
    assert.deepEqual(Object.keys(value as Record<string, ConfigValue>), [
      'example',
    ]);
    assert.deepEqual(
      Object.keys((value as Record<string, ConfigValue>).example as object),
      [
        'endpoint',
        'retries',
        'enabled',
        'token',
        'optionalDefaultGroup',
        'requiredGroup',
      ],
    );
  });
});

describe('validateConfig', () => {
  it('validates required fields, scalar types, allowed values, arrays, and integers recursively', () => {
    const validationSchema = {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['active', 'passive'] },
        ratio: { type: 'number', enum: [0, 0.5, 1] },
        attempts: { type: 'integer' },
        enabled: { type: 'boolean' },
        optionalText: { type: 'string' },
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              priority: { type: 'integer', enum: [1, 2] },
            },
            required: ['name'],
          },
        },
        missingValue: { type: 'string' },
      },
      required: [
        'mode',
        'ratio',
        'attempts',
        'enabled',
        'entries',
        'missingValue',
      ],
    } satisfies ConfigSchema;

    assert.deepEqual(
      validateConfig(validationSchema, {
        mode: 'active',
        ratio: 0.5,
        attempts: 2,
        enabled: false,
        optionalText: '',
        entries: [{ name: 'first', priority: 1 }],
      }),
      [{ path: ['missingValue'], message: 'Required' }],
    );

    assert.deepEqual(
      validateConfig(validationSchema, {
        mode: 'unsupported',
        ratio: '0.5',
        attempts: 1.5,
        enabled: 'false',
        optionalText: '',
        entries: [
          { priority: 3 },
          'not-an-object',
        ],
      } as ConfigValue),
      [
        { path: ['mode'], message: 'Must be one of: active, passive' },
        { path: ['ratio'], message: 'Expected a number' },
        { path: ['attempts'], message: 'Expected an integer' },
        { path: ['enabled'], message: 'Expected a boolean' },
        { path: ['entries', '0', 'name'], message: 'Required' },
        {
          path: ['entries', '0', 'priority'],
          message: 'Must be one of: 1, 2',
        },
        { path: ['entries', '1'], message: 'Expected an object' },
        { path: ['missingValue'], message: 'Required' },
      ],
    );
  });
});

describe('generateConfigYaml', () => {
  it('uses schema order, prunes optional empty values, preserves false and zero, and ignores undeclared keys', () => {
    const yamlSchema = {
      type: 'object',
      properties: {
        example: {
          type: 'object',
          properties: {
            zeta: { type: 'string' },
            alpha: { type: 'string' },
            enabled: { type: 'boolean' },
            count: { type: 'number' },
            token: {
              type: 'string',
              'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
            },
            optionalText: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['zeta', 'alpha', 'enabled', 'count', 'token'],
        },
      },
      required: ['example'],
    } satisfies ConfigSchema;

    assert.equal(
      generateConfigYaml(yamlSchema, {
        ignoredRoot: 'ignored',
        example: {
          ignoredNested: 'ignored',
          tags: ['primary', 'secondary'],
          optionalText: '',
          token: 'must-not-be-serialized',
          count: 0,
          enabled: false,
          alpha: 'first',
          zeta: 'last',
        },
      }),
      'example:\n  zeta: last\n  alpha: first\n  enabled: false\n  count: 0\n  token: ${EXAMPLE_TOKEN}\n  tags:\n    - primary\n    - secondary\n',
    );
  });

  it('always emits a literal environment placeholder for secrets', () => {
    const schemaWithSecret = {
      type: 'object',
      properties: {
        example: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              'x-ui': { secretEnv: 'EXAMPLE_TOKEN' },
            },
          },
          required: ['token'],
        },
      },
      required: ['example'],
    } satisfies ConfigSchema;

    assert.equal(
      generateConfigYaml(
        schemaWithSecret,
        createInitialConfig(schemaWithSecret),
      ),
      'example:\n  token: ${EXAMPLE_TOKEN}\n',
    );
    assert.equal(
      generateConfigYaml(schemaWithSecret, {
        example: { token: 'a-real-secret' },
      }),
      'example:\n  token: ${EXAMPLE_TOKEN}\n',
    );
  });

  it('throws validation errors containing the same field paths as validateConfig', () => {
    const invalidValue = {
      example: {
        endpoint: 42,
        token: '${EXAMPLE_TOKEN}',
        requiredGroup: {},
      },
    } as ConfigValue;
    const errors = validateConfig(schema, invalidValue);

    assert.deepEqual(errors, [
      {
        path: ['example', 'endpoint'],
        message: 'Expected a string',
      },
    ]);
    assert.throws(
      () => generateConfigYaml(schema, invalidValue),
      error =>
        error instanceof Error &&
        errors.every(({ path }) => error.message.includes(path.join('.'))),
    );
  });
});
