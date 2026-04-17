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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { searchApiRef, MockSearchApi } from '@backstage/plugin-search-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { TechDocsReaderSearch } from './TechDocsReaderSearch';

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

describe('<TechDocsReaderSearch />', () => {
  it('should render the search input', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <TechDocsReaderSearch entityId={entityId} />
      </TestApiProvider>,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search docs' }),
    ).toBeInTheDocument();
  });

  it('should render search results when user types', async () => {
    const user = userEvent.setup();

    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <TechDocsReaderSearch entityId={entityId} />
      </TestApiProvider>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search docs' });
    await user.type(input, 'getting');

    expect(await screen.findByText('Getting Started')).toBeInTheDocument();
    expect(
      screen.getByText('This guide helps you get started.'),
    ).toBeInTheDocument();
  });
});
