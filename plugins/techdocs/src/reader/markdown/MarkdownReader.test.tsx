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

import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
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
jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useTechDocsReaderPage: () => ({
    entityRef: { namespace: 'default', kind: 'component', name: 'test' },
    setTitle,
  }),
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
async function renderReader(
  policy: string | undefined,
  publication: unknown = manifest,
  preview = '',
) {
  const fetch = jest.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    if (url.endsWith('manifest.json'))
      return {
        status: publication === undefined ? 404 : 200,
        ok: true,
        headers: new Headers(),
        text: async () => JSON.stringify(publication),
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
            getBuilder: async () => 'external',
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
