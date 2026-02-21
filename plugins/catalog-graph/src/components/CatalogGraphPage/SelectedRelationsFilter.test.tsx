/*
 * Copyright 2021 The Backstage Authors
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

import { PropsWithChildren } from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import {
  RELATION_CHILD_OF,
  RELATION_HAS_MEMBER,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ALL_RELATIONS } from '../../lib/types';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import {
  mockApis,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

function GraphContext(props: PropsWithChildren<{}>) {
  const fetchApi: typeof fetchApiRef.T = {} as any;
  return (
    <ApiProvider
      apis={TestApiRegistry.from(
        [
          catalogGraphApiRef,
          new DefaultCatalogGraphApi({
            config: mockApis.config(),
            discoveryApi: mockApis.discovery(),
            fetchApi,
          }),
        ],
        [discoveryApiRef, mockApis.discovery()],
        [fetchApiRef, fetchApi],
      )}
    >
      {props.children}
    </ApiProvider>
  );
}

describe('<SelectedRelationsFilter/>', () => {
  test('should render current value', async () => {
    await renderInTestApp(
      <GraphContext>
        <SelectedRelationsFilter
          relations={ALL_RELATIONS}
          value={[RELATION_OWNED_BY, RELATION_CHILD_OF]}
          onChange={() => {}}
        />
      </GraphContext>,
    );

    expect(screen.getByText(RELATION_OWNED_BY)).toBeInTheDocument();
    expect(screen.getByText(RELATION_CHILD_OF)).toBeInTheDocument();
  });

  test('should select value', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <GraphContext>
        <SelectedRelationsFilter
          relations={ALL_RELATIONS}
          value={[RELATION_OWNED_BY, RELATION_CHILD_OF]}
          onChange={onChange}
        />
      </GraphContext>,
    );

    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText(RELATION_HAS_MEMBER)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText(RELATION_HAS_MEMBER));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([
        RELATION_OWNED_BY,
        RELATION_CHILD_OF,
        RELATION_HAS_MEMBER,
      ]);
    });
  });

  test('should return all known relations if all values are selected', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <GraphContext>
        <SelectedRelationsFilter
          relations={ALL_RELATIONS}
          value={ALL_RELATIONS.filter(r => r !== RELATION_HAS_MEMBER)}
          onChange={onChange}
        />
      </GraphContext>,
    );

    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText(RELATION_HAS_MEMBER)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText(RELATION_HAS_MEMBER));

    await waitFor(() => {
      // Same as ALL_RELATIONS but with RELATION_HAS_MEMBER at the end
      const allRelationsOrdered = [
        ...ALL_RELATIONS.filter(rel => rel !== RELATION_HAS_MEMBER),
        RELATION_HAS_MEMBER,
      ];

      expect(onChange).toHaveBeenCalledWith(allRelationsOrdered);
    });
  });

  test('should return all values when cleared', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <GraphContext>
        <SelectedRelationsFilter
          relations={ALL_RELATIONS}
          value={[]}
          onChange={onChange}
        />
      </GraphContext>,
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.tab();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
