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
import { ReactNode, useState, useEffect } from 'react';
import { waitFor, screen } from '@testing-library/react';

import {
  searchApiRef,
  MockSearchApi,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { useTechDocsSearch } from './useTechDocsSearch';

const entityId = {
  kind: 'Component',
  name: 'test-component',
  namespace: 'default',
};

const mockSearchApi = new MockSearchApi({
  results: [
    {
      type: 'techdocs',
      document: {
        location: '/docs/default/component/test-component/getting-started',
        title: 'Getting Started',
        text: 'This guide helps you get started.',
      },
    },
  ],
});

function HookRenderer() {
  const data = useTechDocsSearch(entityId);
  const [, setRender] = useState(0);
  useEffect(() => setRender(r => r + 1), [data.results.length, data.loading]);
  return (
    <div>
      <span data-testid="resultCount">{data.results.length}</span>
      <span data-testid="loading">{String(data.loading)}</span>
      <span data-testid="deferredLoading">{String(data.deferredLoading)}</span>
      <span data-testid="term">{data.term}</span>
      {data.results.map((r, i) => (
        <span key={i} data-testid={`result-${i}`}>
          {r.document.title}
        </span>
      ))}
    </div>
  );
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
    <SearchContextProvider
      initialState={{
        term: '',
        types: ['techdocs'],
        pageCursor: '',
        filters: entityId,
      }}
    >
      {children}
    </SearchContextProvider>
  </TestApiProvider>
);

describe('useTechDocsSearch', () => {
  it('should return search results', async () => {
    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('resultCount')).toHaveTextContent('1');
    });

    expect(screen.getByTestId('result-0')).toHaveTextContent('Getting Started');
  });

  it('should not show deferred loading initially', async () => {
    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    expect(screen.getByTestId('deferredLoading')).toHaveTextContent('false');
  });
});
