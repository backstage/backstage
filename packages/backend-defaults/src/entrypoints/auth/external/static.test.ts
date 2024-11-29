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
    handler.add(
      new ConfigReader({
        options: { token: 'abcabcabc', subject: 'one' },
        accessRestrictions: [{ plugin: 'scaffolder' }],
      }),
    );
    handler.add(
      new ConfigReader({
        options: { token: 'defdefdef', subject: 'two' },
        accessRestrictions: [
          { plugin: 'catalog', permission: 'catalog.entity.read' },
        ],
      }),
    );
    const accessRestrictionsOne = new Map(Object.entries({ scaffolder: {} }));
    const accessRestrictionsTwo = new Map(
      Object.entries({
        catalog: {
          permissionNames: ['catalog.entity.read'],
        },
      }),
    );

    await expect(handler.verifyToken('abcabcabc')).resolves.toEqual({
      subject: 'one',
      allAccessRestrictions: accessRestrictionsOne,
    });
    await expect(handler.verifyToken('defdefdef')).resolves.toEqual({
      subject: 'two',
      allAccessRestrictions: accessRestrictionsTwo,
    });
    await expect(handler.verifyToken('ghighighi')).resolves.toBeUndefined();
  });

  it('gracefully handles no added tokens', async () => {
    const handler = new StaticTokenHandler();
    await expect(handler.verifyToken('ghi')).resolves.toBeUndefined();
  });

  it('rejects bad config', () => {
    const handler = new StaticTokenHandler();

    expect(() =>
      handler.add(
        new ConfigReader({ options: { _missingtoken: true, subject: 'ok' } }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'options.token' in 'mock-config'"`,
    );
    expect(() =>
      handler.add(new ConfigReader({ options: { token: '', subject: 'ok' } })),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'options.token' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({ options: { token: 'has spaces', subject: 'ok' } }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({
          options: {
            token: 'hasnewlinebutislongenough\n',
            subject: 'ok',
          },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({ options: { token: 'short', subject: 'ok' } }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal token, must be at least 8 characters length"`,
    );
    expect(() =>
      handler.add(new ConfigReader({ options: { token: 3, subject: 'ok' } })),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'options.token' in 'mock-config', got number, wanted string"`,
    );

    expect(() =>
      handler.add(
        new ConfigReader({
          options: { token: 'validtoken', _missingsubject: true },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'options.subject' in 'mock-config'"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({ options: { token: 'validtoken', subject: '' } }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'options.subject' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({
          options: { token: 'validtoken', subject: 'has spaces' },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({
          options: { token: 'validtoken', subject: 'hasnewline\n' },
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.add(
        new ConfigReader({ options: { token: 'validtoken', subject: 3 } }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'options.subject' in 'mock-config', got number, wanted string"`,
    );
  });
});
