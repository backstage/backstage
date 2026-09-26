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

import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useEntryReferrer } from './useEntryReferrer';

function mockNavigation(entries: { url: string }[], currentIndex: number) {
  Object.defineProperty(window, 'navigation', {
    value: {
      currentEntry: { url: entries[currentIndex]?.url, index: currentIndex },
      entries: () => entries.map((e, i) => ({ url: e.url, index: i })),
    },
    writable: true,
    configurable: true,
  });
}

function clearNavigation() {
  delete (window as any).navigation;
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useEntryReferrer', () => {
  afterEach(clearNavigation);

  it('returns the first entry outside the entity base path', () => {
    mockNavigation(
      [
        { url: 'http://localhost/ai-explorer?q=test' },
        { url: 'http://localhost/catalog/default/component/my-service' },
        { url: 'http://localhost/catalog/default/component/my-service/ci-cd' },
      ],
      2,
    );

    const { result } = renderHook(
      () => useEntryReferrer('/catalog/default/component/my-service'),
      { wrapper },
    );

    expect(result.current).toBe('/ai-explorer?q=test');
  });

  it('returns undefined when all previous entries are within the entity', () => {
    mockNavigation(
      [
        { url: 'http://localhost/catalog/default/component/my-service' },
        { url: 'http://localhost/catalog/default/component/my-service/docs' },
      ],
      1,
    );

    const { result } = renderHook(
      () => useEntryReferrer('/catalog/default/component/my-service'),
      { wrapper },
    );

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the Navigation API is unavailable', () => {
    clearNavigation();

    const { result } = renderHook(
      () => useEntryReferrer('/catalog/default/component/my-service'),
      { wrapper },
    );

    expect(result.current).toBeUndefined();
  });

  it('skips entity tab entries to find the real referrer', () => {
    mockNavigation(
      [
        { url: 'http://localhost/search?q=my+service' },
        { url: 'http://localhost/catalog/default/component/my-service' },
        { url: 'http://localhost/catalog/default/component/my-service/api' },
        { url: 'http://localhost/catalog/default/component/my-service/docs' },
        { url: 'http://localhost/catalog/default/component/my-service/ci-cd' },
      ],
      4,
    );

    const { result } = renderHook(
      () => useEntryReferrer('/catalog/default/component/my-service'),
      { wrapper },
    );

    expect(result.current).toBe('/search?q=my+service');
  });

  it('returns undefined when the entity page was opened directly', () => {
    mockNavigation(
      [{ url: 'http://localhost/catalog/default/component/my-service' }],
      0,
    );

    const { result } = renderHook(
      () => useEntryReferrer('/catalog/default/component/my-service'),
      { wrapper },
    );

    expect(result.current).toBeUndefined();
  });

  it('recalculates when the entity base path changes', () => {
    mockNavigation(
      [
        { url: 'http://localhost/ai-explorer' },
        { url: 'http://localhost/catalog/default/component/service-a' },
        { url: 'http://localhost/catalog/default/component/service-b' },
      ],
      2,
    );

    const { result, rerender } = renderHook(
      ({ basePath }) => useEntryReferrer(basePath),
      {
        wrapper,
        initialProps: {
          basePath: '/catalog/default/component/service-b',
        },
      },
    );

    expect(result.current).toBe('/catalog/default/component/service-a');

    rerender({ basePath: '/catalog/default/component/service-a' });

    expect(result.current).toBe('/ai-explorer');
  });
});
