/*
 * Copyright 2020 The Backstage Authors
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

import mockFs from 'mock-fs';
import { loadConfigSchema } from './load';

describe('loadConfigSchema', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should load schema from packages or data', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: {
              type: 'object',
              properties: {
                key1: { type: 'string', visibility: 'frontend' },
              },
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            configSchema: 'schema.json',
          }),
          'schema.json': JSON.stringify({
            name: 'a',
            configSchema: {
              type: 'object',
              properties: {
                key2: { type: 'number' },
              },
            },
          }),
        },
      },
    });

    const schema = await loadConfigSchema({
      dependencies: ['a'],
    });

    const configs = [{ data: { key1: 'a', key2: 2 }, context: 'test' }];

    expect(schema.process(configs)).toEqual(configs);
    expect(schema.process(configs, { visibility: ['frontend'] })).toEqual([
      { data: { key1: 'a' }, context: 'test' },
    ]);
    expect(
      schema.process(configs, {
        visibility: ['frontend'],
        valueTransform: () => 'X',
        withFilteredKeys: true,
      }),
    ).toEqual([
      { data: { key1: 'X' }, context: 'test', filteredKeys: ['key2'] },
    ]);
    expect(
      schema.process(configs, {
        valueTransform: () => 'X',
        withFilteredKeys: true,
      }),
    ).toEqual([
      { data: { key1: 'X', key2: 'X' }, context: 'test', filteredKeys: [] },
    ]);

    const serialized = schema.serialize();

    const schema2 = await loadConfigSchema({ serialized });
    expect(schema2.process(configs, { visibility: ['frontend'] })).toEqual([
      { data: { key1: 'a' }, context: 'test' },
    ]);
    expect(() =>
      schema2.process([...configs, { data: { key1: 3 }, context: 'test2' }]),
    ).toThrow(
      'Config validation failed, Config should be string { type=string } at /key1',
    );

    await expect(
      loadConfigSchema({
        serialized: { ...serialized, backstageConfigSchemaVersion: 2 },
      }),
    ).rejects.toThrow(
      'Serialized configuration schema is invalid or has an invalid version number',
    );
  });

  describe('should consider schema', () => {
    it('when filtering simple config', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'a',
          configSchema: {
            type: 'object',
            properties: {
              key1: { type: 'string', visibility: 'frontend' },
              key2: { type: 'number', visibility: 'secret' },
            },
          },
        }),
      });

      const schema = await loadConfigSchema({
        packagePaths: ['package.json'],
        dependencies: [],
      });

      const configs = [
        { data: { key1: 'a', key2: 'not-a-number' }, context: 'test' },
      ];

      expect(() => schema.process(configs)).toThrow(
        'Config validation failed, Config should be number { type=number } at /key2',
      );
      expect(schema.process(configs, { visibility: ['frontend'] })).toEqual([
        { data: { key1: 'a' }, context: 'test' },
      ]);
      expect(() => schema.process(configs, { visibility: ['secret'] })).toThrow(
        'Config validation failed, Config should be number { type=number } at /key2',
      );
    });

    it('when filtering nested config', async () => {
      mockFs({
        'package.json': JSON.stringify({
          name: 'a',
          configSchema: {
            type: 'object',
            properties: {
              nested: {
                allOf: [
                  {
                    type: 'array',
                    items: {
                      type: 'object',
                      visibility: 'frontend',
                      properties: {
                        x: { type: 'number' },
                      },
                      additionalProperties: {
                        visibility: 'frontend',
                        type: 'string',
                        pattern: '^...$',
                      },
                    },
                  },
                ],
              },
            },
          },
        }),
      });

      const schema = await loadConfigSchema({
        packagePaths: ['package.json'],
        dependencies: [],
      });

      const mkConfig = (nested: any) => [
        { data: { nested: [nested] }, context: 'test' },
      ];
      expect(
        schema.process(mkConfig({ x: 1 }), { visibility: ['frontend'] }),
      ).toEqual([{ data: { nested: [{}] }, context: 'test' }]);
      expect(() => schema.process(mkConfig({ y: 1 }))).toThrow(
        'Config validation failed, Config should be string { type=string } at /nested/0/y',
      );
      expect(() =>
        schema.process(mkConfig({ y: 1 }), { visibility: ['frontend'] }),
      ).toThrow(
        'Config validation failed, Config should be string { type=string } at /nested/0/y',
      );
      expect(
        schema.process(mkConfig({ x: 'a' }), { visibility: ['frontend'] }),
      ).toEqual([{ data: { nested: [{}] }, context: 'test' }]);
      expect(
        schema.process(mkConfig({ y: 'aaa' }), { visibility: ['frontend'] }),
      ).toEqual([{ data: { nested: [{ y: 'aaa' }] }, context: 'test' }]);
      expect(() =>
        schema.process(mkConfig({ y: 'aaaa' }), { visibility: ['frontend'] }),
      ).toThrow(
        'Config validation failed, Config should match pattern "^...$" { pattern=^...$ } at /nested/0/y',
      );

      // This is a bit of an edge case where we have a structural error, these should always be reported
      expect(() =>
        schema.process([{ data: { nested: {} }, context: 'test' }], {
          visibility: ['frontend'],
        }),
      ).toThrow(
        'Config validation failed, Config should be array { type=array } at /nested',
      );
    });
  });

  it('when filtering config with required values', async () => {
    mockFs({
      'package.json': JSON.stringify({
        name: 'a',
        configSchema: {
          type: 'object',
          properties: {
            other: {
              required: ['x a'],
              type: 'object',
              properties: {
                'x a': { type: 'number', visibility: 'frontend' },
              },
            },
          },
        },
      }),
    });

    const schema = await loadConfigSchema({
      packagePaths: ['package.json'],
      dependencies: [],
    });

    // Errors about required values should also be filtered like the rest
    expect(() =>
      schema.process([{ data: { other: {} }, context: 'test' }], {
        visibility: ['frontend'],
      }),
    ).toThrow(
      "Config should have required property 'x a' { missingProperty=x a } at /other",
    );
  });
});
