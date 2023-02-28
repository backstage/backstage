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

import { Serializable, spawn } from 'child_process';
import { DevDataStore } from './DevDataStore';
import { BackstageIpcClient } from './ipcClient';

function applyIpcTransform(value: Serializable): Promise<Serializable> {
  const child = spawn(
    'node',
    [
      '--eval',
      `
        const listener = msg => {
          process.send(msg);
          process.removeListener('message', listener);
        }
        process.addListener('message', listener);
      `,
    ],
    {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      serialization: 'advanced',
    },
  );

  return new Promise(resolve => {
    child.addListener('message', resolve);
    child.send(value);
  });
}

class MockIpcClient implements Pick<BackstageIpcClient, 'request'> {
  #data = new Map<string, Serializable>();

  async request(method: string, body: any): Promise<any> {
    if (method === 'DevDataStore.save') {
      this.#data.set(body.key, body.data);
      return { saved: true };
    } else if (method === 'DevDataStore.load') {
      if (!this.#data.has(body.key)) {
        return { loaded: false, data: undefined };
      }
      const data = this.#data.get(body.key)!;
      return { loaded: true, data: await applyIpcTransform(data) };
    }
    throw new Error('Unknown message');
  }
}

describe('DevDataStore', () => {
  it('should save and load data', async () => {
    const store = DevDataStore.forTest(new MockIpcClient());

    await expect(store.save('test', { foo: 'bar' })).resolves.toEqual({
      saved: true,
    });
    await expect(store.load('test')).resolves.toEqual({
      loaded: true,
      data: { foo: 'bar' },
    });
  });

  it('should save and load buffers', async () => {
    const store = DevDataStore.forTest(new MockIpcClient());

    await expect(
      store.save('test', Buffer.from('abc', 'ascii')),
    ).resolves.toEqual({
      saved: true,
    });
    await expect(store.load('test')).resolves.toEqual({
      loaded: true,
      data: Buffer.from('abc', 'ascii'),
    });
  });

  it('should save and load array buffers', async () => {
    const store = DevDataStore.forTest(new MockIpcClient());

    await expect(
      store.save('test', new Uint8Array(Buffer.from('abc', 'ascii'))),
    ).resolves.toEqual({
      saved: true,
    });
    await expect(store.load('test')).resolves.toEqual({
      loaded: true,
      data: new Uint8Array(Buffer.from('abc', 'ascii')),
    });
  });

  it('should save and load buffers nested in objects', async () => {
    const store = DevDataStore.forTest(new MockIpcClient());

    await expect(
      store.save('test', {
        x: Buffer.from('x', 'ascii'),
        y: [Buffer.from('y', 'ascii')],
      }),
    ).resolves.toEqual({
      saved: true,
    });
    await expect(store.load('test')).resolves.toEqual({
      loaded: true,
      data: { x: Buffer.from('x', 'ascii'), y: [Buffer.from('y', 'ascii')] },
    });
  });
});
