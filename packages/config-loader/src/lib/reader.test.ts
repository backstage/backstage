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

import { readConfigFile } from './reader';
import { ReaderContext, ReadSecretFunc } from './types';

function memoryFiles(files: { [path: string]: string }) {
  return async (path: string) => {
    if (path in files) {
      return files[path];
    }
    throw new Error(`File not found, ${path}`);
  };
}

const mockContext: ReaderContext = {
  env: {},
  skip: () => false,
  readFile: jest.fn(),
  readSecret: jest.fn(),
};

describe('readConfigFile', () => {
  it('should read a plain config file', async () => {
    const readFile = memoryFiles({
      './app-config.yaml':
        'app: { title: "Test", x: 1, y: [null, true], z: null }',
    });

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
    });

    await expect(config).resolves.toEqual({
      data: {
        app: {
          title: 'Test',
          x: 1,
          y: [true],
        },
      },
      context: 'app-config.yaml',
    });
  });

  it('should error out if the config file has invalid syntax', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': 'app: { title: ]',
    });

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
    });

    await expect(config).rejects.toThrow('Flow map contains an unexpected ]');
  });

  it('should error out if config is not an object', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': '[]',
    });

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
    });

    await expect(config).rejects.toThrow('Expected object at config root');
  });

  it('should read secrets', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': 'app: { $secret: { file: "./my-secret" } }',
    });
    const readSecret = jest.fn().mockResolvedValue('secret');

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
      readSecret: readSecret as ReadSecretFunc,
    });

    await expect(config).resolves.toEqual({
      data: {
        app: 'secret',
      },
      context: 'app-config.yaml',
    });
    expect(readSecret).toHaveBeenCalledWith('.app', {
      file: './my-secret',
    });
  });

  it('should require secrets to be objects', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': 'app: { $secret: ["wrong-type"] }',
    });
    const readSecret = jest.fn().mockResolvedValue('secret');

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
      readSecret: readSecret as ReadSecretFunc,
    });

    expect(readSecret).not.toHaveBeenCalled();
    await expect(config).rejects.toThrow(
      'Expected object at secret .app.$secret',
    );
  });

  it('should forward secret reading errors', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': 'app: { $secret: {} }',
    });
    const readSecret = jest.fn().mockRejectedValue(new Error('NOPE'));

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
      readSecret: readSecret as ReadSecretFunc,
    });

    await expect(config).rejects.toThrow('Invalid secret at .app: NOPE');
  });

  it('should omit skipped values', async () => {
    const readFile = memoryFiles({
      './app-config.yaml': 'app: { title: skip, name: include }',
    });

    const config = readConfigFile('./app-config.yaml', {
      ...mockContext,
      readFile,
      skip: (path: string) => path === '.app.title',
      readSecret: jest.fn() as ReadSecretFunc,
    });

    await expect(config).resolves.toEqual({
      context: 'app-config.yaml',
      data: { app: { name: 'include' } },
    });
  });
});
