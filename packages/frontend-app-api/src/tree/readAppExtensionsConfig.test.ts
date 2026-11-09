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

import { ConfigReader } from '@backstage/config';
import { createErrorCollector } from '../wiring/createErrorCollector';
import { JsonValue } from '@backstage/types';
import {
  expandShorthandExtensionParameters,
  readAppExtensionsConfig,
} from './readAppExtensionsConfig';

describe('readAppExtensionsConfig', () => {
  it('reads both forms and reports invalid entries with usable fallbacks', () => {
    const collector = createErrorCollector();
    expect(
      readAppExtensionsConfig(
        new ConfigReader({
          app: { extensions: ['page:catalog', { 'page:scaffolder': false }] },
        }),
        collector,
      ),
    ).toEqual({
      reorder: true,
      parameters: [
        { id: 'page:catalog', disabled: false },
        { id: 'page:scaffolder', disabled: true },
      ],
    });
    expect(
      readAppExtensionsConfig(
        new ConfigReader({
          app: {
            extensions: {
              'page:catalog': { config: { title: 'Catalog' } },
              'page:scaffolder': false,
            },
          },
        }),
        collector,
      ),
    ).toEqual({
      reorder: false,
      parameters: [
        { id: 'page:catalog', config: { title: 'Catalog' } },
        { id: 'page:scaffolder', disabled: true },
      ],
    });
    expect(collector.collectErrors()).toBeUndefined();
    expect(
      readAppExtensionsConfig(
        new ConfigReader({
          app: { extensions: { broken: { disabled: 42 }, valid: true } },
        }),
        collector,
      ).parameters,
    ).toEqual([{ id: 'valid', disabled: false }]);
    expect(
      readAppExtensionsConfig(
        new ConfigReader({ app: { extensions: 42 } }),
        collector,
      ).parameters,
    ).toEqual([]);
    expect(
      readAppExtensionsConfig(
        new ConfigReader({ app: { extensions: [42, 'valid'] } }),
        collector,
      ).parameters,
    ).toEqual([{ id: 'valid', disabled: false }]);
    expect(collector.collectErrors()?.map(e => e.code)).toEqual([
      'EXTENSION_CONFIG_INVALID',
      'EXTENSION_CONFIG_INVALID',
      'EXTENSION_CONFIG_INVALID',
    ]);
  });

  it('normalizes input settings and reports every error while keeping first occurrences', () => {
    const collector = createErrorCollector();
    const result = readAppExtensionsConfig(
      new ConfigReader({
        app: {
          extensions: {
            parent: {
              config: { retained: true },
              inputs: {
                cards: {
                  order: ['a', '*', 'a', '*', 42, '', 'b'],
                  extra: true,
                },
                invalid: [],
                badOrder: { order: 42 },
              },
            },
            badInputs: { inputs: 42 },
          },
        },
      }),
      collector,
    );
    expect(result.parameters).toMatchObject([
      {
        id: 'parent',
        config: { retained: true },
        inputs: { cards: { order: ['a', '*', 'b'] } },
      },
      { id: 'badInputs' },
    ]);
    expect(result.parameters[0].inputs).toEqual({
      cards: { order: ['a', '*', 'b'] },
      badOrder: {},
    });
    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(8);
    expect(errors.every(e => e.code === 'EXTENSION_CONFIG_INVALID')).toBe(true);
    expect(
      errors.map(e => e.message).filter(m => m.includes('duplicate entry')),
    ).toHaveLength(2);
  });
});

describe('expandShorthandExtensionParameters', () => {
  const run = (value: JsonValue) => {
    return expandShorthandExtensionParameters(value, 1);
  };

  it('rejects unknown keys', () => {
    expect(() => run(null)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
    expect(() => run(1)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
    expect(() => run([])).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must be a string or an object"`,
    );
  });

  it('rejects the wrong number of keys', () => {
    expect(() => run({})).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must have exactly one key, got none"`,
    );
    expect(() => run({ a: {}, b: {} })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], must have exactly one key, got 'a', 'b'"`,
    );
  });

  it('rejects unknown values', () => {
    expect(() => run({ a: 1 })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean, 'true', 'false', or object"`,
    );
    expect(() => run({ a: [] })).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][a], value must be a boolean, 'true', 'false', or object"`,
    );
  });

  it('supports string key', () => {
    expect(run('app/root')).toEqual({
      id: 'app/root',
      disabled: false,
    });
    expect(() => run('')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
    expect(() => run(' a')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1], extension ID must not be empty or contain whitespace"`,
    );
  });

  it('supports null value', () => {
    // this is the result of typing:
    // - app/root:
    // The missing value is interpreted as null by the yaml parser so we deal with that
    expect(run({ 'app/root': null })).toEqual({
      id: 'app/root',
      disabled: false,
    });
  });

  it('supports boolean value', () => {
    expect(run({ 'app/root': true })).toEqual({
      id: 'app/root',
      disabled: false,
    });
    expect(run({ 'app/root': false })).toEqual({
      id: 'app/root',
      disabled: true,
    });
  });

  it('supports boolean-ish string value from env var substitution', () => {
    expect(run({ 'app/root': 'true' })).toEqual({
      id: 'app/root',
      disabled: false,
    });
    expect(run({ 'app/root': 'false' })).toEqual({
      id: 'app/root',
      disabled: true,
    });
  });

  it('should not support string values', () => {
    expect(() =>
      run({ 'app/root': 'example-package#MyRouter' }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root], value must be a boolean, 'true', 'false', or object"`,
    );
  });

  it('supports object id only in the key', () => {
    expect(() =>
      run({ 'app/root': { id: 'some.id' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config', 'inputs'"`,
    );
  });

  it('supports object attachTo', () => {
    expect(
      run({
        'app/root': { attachTo: { id: 'other.root', input: 'inputs' } },
      }),
    ).toEqual({
      id: 'app/root',
      attachTo: { id: 'other.root', input: 'inputs' },
    });
    expect(() =>
      run({
        'app/root': {
          id: 'other-id',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].id, unknown parameter; expected one of 'attachTo', 'disabled', 'config', 'inputs'"`,
    );
  });

  it('supports object disabled', () => {
    expect(run({ 'app/root': { disabled: true } })).toEqual({
      id: 'app/root',
      disabled: true,
    });
    expect(run({ 'app/root': { disabled: false } })).toEqual({
      id: 'app/root',
      disabled: false,
    });
    expect(() =>
      run({ 'app/root': { disabled: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].disabled, must be a boolean, 'true', or 'false'"`,
    );
  });

  it('supports boolean-ish string for object disabled from env var substitution', () => {
    expect(run({ 'app/root': { disabled: 'true' } })).toEqual({
      id: 'app/root',
      disabled: true,
    });
    expect(run({ 'app/root': { disabled: 'false' } })).toEqual({
      id: 'app/root',
      disabled: false,
    });
    expect(() =>
      run({ 'app/root': { disabled: 'yes' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].disabled, must be a boolean, 'true', or 'false'"`,
    );
  });

  it('supports object config', () => {
    expect(run({ 'app/root': { config: { disableRedirects: true } } })).toEqual(
      {
        id: 'app/root',
        config: { disableRedirects: true },
      },
    );
    expect(() =>
      run({ 'app/root': { config: 0 } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].config, must be an object"`,
    );
  });

  it('rejects unknown object keys', () => {
    expect(() =>
      run({ 'app/root': { foo: { settings: true } } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid extension configuration at app.extensions[1][app/root].foo, unknown parameter; expected one of 'attachTo', 'disabled', 'config', 'inputs'"`,
    );
  });
});
