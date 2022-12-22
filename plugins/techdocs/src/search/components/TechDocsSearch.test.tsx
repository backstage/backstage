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
import { ApiProvider } from '@backstage/core-app-api';
import { searchApiRef } from '@backstage/plugin-search-react';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';
import Button from '@material-ui/core/Button';
import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import React, { useState } from 'react';
import { TechDocsSearch } from './TechDocsSearch';

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

describe('<TechDocsSearch />', () => {
  it('should render techdocs search bar', async () => {
    const query = () => emptyResults;
    const querySpy = jest.fn(query);
    const searchApi = { query: querySpy };

    const apiRegistry = TestApiRegistry.from([searchApiRef, searchApi]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsSearch entityId={entityId} />
          </ApiProvider>,
        ),
      );

      await emptyResults;
      expect(querySpy).toHaveBeenCalled();
      expect(rendered.getByTestId('techdocs-search-bar')).toBeInTheDocument();
    });
  });

  it('should trigger query when autocomplete input changed', async () => {
    const query = () => singleResult;
    const querySpy = jest.fn(query);
    const searchApi = { query: querySpy };

    const apiRegistry = TestApiRegistry.from([searchApiRef, searchApi]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsSearch entityId={entityId} debounceTime={0} />
          </ApiProvider>,
        ),
      );

      await singleResult;
      expect(querySpy).toHaveBeenCalledWith({
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
        expect(querySpy).toHaveBeenCalledWith({
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

  it('should update filter values when a new entityName is provided', async () => {
    const query = () => singleResult;
    const querySpy = jest.fn(query);
    const searchApi = { query: querySpy };
    const apiRegistry = TestApiRegistry.from([searchApiRef, searchApi]);
    const newEntityId = {
      name: 'test-diff',
      namespace: 'testspace-diff',
      kind: 'TestableDiff',
    };

    const WrappedSearchBar = () => {
      const [entityName, setEntityName] = useState(entityId);
      return wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <Button onClick={() => setEntityName(newEntityId)}>
            Update Entity
          </Button>
          <TechDocsSearch entityId={entityName} debounceTime={0} />
        </ApiProvider>,
      );
    };

    await act(async () => {
      const rendered = render(<WrappedSearchBar />);

      await singleResult;
      expect(querySpy).toHaveBeenCalledWith({
        filters: {
          kind: 'Testable',
          name: 'test',
          namespace: 'testspace',
        },
        pageCursor: '',
        term: '',
        types: ['techdocs'],
      });

      const button = rendered.getByText('Update Entity');
      button.click();

      await singleResult;
      await waitFor(() =>
        expect(querySpy).toHaveBeenCalledWith({
          filters: {
            kind: 'TestableDiff',
            name: 'test-diff',
            namespace: 'testspace-diff',
          },
          pageCursor: '',
          term: '',
          types: ['techdocs'],
        }),
      );
    });
  });
});
