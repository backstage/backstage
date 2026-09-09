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

import { useState } from 'react';
import {
  act,
  fireEvent,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  EntitySelectionPicker,
  EntitySelectionPickerProps,
} from './EntitySelectionPicker';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: { name: 'freben', title: 'Fredrik Adelöw' },
};
const entities = Array.from(
  { length: 45 },
  (_, index): Entity => ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: { name: `person-${String(index).padStart(2, '0')}` },
  }),
);

describe('EntitySelectionPicker', () => {
  async function setup(
    props: Partial<EntitySelectionPickerProps> = {},
    items = [entity, ...entities],
  ) {
    const catalogApi = catalogApiMock({ entities: items });
    const getEntitiesByRefs = jest.spyOn(catalogApi, 'getEntitiesByRefs');
    const onChange = jest.fn();
    function Picker() {
      const [value, setValue] = useState(props.value ?? []);
      return (
        <EntitySelectionPicker
          label="Owners"
          defaultKind="User"
          {...props}
          value={value}
          onChange={next => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <Picker />
      </TestApiProvider>,
    );
    return { onChange, getEntitiesByRefs };
  }

  it.each(['mui', 'bui'] as const)(
    'separates selection from search and does not commit dismissed input (%s)',
    async theme => {
      const { onChange } = await setup({
        theme,
        value: ['user:default/freben'],
      });
      expect(
        await screen.findByRole('button', { name: 'Change Fredrik Adelöw' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Choose Owners' }),
      );
      const search = screen.getByRole('searchbox');
      await userEvent.type(search, 'someone else');
      await userEvent.keyboard('{Escape}');
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: 'Choose Owners' }),
        ).toHaveFocus(),
      );

      await userEvent.click(
        screen.getByRole('button', { name: 'Change Fredrik Adelöw' }),
      );
      expect(screen.getByRole('searchbox')).toHaveValue('');
      await userEvent.type(screen.getByRole('searchbox'), 'person-30');
      await userEvent.click(
        await screen.findByRole('option', { name: /person-30/ }),
      );
      expect(onChange).toHaveBeenLastCalledWith(['user:default/person-30']);
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Choose Owners' }),
      );
      await userEvent.type(screen.getByRole('searchbox'), 'person-30');
      await userEvent.click(
        await screen.findByRole('option', { name: /person-30/ }),
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onChange).toHaveBeenLastCalledWith(['user:default/person-30']);
    },
  );

  it('offers explicit missing-ref choices and retains them through searches and reopening', async () => {
    const { onChange } = await setup(
      {
        multiple: true,
        allowMissingEntities: true,
        catalogFilter: { kind: ['User', 'Group'] },
        defaultKind: 'Group',
      },
      [],
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Owners' }),
    );
    await userEvent.type(screen.getByRole('searchbox'), 'freben');
    const user = await screen.findByRole('option', { name: /User freben/ });
    expect(within(user).getByText(/Not found in catalog/)).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Group freben/ }),
    ).toBeInTheDocument();
    await userEvent.click(user);
    expect(onChange).toHaveBeenLastCalledWith(['user:default/freben']);
    await userEvent.clear(screen.getByRole('searchbox'));
    await userEvent.type(screen.getByRole('searchbox'), 'another');
    await userEvent.keyboard('{Escape}');
    expect(
      screen.getByRole('button', { name: 'Change User freben' }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Owners' }),
    );
    await userEvent.keyboard('{Escape}');
    expect(onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove User freben' }),
    );
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('button', { name: 'Choose Owners' })).toHaveFocus();
  });

  it('does not label a failed lookup as a missing entity or offer duplicate real and virtual refs', async () => {
    const { getEntitiesByRefs, onChange } = await setup({
      allowMissingEntities: true,
    });
    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Owners' }),
    );
    await userEvent.type(screen.getByRole('searchbox'), 'freben');
    await screen.findByRole('option', { name: /Fredrik Adelöw/ });
    // Wait for the debounced exact lookup, in addition to catalog search.
    await waitFor(() =>
      expect(getEntitiesByRefs).toHaveBeenCalledWith({
        entityRefs: ['user:default/freben'],
      }),
    );
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.queryByText(/Not found in catalog/)).not.toBeInTheDocument();
    getEntitiesByRefs.mockRejectedValueOnce(new Error('Unavailable'));
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'unavailable' },
    });
    expect(await screen.findByText(/Could not check/)).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /User unavailable/ }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('paginates without discarding off-page selections and enforces maxItems', async () => {
    const { onChange } = await setup(
      { multiple: true, value: ['user:default/person-44'], maxItems: 2 },
      entities,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Owners' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'Load more' }),
    );
    await userEvent.click(
      await screen.findByRole('option', { name: /person-20/ }),
    );
    expect(onChange).toHaveBeenLastCalledWith([
      'user:default/person-44',
      'user:default/person-20',
    ]);
    expect(screen.getByRole('option', { name: /person-21/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(screen.getByRole('option', { name: /person-20/ }));
    expect(onChange).toHaveBeenLastCalledWith(['user:default/person-44']);
  });

  it('keeps external values while disabled without exposing editable text', async () => {
    const { onChange } = await setup({
      value: ['legacy value'],
      disabled: true,
    });
    expect(
      screen.getByRole('button', { name: 'Choose Owners' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Remove legacy value' }),
    ).toBeDisabled();
    await act(async () => {});
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
