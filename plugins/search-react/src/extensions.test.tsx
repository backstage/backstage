/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListItemText from '@material-ui/core/ListItemText';

import {
  renderInTestApp,
  TestApiProvider,
  MockAnalyticsApi,
} from '@backstage/test-utils';
import {
  createPlugin,
  BackstagePlugin,
  analyticsApiRef,
} from '@backstage/core-plugin-api';
import { SearchResult, SearchDocument } from '@backstage/plugin-search-common';

import {
  SearchResultListItemExtensions,
  createSearchResultListItemExtension,
  SearchResultListItemExtensionOptions,
} from './extensions';

const analyticsApiMock = new MockAnalyticsApi();

const results = [
  {
    type: 'explore',
    document: {
      location: 'search/search-result1',
      title: 'Search Result 1',
      text: 'Some text from the search result 1',
    },
  },
  {
    type: 'techdocs',
    document: {
      location: 'search/search-result2',
      title: 'Search Result 2',
      text: 'Some text from the search result 2',
    },
  },
];

const createExtension = (
  plugin: BackstagePlugin,
  options: Partial<
    Omit<
      SearchResultListItemExtensionOptions<
        (props: { result?: SearchDocument }) => JSX.Element | null
      >,
      'name'
    >
  > = {},
) => {
  const {
    predicate,
    component = async () => (props: { result?: SearchDocument }) => (
      <>
        <ListItemText primary="Default" secondary={props.result?.title} />
      </>
    ),
  } = options;
  return plugin.provide(
    createSearchResultListItemExtension({
      predicate,
      component,
      name: 'TestSearchResultItemExtension',
    }),
  );
};

describe('extensions', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <SearchResultListItemExtensions results={results} />
      </TestApiProvider>,
    );

    expect(screen.getByText('Search Result 1')).toBeInTheDocument();
    expect(
      screen.getByText('Some text from the search result 1'),
    ).toBeInTheDocument();

    expect(screen.getByText('Search Result 2')).toBeInTheDocument();
    expect(
      screen.getByText('Some text from the search result 2'),
    ).toBeInTheDocument();
  });

  it('capture results discovery events', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <SearchResultListItemExtensions results={results} />
      </TestApiProvider>,
    );

    await userEvent.click(
      screen.getByRole('link', { name: /Search Result 1/ }),
    );

    expect(analyticsApiMock.getEvents()[0]).toMatchObject({
      action: 'discover',
      subject: 'Search Result 1',
      context: { routeRef: 'unknown', pluginId: 'root', extension: 'App' },
      attributes: { to: 'search/search-result1' },
    });
  });

  it('Could be used as simple components', async () => {
    const plugin = createPlugin({ id: 'plugin' });
    const DefaultSearchResultListItemExtension = createExtension(plugin);

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <DefaultSearchResultListItemExtension result={results[0].document} />
      </TestApiProvider>,
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Search Result 1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('listitem'));

    expect(analyticsApiMock.getEvents()[0]).toMatchObject({
      action: 'discover',
      subject: 'Search Result 1',
      context: { routeRef: 'unknown', pluginId: 'root', extension: 'App' },
      attributes: { to: 'search/search-result1' },
    });
  });

  it('use default options for rendering results', async () => {
    const plugin = createPlugin({ id: 'plugin' });
    const DefaultSearchResultListItemExtension = createExtension(plugin);

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <SearchResultListItemExtensions results={results}>
          <DefaultSearchResultListItemExtension />
        </SearchResultListItemExtensions>
      </TestApiProvider>,
    );

    expect(screen.getAllByText('Default')).toHaveLength(2);
    expect(screen.getByText('Search Result 1')).toBeInTheDocument();
    expect(screen.getByText('Search Result 2')).toBeInTheDocument();
  });

  it('use custom options for rendering results', async () => {
    const plugin = createPlugin({ id: 'plugin' });
    const DefaultSearchResultListItemExtension = createExtension(plugin);
    const ExploreSearchResultListItemExtension = createExtension(plugin, {
      predicate: (result: SearchResult) => result.type === 'explore',
      component: async () => (props: { result?: SearchDocument }) => (
        <>
          <ListItemText primary="Explore" secondary={props.result?.title} />
        </>
      ),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <SearchResultListItemExtensions results={results}>
          <ExploreSearchResultListItemExtension />
          <DefaultSearchResultListItemExtension />
        </SearchResultListItemExtensions>
      </TestApiProvider>,
    );

    expect(screen.getAllByText('Default')).toHaveLength(1);
    expect(screen.getAllByText('Explore')).toHaveLength(1);
    expect(screen.getByText('Search Result 1')).toBeInTheDocument();
    expect(screen.getByText('Search Result 2')).toBeInTheDocument();
  });
});
