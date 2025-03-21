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

import { compileConfigSchemas } from './compile';

describe('compileConfigSchemas', () => {
  it('should merge schemas', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a',
        packageName: 'a',
        value: { type: 'object', properties: { a: { type: 'string' } } },
      },
      {
        path: 'b',
        packageName: 'b',
        value: { type: 'object', properties: { b: { type: 'number' } } },
      },
    ]);
    expect(validate([{ data: { a: [1] }, context: 'test' }])).toEqual({
      errors: [
        {
          keyword: 'type',
          instancePath: '/a',
          schemaPath: '#/properties/a/type',
          message: 'must be string',
          params: { type: 'string' },
        },
      ],
      visibilityByDataPath: new Map(),
      deepVisibilityByDataPath: new Map(),
      visibilityBySchemaPath: new Map(),
      deprecationByDataPath: new Map(),
    });
    expect(validate([{ data: { b: 'b' }, context: 'test' }])).toEqual({
      errors: [
        {
          keyword: 'type',
          instancePath: '/b',
          schemaPath: '#/properties/b/type',
          message: 'must be number',
          params: { type: 'number' },
        },
      ],
      visibilityByDataPath: new Map(),
      deepVisibilityByDataPath: new Map(),
      visibilityBySchemaPath: new Map(),
      deprecationByDataPath: new Map(),
    });
  });

  it('should discover visibility', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a1',
        packageName: 'a1',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string', visibility: 'frontend' },
            b: { type: 'string', visibility: 'backend' },
            c: { type: 'string' },
            d: {
              type: 'array',
              visibility: 'frontend',
              items: { type: 'string', visibility: 'frontend' },
            },
          },
        },
      },
      {
        path: 'a2',
        packageName: 'a2',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string' },
            b: { type: 'string', visibility: 'secret' },
            c: { type: 'string', visibility: 'backend' },
            d: {
              type: 'array',
              visibility: 'frontend',
              items: { type: 'string' },
            },
          },
        },
      },
    ]);
    expect(
      validate([
        { data: { a: 'a', b: 'b', c: 'c', d: ['d'] }, context: 'test' },
      ]),
    ).toEqual({
      visibilityByDataPath: new Map(
        Object.entries({
          '/a': 'frontend',
          '/b': 'secret',
          '/d': 'frontend',
          '/d/0': 'frontend',
        }),
      ),
      deepVisibilityByDataPath: new Map(),
      visibilityBySchemaPath: new Map(
        Object.entries({
          '/properties/a': 'frontend',
          '/properties/b': 'secret',
          '/properties/d': 'frontend',
          '/properties/d/items': 'frontend',
        }),
      ),
      deprecationByDataPath: new Map(),
    });
  });

  it('should reject visibility conflicts', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a1',
          packageName: 'a1',
          value: {
            type: 'object',
            properties: { a: { type: 'string', visibility: 'frontend' } },
          },
        },
        {
          path: 'a2',
          packageName: 'a2',
          value: {
            type: 'object',
            properties: { a: { type: 'string', visibility: 'secret' } },
          },
        },
      ]),
    ).toThrow(
      "Config schema visibility is both 'frontend' and 'secret' for properties/a/visibility",
    );
  });

  it('should discover deprecations', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a1',
        packageName: 'a1',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string', deprecated: 'deprecation reason for a' },
            b: { type: 'string', deprecated: 'deprecation reason for b' },
            c: { type: 'string' },
          },
        },
      },
    ]);
    expect(
      validate([
        { data: { a: 'a', b: 'b', c: 'c', d: ['d'] }, context: 'test' },
      ]),
    ).toEqual({
      deprecationByDataPath: new Map(
        Object.entries({
          '/a': 'deprecation reason for a',
          '/b': 'deprecation reason for b',
        }),
      ),
      deepVisibilityByDataPath: new Map(),
      visibilityByDataPath: new Map(),
      visibilityBySchemaPath: new Map(),
    });
  });

  it('should handle slashes correctly', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a1',
        packageName: 'a1',
        value: {
          type: 'object',
          properties: {
            '/circleci/api': {
              type: 'object',
              properties: {
                target: {
                  type: 'string',
                },
                headers: {
                  type: 'object',
                  properties: {
                    'Circle-Token': {
                      type: 'string',
                      visibility: 'secret',
                    },
                  },
                },
              },
            },
            '/gocd': { type: 'string', visibility: 'backend' },
          },
        },
      },
    ]);
    expect(
      validate([
        {
          data: {
            '/circleci/api': {
              target: 'test',
              headers: {
                'Circle-Token': 'my-token',
              },
            },
            '/gocd': 'test',
          },
          context: 'test',
        },
      ]),
    ).toEqual({
      visibilityByDataPath: new Map(
        Object.entries({
          '//circleci/api/headers/Circle-Token': 'secret',
        }),
      ),
      deepVisibilityByDataPath: new Map(),
      visibilityBySchemaPath: new Map(
        Object.entries({
          '/properties//circleci/api/properties/headers/properties/Circle-Token':
            'secret',
        }),
      ),
      deprecationByDataPath: new Map(),
    });
  });
});

