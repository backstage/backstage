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

import { createTemplateRenderer } from 'nunjitsu';
import { collectTemplateCapabilities } from '../../util/templating';

describe('Nunjitsu', () => {
  it('should render some templates', () => {
    const renderer = createTemplateRenderer();
    const context = renderer.prepareContext({ test: 'my-value' });
    expect(renderer.render('${{ test }}', context)).toBe('my-value');

    expect(renderer.render('${{ test | dump }}', context)).toBe('"my-value"');

    expect(
      renderer.render('${{ test | replace("my-", "our-") }}', context),
    ).toBe('our-value');

    expect(() => renderer.render('${{ invalid...syntax }}', context)).toThrow(
      /Expected name/,
    );
  });

  it('supports intrinsic methods', () => {
    const { render } = createTemplateRenderer();
    const context = {
      text: 'backstage',
      number: 12.345,
      array: ['catalog', 'scaffolder'],
      map: new Map([['plugin', 'scaffolder']]),
      set: new Set(['catalog', 'scaffolder']),
    };

    expect(render('${{ text.toUpperCase() }}', context)).toBe('BACKSTAGE');
    expect(render('${{ number.toFixed(2) }}', context)).toBe('12.35');
    expect(render('${{ array.includes("scaffolder") }}', context)).toBe('true');
    expect(render('${{ map.get("plugin") }}', context)).toBe('scaffolder');
    expect(render('${{ set.has("catalog") }}', context)).toBe('true');
  });

  it('preserves native values for sole interpolations', () => {
    const renderer = createTemplateRenderer();
    const context = renderer.prepareContext({
      value: { enabled: true, retries: 3 },
    });

    expect(renderer.renderValue('${{ value }}', context)).toEqual({
      enabled: true,
      retries: 3,
    });
    expect(renderer.renderValue('Value: ${{ value }}', context)).toBe(
      'Value: [object Object]',
    );
  });

  it('should make cookiecutter compatibility available when requested', () => {
    const { render: renderWith } = createTemplateRenderer({
      cookiecutterCompat: true,
    });
    const { render: renderWithout } = createTemplateRenderer();

    // Same two tests repeated to make sure switching back and forth works
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Unknown template filter "jsonify"/,
    );
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Unknown template filter "jsonify"/,
    );
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Unknown template filter "jsonify"/,
    );
    expect(() => renderWithout('${{ 1 | jsonify }}', {})).toThrow(
      /Unknown template filter "jsonify"/,
    );
    expect(renderWith('{{ 1 | jsonify }}', {})).toBe('1');
  });

  it('should make parseRepoUrl available when requested', () => {
    const parseRepoUrl = jest.fn(() => ({
      repo: 'my-repo',
      owner: 'my-owner',
      host: 'my-host.com',
    }));

    const projectSlug = jest.fn(() => 'my-owner/my-repo');

    const { render: renderWith } = createTemplateRenderer({
      ...collectTemplateCapabilities({
        filters: { parseRepoUrl, projectSlug },
      }),
    });
    const { render: renderWithout } = createTemplateRenderer();

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
    ).toThrow(/Unknown template filter "parseRepoUrl"/);
    expect(() => renderWithout('${{ repoUrl | projectSlug }}', ctx)).toThrow(
      /Unknown template filter "projectSlug"/,
    );

    expect(parseRepoUrl.mock.calls).toEqual([
      ['https://my-host.com/my-owner/my-repo'],
    ]);
  });

  it('should make additional filters available when requested', () => {
    const mockFilter1 = jest.fn(() => 'filtered text');
    const mockFilter2 = jest.fn((var1, var2) => `${var1} ${var2}`);
    const mockFilter3 = jest.fn((var1, var2) => ({ var1, var2 }));
    const mockFilter4 = jest.fn(() => undefined);
    const { render: renderWith } = createTemplateRenderer({
      ...collectTemplateCapabilities({
        filters: { mockFilter1, mockFilter2, mockFilter3, mockFilter4 },
      }),
    });
    const { render: renderWithout } = createTemplateRenderer();

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
    expect(renderWith('${{ inputValue | mockFilter4 }}', ctx)).toBe('');

    expect(() => renderWithout('${{ inputValue | mockFilter1 }}', ctx)).toThrow(
      /Unknown template filter "mockFilter1"/,
    );
    expect(() =>
      renderWithout('${{ inputValue | mockFilter2("extra arg") }}', ctx),
    ).toThrow(/Unknown template filter "mockFilter2"/);
    expect(() =>
      renderWithout('${{ inputValue | mockFilter3("extra arg") }}', ctx),
    ).toThrow(/Unknown template filter "mockFilter3"/);

    expect(mockFilter1.mock.calls).toEqual([['the input value']]);
    expect(mockFilter2.mock.calls).toEqual([['the input value', 'extra arg']]);
    expect(mockFilter3.mock.calls).toEqual([
      ['the input value', 'another extra arg'],
    ]);
  });
  it('should make additional globals available when requested', () => {
    const mockGlobal1 = jest.fn(() => 'awesome global function');
    const mockGlobal2 = 'foo';
    const mockGlobal3 = 123456;
    const mockGlobal4 = jest.fn(() => undefined);
    const { render: renderWith } = createTemplateRenderer({
      ...collectTemplateCapabilities({
        globals: { mockGlobal1, mockGlobal2, mockGlobal3, mockGlobal4 },
      }),
    });
    const { render: renderWithout } = createTemplateRenderer();

    const ctx = {};

    expect(renderWith('${{ mockGlobal1() }}', ctx)).toBe(
      'awesome global function',
    );
    expect(renderWith('${{ mockGlobal2 }}', ctx)).toBe('foo');
    expect(renderWith('${{ mockGlobal3 }}', ctx)).toBe('123456');
    expect(renderWith('${{ mockGlobal4() }}', ctx)).toBe('');

    expect(() => renderWithout('${{ mockGlobal1() }}', ctx)).toThrow(
      /resolved to undefined and cannot be called/,
    );
  });

  it('should not allow helpers to be rewritten', () => {
    const { render } = createTemplateRenderer({
      ...collectTemplateCapabilities({
        filters: {
          parseRepoUrl: () => ({
            repo: 'my-repo',
            owner: 'my-owner',
            host: 'my-host.com',
          }),
        },
      }),
    });

    const ctx = {
      repoUrl: 'https://my-host.com/my-owner/my-repo',
    };
    expect(() =>
      render(
        '${{ ({}).constructor.constructor("parseRepoUrl = () => JSON.stringify(`inject`)")() }}',
        ctx,
      ),
    ).toThrow(/Template name "constructor" is reserved/);

    expect(render('${{ repoUrl | parseRepoUrl | dump }}', ctx)).toBe(
      JSON.stringify({
        repo: 'my-repo',
        owner: 'my-owner',
        host: 'my-host.com',
      }),
    );
  });

  it('does not allow prototype pollution', () => {
    const { render } = createTemplateRenderer();

    const ctx = {
      x: 'foo',
    };
    expect(render('${{ x }}', ctx)).toBe('foo');
    expect(() =>
      render(
        '${{ ({}).constructor.constructor("Array.prototype.forEach = () => {}")() }}',
        ctx,
      ),
    ).toThrow(/Template name "constructor" is reserved/);
    expect(render('${{ x }}', ctx)).toBe('foo');
  });
});
