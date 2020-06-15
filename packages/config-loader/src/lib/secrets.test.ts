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

import { readSecret } from './secrets';
import { ReaderContext } from './types';

const ctx: ReaderContext = {
  env: {
    SECRET: 'my-secret',
  },
  readSecret: jest.fn(),
  async readFile(path) {
    const content = ({
      'my-secret': 'secret',
      'my-data.json': '{"a":{"b":{"c":42}}}',
      'my-data.yaml': 'some:\n yaml:\n  key: 7',
      'my-data.yml': 'different: { key: hello }',
    } as { [key: string]: string })[path];

    if (!content) {
      throw new Error('File not found!');
    }
    return content;
  },
};

describe('readSecret', () => {
  it('should read file secrets', async () => {
    await expect(readSecret({ file: 'my-secret' }, ctx)).resolves.toBe(
      'secret',
    );
    await expect(readSecret({ file: 'no-secret' }, ctx)).rejects.toThrow(
      'File not found!',
    );
  });

  it('should read present env secrets', async () => {
    await expect(readSecret({ env: 'SECRET' }, ctx)).resolves.toBe('my-secret');
    await expect(readSecret({ env: 'NO_SECRET' }, ctx)).resolves.toBe(
      undefined,
    );
  });

  it('should read data secrets', async () => {
    await expect(
      readSecret({ data: 'my-data.json', path: 'a.b.c' }, ctx),
    ).resolves.toBe('42');

    await expect(
      readSecret({ data: 'my-data.yaml', path: 'some.yaml.key' }, ctx),
    ).resolves.toBe('7');

    await expect(
      readSecret({ data: 'my-data.yml', path: 'different.key' }, ctx),
    ).resolves.toBe('hello');

    await expect(
      readSecret({ data: 'no-data.yml', path: 'different.key' }, ctx),
    ).rejects.toThrow('File not found!');
  });

  it('should reject invalid secrets', async () => {
    await expect(readSecret('hello' as any, ctx)).rejects.toThrow(
      'secret must be a `object` type, but the final value was: `"hello"`.',
    );
    await expect(readSecret({}, ctx)).rejects.toThrow(
      "Secret must contain one of 'file', 'env', 'data'",
    );
    await expect(readSecret({ unknown: 'derp' }, ctx)).rejects.toThrow(
      "Secret must contain one of 'file', 'env', 'data'",
    );
    await expect(readSecret({ data: 'no-data.yml' }, ctx)).rejects.toThrow(
      'path is a required field',
    );
    await expect(
      readSecret({ data: 'no-parser.js', path: '.' }, ctx),
    ).rejects.toThrow('No data secret parser available for extension .js');
    await expect(
      readSecret({ data: 'my-data.yaml', path: 'some.wrong.yaml.key' }, ctx),
    ).rejects.toThrow('Value is not an object at some.wrong in my-data.yaml');
  });

  it('should have 100% test coverage', async () => {
    let firstVisit = true;
    const secret = {};
    const proto = {
      get file() {
        if (!firstVisit) {
          Object.setPrototypeOf(secret, {});
        }
        firstVisit = false;
        return 'a-file';
      },
    };
    Object.setPrototypeOf(secret, proto);

    await expect(readSecret(secret, ctx)).rejects.toThrow(
      'Secret was left unhandled',
    );
  });
});
