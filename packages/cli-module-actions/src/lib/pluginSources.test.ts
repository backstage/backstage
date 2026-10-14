/*
 * Copyright 2025 The Backstage Authors
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

import { mergePluginSources } from './pluginSources';

describe('mergePluginSources', () => {
  it('returns server sources when no local overrides exist', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog', 'scaffolder'],
        localAdditions: [],
        localExclusions: [],
      }),
    ).toEqual(['catalog', 'scaffolder']);
  });

  it('merges local additions with server sources', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog', 'scaffolder'],
        localAdditions: ['auth'],
        localExclusions: [],
      }),
    ).toEqual(['catalog', 'scaffolder', 'auth']);
  });

  it('deduplicates when local additions overlap with server sources', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog', 'scaffolder'],
        localAdditions: ['catalog', 'auth'],
        localExclusions: [],
      }),
    ).toEqual(['catalog', 'scaffolder', 'auth']);
  });

  it('excludes sources from the merged set', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog', 'scaffolder', 'search'],
        localAdditions: [],
        localExclusions: ['catalog'],
      }),
    ).toEqual(['scaffolder', 'search']);
  });

  it('handles additions and exclusions together', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog', 'scaffolder'],
        localAdditions: ['auth'],
        localExclusions: ['scaffolder'],
      }),
    ).toEqual(['catalog', 'auth']);
  });

  it('returns empty when all sources are excluded', () => {
    expect(
      mergePluginSources({
        serverSources: ['catalog'],
        localAdditions: [],
        localExclusions: ['catalog'],
      }),
    ).toEqual([]);
  });

  it('returns empty when no sources exist at all', () => {
    expect(
      mergePluginSources({
        serverSources: [],
        localAdditions: [],
        localExclusions: [],
      }),
    ).toEqual([]);
  });
});
