/*
 * Copyright 2021 The Backstage Authors
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

import { SecureTemplater } from './SecureTemplater';

describe('SecureTemplater', () => {
  it('should render some templates', async () => {
    const templater = new SecureTemplater();
    await templater.initializeIfNeeded();
    expect(templater.render('${{ test }}', { test: 'my-value' })).toBe(
      'my-value',
    );

    expect(templater.render('${{ test | dump }}', { test: 'my-value' })).toBe(
      '"my-value"',
    );

    expect(
      templater.render('${{ test | replace("my-", "our-") }}', {
        test: 'my-value',
      }),
    ).toBe('our-value');

    expect(() =>
      templater.render('${{ invalid...syntax }}', {
        test: 'my-value',
      }),
    ).toThrow(
      '(unknown path) [Line 1, Column 13]\n  expected name as lookup value, got .',
    );
  });

  it('should make jsonify available when requested', async () => {
    const templaterWith = new SecureTemplater({ jsonify: true });
    await templaterWith.initializeIfNeeded();
    const templaterWithout = new SecureTemplater();
    await templaterWithout.initializeIfNeeded();

    expect(templaterWith.render('${{ 1 | jsonify }}', {})).toBe('1');
    expect(() => templaterWithout.render('${{ 1 | jsonify }}', {})).toThrow(
      '(unknown path)\n  Error: filter not found: jsonify',
    );
  });

  it('should make parseRepoUrl available when requested', async () => {
    const parseRepoUrl = jest.fn(() => ({
      repo: 'my-repo',
      owner: 'my-owner',
      host: 'my-host.com',
    }));
    const templaterWith = new SecureTemplater({ parseRepoUrl });
    await templaterWith.initializeIfNeeded();
    const templaterWithout = new SecureTemplater();
    await templaterWithout.initializeIfNeeded();

    const ctx = {
      repoUrl: 'https://my-host.com/my-owner/my-repo',
    };

    expect(
      templaterWith.render('${{ repoUrl | parseRepoUrl | dump }}', ctx),
    ).toBe(
      JSON.stringify({
        repo: 'my-repo',
        owner: 'my-owner',
        host: 'my-host.com',
      }),
    );
    expect(templaterWith.render('${{ repoUrl | projectSlug }}', ctx)).toBe(
      'my-owner/my-repo',
    );
    expect(() =>
      templaterWithout.render('${{ repoUrl | parseRepoUrl | dump }}', ctx),
    ).toThrow('(unknown path)\n  Error: filter not found: parseRepoUrl');
    expect(() =>
      templaterWithout.render('${{ repoUrl | projectSlug }}', ctx),
    ).toThrow('(unknown path)\n  Error: filter not found: projectSlug');

    expect(parseRepoUrl.mock.calls).toEqual([
      ['https://my-host.com/my-owner/my-repo'],
      ['https://my-host.com/my-owner/my-repo'],
    ]);
  });
});
