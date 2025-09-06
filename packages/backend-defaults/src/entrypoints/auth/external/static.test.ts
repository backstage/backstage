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
import { staticTokenHandler } from './static';

describe('StaticTokenHandler', () => {
  it('accepts any of the added list of tokens', async () => {
    const context1 = staticTokenHandler.initialize({
      options: new ConfigReader({
        token: 'abcabcabc',
        subject: 'one',
      }),
    });
    const context2 = staticTokenHandler.initialize({
      options: new ConfigReader({
        token: 'defdefdef',
        subject: 'two',
      }),
    });

    await expect(
      staticTokenHandler.verifyToken('abcabcabc', context1),
    ).resolves.toEqual({
      subject: 'one',
    });
    await expect(
      staticTokenHandler.verifyToken('defdefdef', context2),
    ).resolves.toEqual({
      subject: 'two',
    });
    await expect(
      staticTokenHandler.verifyToken('ghighighi', context1),
    ).resolves.toBeUndefined();
  });

  it('gracefully handles no added tokens', async () => {
    await expect(
      staticTokenHandler.verifyToken('ghi', {} as any),
    ).resolves.toBeUndefined();
  });

  it('rejects bad config', () => {
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({ _missingtoken: true, subject: 'ok' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'token' in 'mock-config'"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({ token: '', subject: 'ok' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'token' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'has spaces',
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be a set of non-space characters"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'hasnewlinebutislongenough\n',
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be a set of non-space characters"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'short',
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be at least 8 characters length"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({ token: 3, subject: 'ok' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'token' in 'mock-config', got number, wanted string"`,
    );

    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'validtoken',
          _missingsubject: true,
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'subject' in 'mock-config'"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'validtoken',
          subject: '',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'subject' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'validtoken',
          subject: 'has spaces',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'validtoken',
          subject: 'hasnewline\n',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      staticTokenHandler.initialize({
        options: new ConfigReader({
          token: 'validtoken',
          subject: 3,
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'subject' in 'mock-config', got number, wanted string"`,
    );
  });
});
