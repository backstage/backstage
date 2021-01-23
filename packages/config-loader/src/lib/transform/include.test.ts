/*
 * Copyright 2020 Spotify AB
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

import { createIncludeTransform } from './include';

const env = jest.fn(async (name: string) => {
  return ({
    SECRET: 'my-secret',
  } as { [name: string]: string })[name];
});

const readFile = jest.fn(async (path: string) => {
  const content = ({
    'my-secret': 'secret',
    'my-data.json': '{"a":{"b":{"c":42}}}',
    'my-data.yaml': 'some:\n yaml:\n  key: 7',
    'my-data.yml': 'different: { key: hello }',
    'invalid.yaml': 'foo: [}',
  } as { [key: string]: string })[path];

  if (!content) {
    throw new Error('File not found!');
  }
  return content;
});

const includeTransform = createIncludeTransform(env, readFile);

describe('includeTransform', () => {
  it('should not transform unknown values', async () => {
    await expect(includeTransform('foo')).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(includeTransform([1])).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(includeTransform(1)).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(includeTransform({ x: 'y' })).resolves.toEqual([
      false,
      expect.anything(),
    ]);
    await expect(includeTransform(null)).resolves.toEqual([false, null]);
  });

  it('should include text files', async () => {
    await expect(includeTransform({ $file: 'my-secret' })).resolves.toEqual([
      true,
      'secret',
    ]);
    await expect(includeTransform({ $file: 'no-secret' })).rejects.toThrow(
      'File not found!',
    );
  });

  it('should include env vars', async () => {
    await expect(includeTransform({ $env: 'SECRET' })).resolves.toEqual([
      true,
      'my-secret',
    ]);
    await expect(includeTransform({ $env: 'NO_SECRET' })).resolves.toEqual([
      true,
      undefined,
    ]);
  });

  it('should include config files', async () => {
    // New format with path in fragment
    await expect(
      includeTransform({ $include: 'my-data.json#a.b.c' }),
    ).resolves.toEqual([true, 42]);
    await expect(
      includeTransform({ $include: 'my-data.json#a.b' }),
    ).resolves.toEqual([true, { c: 42 }]);
    await expect(
      includeTransform({ $include: 'my-data.yaml#some.yaml.key' }),
    ).resolves.toEqual([true, 7]);
    await expect(
      includeTransform({ $include: 'my-data.yaml' }),
    ).resolves.toEqual([
      true,
      {
        some: { yaml: { key: 7 } },
      },
    ]);
    await expect(
      includeTransform({ $include: 'my-data.yaml#' }),
    ).resolves.toEqual([
      true,
      {
        some: { yaml: { key: 7 } },
      },
    ]);
    await expect(
      includeTransform({ $include: 'my-data.yml#different.key' }),
    ).resolves.toEqual([true, 'hello']);
  });

  it('should reject invalid includes', async () => {
    await expect(
      includeTransform({ $include: 'no-parser.js' }),
    ).rejects.toThrow('no configuration parser available for extension .js');
    await expect(
      includeTransform({ $include: 'no-data.yml#different.key' }),
    ).rejects.toThrow('File not found!');
    await expect(
      includeTransform({ $include: 'my-data.yml#missing.key' }),
    ).rejects.toThrow(
      "value at 'missing' in included file my-data.yml is not an object",
    );
    await expect(
      includeTransform({ $include: 'invalid.yaml' }),
    ).rejects.toThrow(
      'failed to parse included file invalid.yaml, YAMLSyntaxError: Flow sequence contains an unexpected }',
    );
  });
});
