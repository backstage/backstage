/*
 * Copyright 2026 The Backstage Authors
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
import { renderDefaultValue } from './renderDefaultValue';

describe('renderDefaultValue', () => {
  it('returns undefined for absent or blank expressions', () => {
    expect(renderDefaultValue(undefined, {})).toBeUndefined();
    expect(renderDefaultValue('', {})).toBeUndefined();
    expect(renderDefaultValue('   ', {})).toBeUndefined();
  });

  it('renders interpolated strings and preserves native value types', () => {
    const state = {
      sourceUrl: 'https://github.com/backstage/my-service',
      count: 0,
      enabled: false,
      tags: ['alpha', 'beta'],
      nested: { region: 'us-east-1' },
    };

    expect(
      renderDefaultValue(
        "github.com?owner=example-org&repo=${{ parameters.sourceUrl.split('/') | last }}",
        state,
      ),
    ).toBe('github.com?owner=example-org&repo=my-service');

    expect(renderDefaultValue('${{ parameters.count }}', state)).toBe(0);
    expect(renderDefaultValue('${{ parameters.enabled }}', state)).toBe(false);
    expect(renderDefaultValue('${{ "" }}', state)).toBe('');
    expect(renderDefaultValue('${{ null }}', state)).toBeNull();
    expect(
      renderDefaultValue('${{ parameters.missing }}', state),
    ).toBeUndefined();

    const tags = renderDefaultValue('${{ parameters.tags }}', state);
    expect(tags).toEqual(['alpha', 'beta']);
    expect(Object.isFrozen(tags)).toBe(false);

    const nested = renderDefaultValue('${{ parameters.nested }}', state);
    expect(nested).toEqual({ region: 'us-east-1' });
    expect(Object.isFrozen(nested)).toBe(false);

    expect(
      renderDefaultValue(
        "${{ true if parameters.nested.region == 'us-east-1' else false }}",
        state,
      ),
    ).toBe(true);
    expect(
      renderDefaultValue(
        "${{ 'yes' if parameters.enabled else undefined }}",
        state,
      ),
    ).toBeUndefined();
  });

  it('supports built-in Nunjitsu filters along with parseEntityRef and pick', () => {
    const state = {
      owner: 'group:default/team-a',
      shortOwner: 'team-b',
      config: { items: [{ name: 'first' }, { name: 'second' }] },
      title: 'My Service',
    };

    expect(
      renderDefaultValue(
        "${{ parameters.title | lower | replace(' ', '-') }}",
        state,
      ),
    ).toBe('my-service');
    expect(
      renderDefaultValue(
        "${{ parameters.owner | parseEntityRef | pick('name') }}",
        state,
      ),
    ).toBe('team-a');
    expect(
      renderDefaultValue(
        "${{ (parameters.shortOwner | parseEntityRef({ defaultKind: 'group', defaultNamespace: 'platform' })).namespace }}",
        state,
      ),
    ).toBe('platform');
    expect(
      renderDefaultValue(
        "${{ parameters.config | pick('items[1].name') }}",
        state,
      ),
    ).toBe('second');
    expect(
      renderDefaultValue(
        "${{ parameters.config | pick('constructor') }}",
        state,
      ),
    ).toBeUndefined();
    expect(
      renderDefaultValue(
        "${{ parameters.config | pick('__proto__.toString') }}",
        state,
      ),
    ).toBeUndefined();
  });

  it('returns undefined on evaluation errors, backend-only filters, and unsafe access without mutating inputs', () => {
    const state = {
      items: ['original'],
      repoUrl: 'github.com?owner=backstage&repo=backstage',
    };

    for (const expression of [
      '${{ invalid...syntax }}',
      "${{ parameters.sourceUrl.split('/') | last }}",
      '${{ parameters.repoUrl | parseRepoUrl }}',
      '${{ parameters.repoUrl | projectSlug }}',
      '${{ parameters.repoUrl | unknownFilter }}',
      '${{ parameters.constructor }}',
      '${{ parameters.__proto__ }}',
      '${{ unknownFunction() }}',
      '${{ 1 / 0 }}',
    ]) {
      expect(renderDefaultValue(expression, state)).toBeUndefined();
      expect(renderDefaultValue('${{ parameters.items | first }}', state)).toBe(
        'original',
      );
    }

    expect(
      renderDefaultValue('${{ parameters.items.push("temp") }}', state),
    ).toBe(2);
    expect(state.items).toEqual(['original']);
  });
});
