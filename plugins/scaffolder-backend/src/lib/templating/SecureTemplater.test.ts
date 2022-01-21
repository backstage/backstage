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
    const render = await SecureTemplater.loadRenderer();
    expect(render('${{ test }}', { test: 'my-value' })).toBe('my-value');

    expect(render('${{ test | dump }}', { test: 'my-value' })).toBe(
      '"my-value"',
    );

    expect(
      render('${{ test | replace("my-", "our-") }}', {
        test: 'my-value',
      }),
    ).toBe('our-value');

    expect(() =>
      render('${{ invalid...syntax }}', {
        test: 'my-value',
      }),
    ).toThrow(/expected name as lookup value, got ./);
  });

  it('should make cookiecutter compatibility available when requested', async () => {
    const renderWith = await SecureTemplater.loadRenderer({
      cookiecutterCompat: true,
    });
    const renderWithout = await SecureTemplater.loadRenderer();

    // Same two tests repeated to make sure switching back and forth works
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Error: filter not found: jsonify/,
    );
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Error: filter not found: jsonify/,
    );
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Error: filter not found: jsonify/,
    );
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Error: filter not found: jsonify/,
    );
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
  });

  it('should make parseRepoUrl available when requested', async () => {
    const parseRepoUrl = jest.fn(() => ({
      repo: 'my-repo',
      owner: 'my-owner',
      host: 'my-host.com',
    }));
    const renderWith = await SecureTemplater.loadRenderer({ parseRepoUrl });
    const renderWithout = await SecureTemplater.loadRenderer();

    const ctx = {
      repoUrl: 'https://my-host.com/my-owner/my-repo',
    };

    expect(renderWith('${{ repoUrl | parseRepoUrl | dump }}', ctx)).toBe(
      JSON.stringify({
        repo: 'my-repo',
        owner: 'my-owner',
        host: 'my-host.com',
      }),
    );
    expect(renderWith('${{ repoUrl | projectSlug }}', ctx)).toBe(
      'my-owner/my-repo',
    );
    expect(() =>
      renderWithout('${{ repoUrl | parseRepoUrl | dump }}', ctx),
    ).toThrow(/Error: filter not found: parseRepoUrl/);
    expect(() => renderWithout('${{ repoUrl | projectSlug }}', ctx)).toThrow(
      /Error: filter not found: projectSlug/,
    );

    expect(parseRepoUrl.mock.calls).toEqual([
      ['https://my-host.com/my-owner/my-repo'],
      ['https://my-host.com/my-owner/my-repo'],
    ]);
  });

  it('should make additional filters available when requested', async () => {
    const mockFilter1 = jest.fn(() => 'filtered text');
    const mockFilter2 = jest.fn((var1, var2) => `${var1} ${var2}`);
    const mockFilter3 = jest.fn((var1, var2) => ({ var1, var2 }));
    const renderWith = await SecureTemplater.loadRenderer({
      additionalTemplateFilters: { mockFilter1, mockFilter2, mockFilter3 },
    });
    const renderWithout = await SecureTemplater.loadRenderer();

    const ctx = { inputValue: 'the input value' };

    expect(renderWith('${{ inputValue | mockFilter1 }}', ctx)).toBe(
      'filtered text',
    );
    expect(
      renderWith('${{ inputValue | mockFilter2("extra arg") }}', ctx),
    ).toBe('the input value extra arg');
    expect(
      renderWith(
        '${{ inputValue | mockFilter3("another extra arg") | dump }}',
        ctx,
      ),
    ).toBe(
      JSON.stringify({
        var1: 'the input value',
        var2: 'another extra arg',
      }),
    );

    expect(() => renderWithout('${{ inputValue | mockFilter1 }}', ctx)).toThrow(
      /Error: filter not found: mockFilter1/,
    );
    expect(() =>
      renderWithout('${{ inputValue | mockFilter2("extra arg") }}', ctx),
    ).toThrow(/Error: filter not found: mockFilter2/);
    expect(() =>
      renderWithout('${{ inputValue | mockFilter3("extra arg") }}', ctx),
    ).toThrow(/Error: filter not found: mockFilter3/);

    expect(mockFilter1.mock.calls).toEqual([['the input value']]);
    expect(mockFilter2.mock.calls).toEqual([['the input value', 'extra arg']]);
    expect(mockFilter3.mock.calls).toEqual([
      ['the input value', 'another extra arg'],
    ]);
  });

  it('should not allow helpers to be rewritten', async () => {
    const render = await SecureTemplater.loadRenderer({
      parseRepoUrl: () => ({
        repo: 'my-repo',
        owner: 'my-owner',
        host: 'my-host.com',
      }),
    });

    const ctx = {
      repoUrl: 'https://my-host.com/my-owner/my-repo',
    };
    expect(
      render(
        '${{ ({}).constructor.constructor("parseRepoUrl = () => JSON.stringify(`inject`)")() }}',
        ctx,
      ),
    ).toBe('');

    expect(render('${{ repoUrl | parseRepoUrl | dump }}', ctx)).toBe(
      JSON.stringify({
        repo: 'my-repo',
        owner: 'my-owner',
        host: 'my-host.com',
      }),
    );
  });

  it('allows pollution during a single template execution', async () => {
    const render = await SecureTemplater.loadRenderer();

    const ctx = {
      x: 'foo',
    };
    expect(render('${{ x }}', ctx)).toBe('foo');
    expect(
      render(
        '${{ ({}).constructor.constructor("Array.prototype.forEach = () => {}")() }}',
        ctx,
      ),
    ).toBe('');
    expect(() => render('${{ x }}', ctx)).toThrow();
  });
});
