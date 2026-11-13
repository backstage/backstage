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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ALL_RELATIONS } from '../../lib/types';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';

function GraphContext(props: PropsWithChildren<{}>) {
  return (
    <ApiProvider
      apis={TestApiRegistry.from([
        catalogGraphApiRef,
        new DefaultCatalogGraphApi(),
      ])}
    >
      {props.children}
    </ApiProvider>
  );
}

describe('<SelectedRelationsFilter/>', () => {
  test('should render current value and select another relation', async () => {
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

    const trigger = screen.getByRole('button', { name: /Relations/ });
    expect(trigger).toHaveTextContent(RELATION_OWNED_BY);
    expect(trigger).toHaveTextContent(RELATION_CHILD_OF);

    await userEvent.click(trigger);
    await userEvent.click(
      await screen.findByRole('option', { name: RELATION_HAS_MEMBER }),
    );

    expect(onChange).toHaveBeenCalledWith([
      RELATION_OWNED_BY,
      RELATION_CHILD_OF,
      RELATION_HAS_MEMBER,
    ]);
  });

  test('should return undefined when the last relation is deselected', async () => {
    const onChange = jest.fn();
    await renderInTestApp(
      <GraphContext>
        <SelectedRelationsFilter
          relations={ALL_RELATIONS}
          value={[RELATION_OWNED_BY]}
          onChange={onChange}
        />
      </GraphContext>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Relations/ }));
    await userEvent.click(
      await screen.findByRole('option', { name: RELATION_OWNED_BY }),
    );

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
