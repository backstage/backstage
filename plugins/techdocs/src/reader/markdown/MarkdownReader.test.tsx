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

import { fireEvent, screen, within } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  TestApiProvider,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import { configApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { techdocsStorageApiRef } from '@backstage/plugin-techdocs-react';
import { TechDocsSourceManifest } from '@backstage/plugin-techdocs-common/alpha';
import {
  techdocsMarkdownAddonsApiRef,
  useTechDocsDocument,
  useTechDocsSelection,
} from '@backstage/plugin-techdocs-react/alpha';
import { MarkdownReaderGate } from './MarkdownReaderGate';

const setTitle = jest.fn();
let mockEntityName = 'test';
const mockSync = jest.fn(async () => 'updated' as const);
jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useTechDocsReaderPage: () => {
    jest.requireActual('react-router-dom').useLocation();
    return {
      entityRef: {
        namespace: 'default',
        kind: 'component',
        name: mockEntityName,
      },
      setTitle,
    };
  },
}));
const file = `_techdocs/source/files/${'a'.repeat(64)}.json`;
const manifest: TechDocsSourceManifest = {
  version: 1,
  available: true,
  optedIn: false,
  legacy: true,
  title: 'Test',
  pages: [{ path: 'index.md', route: '', title: 'Home', file }],
  assets: [],
  nav: [{ title: 'Home', path: 'index.md' }],
  diagnostics: [],
};
function Addon() {
  const doc = useTechDocsDocument();
  const selection = useTechDocsSelection();
  return (
    <p>
      Addon: {doc.path} {selection.text}
    </p>
  );
}
function RouteState() {
  const { pathname, search, hash } = useLocation();
  return (
    <p>
      Route: {pathname}
      {search}
      {hash}
    </p>
  );
}
async function renderReader(
  policy: string | undefined,
  publication: unknown = manifest,
  preview = '',
  artifact?: (url: string) => Response | undefined,
  builder = 'external',
) {
  const fetch = jest.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    const override = artifact?.(url);
    if (override) return override;
    if (url.endsWith('manifest.json'))
      return {
        status: publication === undefined ? 404 : 200,
        ok: true,
        headers: new Headers(),
        text: async () =>
          JSON.stringify(
            typeof publication === 'function' ? publication() : publication,
          ),
      } as Response;
    return {
      status: 200,
      ok: true,
      headers: new Headers(),
      text: async () =>
        JSON.stringify({
          markdown:
            '# Home\n\n[Home](index.md)\n\n<details><summary>More</summary>Allowed HTML</details>\n\n<script>bad()</script><img src="javascript:bad()" onerror="bad()">',
        }),
    } as Response;
  });
  await renderInTestApp(
    <TestApiProvider
      apis={[
        [
          configApiRef,
          mockApis.config({
            data: policy
              ? { techdocs: { migration: { rendering: policy } } }
              : {},
          }),
        ],
        [fetchApiRef, { fetch }],
        [
          techdocsStorageApiRef,
          {
            getStorageUrl: async () => 'https://example.test/static/docs',
            getBuilder: async () => builder,
            syncEntityDocs: mockSync,
          },
        ],
        [
          techdocsMarkdownAddonsApiRef,
          {
            getAddons: () => [
              {
                slots: [
                  { location: 'after-content' as const, component: Addon },
                ],
              },
            ],
          },
        ],
      ]}
    >
      <RouteState />
      <Routes>
        <Route
          path="/docs/*"
          element={
            <MarkdownReaderGate>
              <p>Legacy reader</p>
            </MarkdownReaderGate>
          }
        />
      </Routes>
    </TestApiProvider>,
    { routeEntries: [`/docs/${preview}`] },
  );
  return fetch;
}
describe('Markdown reader migration', () => {
  beforeEach(() => {
    mockEntityName = 'test';
    mockSync.mockClear();
  });
  it('keeps the default reader inert and allows URL-backed preview in configured legacy mode', async () => {
    const fetch = await renderReader(undefined);
    expect(await screen.findByText('Legacy reader')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('switches between publications, renders sanitized HTML and exposes structured addon data', async () => {
    await renderReader('legacy');
    expect(await screen.findByText('Legacy reader')).toBeInTheDocument();
    fireEvent.change(await screen.findByLabelText('Documentation preview'), {
      target: { value: 'source' },
    });
    expect(
      await screen.findByRole('heading', { name: 'Home' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Addon: index.md')).toBeInTheDocument();
    expect(screen.getByText('Allowed HTML')).toBeInTheDocument();
    expect(
      document.querySelector('article script, article [onerror]'),
    ).toBeNull();
    expect(
      screen.getByRole('navigation', { name: 'On this page' }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Documentation preview'), {
      target: { value: 'legacy' },
    });
    expect(await screen.findByText('Legacy reader')).toBeInTheDocument();
  });
  it('preserves encoded paths and renderer-independent TOC anchors', async () => {
    const published = {
      ...manifest,
      pages: [
        ...manifest.pages,
        {
          path: 'my page/中文.md',
          route: 'my page/中文/',
          title: 'Encoded',
          file,
        },
      ],
    };
    await renderReader(
      'prefer-source',
      published,
      'my%20page/%E4%B8%AD%E6%96%87/?techdocs-preview=source',
    );
    expect(
      await screen.findByText('Addon: my page/中文.md'),
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByRole('navigation', { name: 'Documentation navigation' }),
      ).getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', '/docs/?techdocs-preview=source');
    const toc = within(
      screen.getByRole('navigation', { name: 'On this page' }),
    ).getByRole('link', { name: 'Home' });
    expect(toc).toHaveAttribute(
      'href',
      '/docs/my%20page/%E4%B8%AD%E6%96%87/?techdocs-preview=source#home',
    );
    Element.prototype.scrollIntoView = jest.fn();
    fireEvent.click(toc);
    fireEvent.change(screen.getByLabelText('Documentation preview'), {
      target: { value: 'legacy' },
    });
    expect(await screen.findByText('Legacy reader')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Route: /docs/my%20page/%E4%B8%AD%E6%96%87/?techdocs-preview=legacy#home',
      ),
    ).toBeInTheDocument();
  });
  it('refreshes a stale manifest once when an artifact disappears', async () => {
    const stale = `_techdocs/source/files/${'b'.repeat(64)}.json`;
    let latest = {
      ...manifest,
      pages: [
        ...manifest.pages,
        { path: 'next.md', route: 'next/', title: 'Next', file: stale },
      ],
      nav: [{ title: 'Next', path: 'next.md' }],
    };
    const fetch = await renderReader(
      'prefer-source',
      () => latest,
      '',
      url =>
        url.endsWith(stale)
          ? ({
              status: 404,
              statusText: 'Not Found',
              ok: false,
              headers: new Headers(),
              text: async () => '',
            } as Response)
          : undefined,
      'local',
    );
    expect(await screen.findByText('Addon: index.md')).toBeInTheDocument();
    latest = {
      ...latest,
      pages: latest.pages.map(page => ({ ...page, file })),
    };
    fireEvent.click(screen.getByRole('link', { name: 'Next' }));
    expect(await screen.findByText('Addon: next.md')).toBeInTheDocument();
    expect(
      fetch.mock.calls.filter(([url]) => String(url).endsWith('manifest.json')),
    ).toHaveLength(2);
    expect(mockSync).toHaveBeenCalledTimes(1);
    mockEntityName = 'unbuilt';
    fireEvent.change(screen.getByLabelText('Documentation preview'), {
      target: { value: 'source' },
    });
    expect(await screen.findByText('Addon: next.md')).toBeInTheDocument();
    expect(mockSync).toHaveBeenLastCalledWith({
      namespace: 'default',
      kind: 'component',
      name: 'unbuilt',
    });
    expect(mockSync).toHaveBeenCalledTimes(2);
  });
  it('requires source in strict mode and never honors a legacy preview override', async () => {
    await renderReader('source', manifest, '?techdocs-preview=legacy');
    expect(
      await screen.findByRole('heading', { name: 'Home' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Documentation preview'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Legacy reader')).not.toBeInTheDocument();
  });
  it('surfaces unsupported source versions rather than silently falling back', async () => {
    await renderReader('prefer-source', { ...manifest, version: 99 });
    expect(
      (await screen.findAllByText(/Invalid input/)).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('Legacy reader')).not.toBeInTheDocument();
  });
});
