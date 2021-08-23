/*
 * Copyright 2020 The Backstage Authors
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
import { selectionHandler, TechDocsSearch } from './TechDocsSearch';
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { searchApiRef } from '@backstage/plugin-search';

const entityId = {
  name: 'test',
  namespace: 'testspace',
  kind: 'Testable',
};

const emptyResults = Promise.resolve({
  results: [],
});
const singleResult = Promise.resolve({
  results: [
    {
      type: 'testsearchresult',
      document: {
        text: 'text',
        title: 'title',
        location: '/something/something',
      },
    },
  ],
});

describe('<TechDocsPage />', () => {
  it('should render techdocs search bar', async () => {
    const query = () => emptyResults;
    const querySpy = jest.fn(query);
    const searchApi = { query: querySpy };

    const apiRegistry = ApiRegistry.from([[searchApiRef, searchApi]]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsSearch entityId={entityId} />
          </ApiProvider>,
        ),
      );

      await emptyResults;
      expect(querySpy).toBeCalled();
      expect(rendered.getByTestId('techdocs-search-bar')).toBeInTheDocument();
    });
  });
  it('should trigger query when autocomplete input changed', async () => {
    const query = () => singleResult;
    const querySpy = jest.fn(query);
    const searchApi = { query: querySpy };

    const apiRegistry = ApiRegistry.from([[searchApiRef, searchApi]]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsSearch entityId={entityId} debounceTime={0} />
          </ApiProvider>,
        ),
      );

      await singleResult;
      expect(querySpy).toBeCalledWith({
        filters: {
          kind: 'Testable',
          name: 'test',
          namespace: 'testspace',
        },
        pageCursor: '',
        term: '',
        types: ['techdocs'],
      });

      const autocomplete = rendered.getByTestId('techdocs-search-bar');
      const input = within(autocomplete).getByRole('textbox');
      autocomplete.click();
      autocomplete.focus();
      fireEvent.change(input, { target: { value: 'asdf' } });

      await singleResult;
      await waitFor(() =>
        expect(querySpy).toBeCalledWith({
          filters: {
            kind: 'Testable',
            name: 'test',
            namespace: 'testspace',
          },
          pageCursor: '',
          term: 'asdf',
          types: ['techdocs'],
        }),
      );
    });
  });

  describe('search result selection navigation', () => {
    const techDocsResult = {
      type: 'testdoc',
      document: {
        namespace: 'testnamespace',
        kind: 'testkind',
        name: 'testname',
        path: 'testpath',
        location: 'testlocation',
        title: 'testtitle',
      },
    };
    it('should use location field for navigation in default context', async () => {
      const navFn = jest.fn();
      const selector = selectionHandler(navFn);
      selector(undefined, techDocsResult);
      expect(navFn).toBeCalledWith('testlocation');
    });
    it('should construct navigation target for entity page context', async () => {
      const navFn = jest.fn();
      const selector = selectionHandler(navFn, 'entitypage');
      selector('entitypage', techDocsResult);
      expect(navFn).toBeCalledWith(
        '/catalog/testnamespace/testkind/testname/docs/testpath',
      );
    });
  });
});
