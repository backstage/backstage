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

import { InputError } from '@backstage/errors';
import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from '@standard-schema/spec';
import { z } from 'zod';
import { createSignInResolverFactory } from './createSignInResolverFactory';

describe('createSignInResolverFactory', () => {
  it('validates options synchronously and passes transformed output to create', () => {
    const create = jest.fn(() => jest.fn());
    const factory = createSignInResolverFactory({
      optionsSchema: z
        .object({
          name: z.string(),
          enabled: z.boolean().default(true),
        })
        .transform(options => ({
          displayName: options.name.trim(),
          active: options.enabled,
        })),
      create,
    });

    factory({ name: ' Example ' });

    expect(create).toHaveBeenCalledWith({
      displayName: 'Example',
      active: true,
    });
    expect(factory.optionsJsonSchema).toMatchObject({
      properties: {
        name: { type: 'string' },
        enabled: { default: true, type: 'boolean' },
      },
      required: ['name'],
    });
  });

  it('uses the Standard JSON Schema input converter targeting draft-07', () => {
    const input = jest.fn(() => ({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    }));
    const schema: StandardSchemaV1<{ name: string }, { name: string }> &
      StandardJSONSchemaV1<{ name: string }, { name: string }> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate(value) {
          return { value: value as { name: string } };
        },
        jsonSchema: {
          input,
          output() {
            return {};
          },
        },
      },
    };

    const factory = createSignInResolverFactory({
      optionsSchema: schema,
      create: () => jest.fn(),
    });

    expect(input).toHaveBeenCalledWith({ target: 'draft-07' });
    expect(factory.optionsJsonSchema).toEqual({
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    });
  });

  it('reports Standard Schema issues with normalized paths', () => {
    const schema: StandardSchemaV1<object> & StandardJSONSchemaV1<object> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate() {
          return {
            issues: [
              {
                message: 'Must be a valid email address',
                path: [{ key: 'profile' }, 'emails', 0],
              },
              { message: 'Must be a boolean', path: [{ key: 'enabled' }] },
            ],
          };
        },
        jsonSchema: {
          input() {
            return { type: 'object' };
          },
          output() {
            return { type: 'object' };
          },
        },
      },
    };
    const factory = createSignInResolverFactory({
      optionsSchema: schema,
      create: () => jest.fn(),
    });
    const createResolver = () => factory({});

    expect(createResolver).toThrow(InputError);
    expect(createResolver).toThrow(
      "Invalid sign-in resolver options, Must be a valid email address at 'profile.emails.0'; Must be a boolean at 'enabled'",
    );
  });

  it('rejects asynchronous schemas immediately', () => {
    const schema: StandardSchemaV1<string> & StandardJSONSchemaV1<string> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        async validate(value) {
          return { value: String(value) };
        },
        jsonSchema: {
          input() {
            return { type: 'string' };
          },
          output() {
            return { type: 'string' };
          },
        },
      },
    };
    const create = jest.fn(() => jest.fn());
    const factory = createSignInResolverFactory({
      optionsSchema: schema,
      create,
    });
    const createResolver = () => factory('value');

    expect(createResolver).toThrow(InputError);
    expect(createResolver).toThrow(
      'Sign-in resolver option schemas must validate synchronously; asynchronous schemas are not supported by sign-in resolver factories',
    );
    expect(create).not.toHaveBeenCalled();
  });
});
