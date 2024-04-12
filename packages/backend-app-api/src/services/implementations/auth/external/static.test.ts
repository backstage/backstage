/*
 * Copyright 2024 The Backstage Authors
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
import { StaticTokenHandler } from './static';

describe('StaticTokenHandler', () => {
  it('accepts any of the added list of tokens', async () => {
    const handler = new StaticTokenHandler();
    handler.add(new ConfigReader({ token: 'abc', subject: 'one' }));
    handler.add(new ConfigReader({ token: 'def', subject: 'two' }));

    await expect(handler.verifyToken('abc')).resolves.toEqual({
      subject: 'one',
      token: 'abc',
    });
    await expect(handler.verifyToken('def')).resolves.toEqual({
      subject: 'two',
      token: 'def',
    });
    await expect(handler.verifyToken('ghi')).resolves.toBeUndefined();
  });

  it('gracefully handles no added tokens', async () => {
    const handler = new StaticTokenHandler();
    await expect(handler.verifyToken('ghi')).resolves.toBeUndefined();
  });

  it('rejects bad config', () => {
    const handler = new StaticTokenHandler();

    expect(() =>
      handler.add(new ConfigReader({ _missingtoken: true, subject: 'ok' })),
    ).toThrow(/token/);
    expect(() =>
      handler.add(new ConfigReader({ token: '', subject: 'ok' })),
    ).toThrow(/token/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'has spaces', subject: 'ok' })),
    ).toThrow(/token/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'hasnewline\n', subject: 'ok' })),
    ).toThrow(/token/);
    expect(() =>
      handler.add(new ConfigReader({ token: 3, subject: 'ok' })),
    ).toThrow(/token/);

    expect(() =>
      handler.add(new ConfigReader({ token: 'ok', _missingsubject: true })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'ok', subject: '' })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'ok', subject: 'has spaces' })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'ok', subject: 'hasnewline\n' })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ token: 'ok', subject: 3 })),
    ).toThrow(/subject/);
  });
});