describe('deepVisibility', () => {
  it('should pass secret visibility to children, but respect existing backend/secret visibility', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a1',
        packageName: 'a1',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string', visibility: 'backend' },
            b: { type: 'string', visibility: 'backend' },
            c: { type: 'string' },
            d: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
      {
        path: 'a2',
        packageName: 'a2',
        value: {
          type: 'object',
          deepVisibility: 'secret',
          properties: {
            a: { type: 'string' },
            b: { type: 'string', visibility: 'secret' },
            c: { type: 'string', visibility: 'backend' },
            d: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    ]);
    expect(
      validate([
        {
          data: { a: 'a', b: 'b', c: 'c', d: ['d'] },
          context: 'test',
        },
      ]),
    ).toEqual({
      visibilityByDataPath: new Map(
        Object.entries({
          '/b': 'secret',
        }),
      ),
      deepVisibilityByDataPath: new Map(
        Object.entries({
          '': 'secret',
        }),
      ),
      visibilityBySchemaPath: new Map(
        Object.entries({
          '': 'secret',
          '/properties/b': 'secret',
        }),
      ),
      deprecationByDataPath: new Map(),
    });
  });

  it('should pass secret visibility to children, but throws when overriding with frontend visibility', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a1',
          packageName: 'a1',
          value: {
            type: 'object',
            properties: {
              a: { type: 'string', visibility: 'frontend' },
              b: { type: 'string', visibility: 'backend' },
              c: { type: 'string' },
              d: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        {
          path: 'a2',
          packageName: 'a2',
          value: {
            type: 'object',
            deepVisibility: 'secret',
            visibility: 'secret',
            properties: {
              a: { type: 'string' },
              b: { type: 'string', visibility: 'secret' },
              c: { type: 'string', visibility: 'frontend' },
              d: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      ]),
    ).toThrow(
      "Config schema visibility is both 'frontend' and 'secret' for /properties/a",
    );
  });

  it('should throw when children have a different deepVisibility', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a2',
          packageName: 'a2',
          value: {
            type: 'object',
            deepVisibility: 'secret',
            properties: {
              a: {
                type: 'object',
                properties: {
                  a: { type: 'string', deepVisibility: 'frontend' },
                },
              },
              b: { type: 'string', visibility: 'secret' },
              c: { type: 'string', visibility: 'backend' },
              d: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      ]),
    ).toThrow(
      `Config schema visibility is both 'frontend' and 'secret' for /properties/a`,
    );
  });

  it('should throw when the same schema node has a conflicting deepVisibility', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a2',
          packageName: 'a2',
          value: {
            type: 'object',
            properties: {
              a: {
                type: 'string',
                deepVisibility: 'secret',
                visibility: 'frontend',
              },
            },
          },
        },
      ]),
    ).toThrow(
      `Config schema visibility is both 'frontend' and 'secret' for /properties/a`,
    );
  });

  it('should throw when ancestor and children have a different deepVisibility', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a1',
          packageName: 'a1',
          value: {
            type: 'object',
            properties: {
              a: {
                type: 'object',
                properties: {
                  a: { type: 'string' },
                },
              },
              b: { type: 'string', visibility: 'backend' },
              c: { type: 'string' },
              d: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        {
          path: 'a2',
          packageName: 'a2',
          value: {
            type: 'object',
            deepVisibility: 'secret',
            properties: {
              a: {
                type: 'object',
                deepVisibility: 'frontend',
                properties: {
                  a: { type: 'string', visibility: 'frontend' },
                },
              },
              b: { type: 'string', visibility: 'secret' },
              c: { type: 'string', visibility: 'backend' },
              d: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      ]),
    ).toThrow(
      `Config schema visibility is both 'frontend' and 'secret' for /properties/a`,
    );
  });
});
