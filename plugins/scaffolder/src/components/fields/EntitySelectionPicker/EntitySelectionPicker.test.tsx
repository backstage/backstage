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

const originalObserver = globalThis.IntersectionObserver;
let observations: Array<{
  observer: IntersectionObserver;
  callback: IntersectionObserverCallback;
  target?: Element;
}>;
let sentinelVisible = false;

function intersect(observation: (typeof observations)[number]) {
  const target = observation.target!;
  const rect = target.getBoundingClientRect();
  observation.callback(
    [
      {
        target,
        isIntersecting: true,
        intersectionRatio: 1,
        time: 0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: rect,
      },
    ],
    observation.observer,
  );
}

function currentSentinel() {
  const root = screen.getByRole('grid', { name: 'Owners' });
  expect(root).toHaveStyle({ maxHeight: '320px', overflowY: 'auto' });
  const observation = [...observations]
    .reverse()
    .find(item => item.target && item.observer.root === root);
  expect(observation).toBeDefined();
  return observation!;
}

describe('EntitySelectionPicker', () => {
  beforeEach(() => {
    observations = [];
    sentinelVisible = false;
    globalThis.IntersectionObserver = jest.fn((callback, options) => {
      const observation: (typeof observations)[number] = {
        callback,
        observer: {
          root: options?.root ?? null,
          rootMargin: options?.rootMargin ?? '0px',
          thresholds: [0],
          observe: target => {
            observation.target = target;
            if (sentinelVisible && options?.root)
              queueMicrotask(() => intersect(observation));
          },
          unobserve: () => {},
          disconnect: () => {},
          takeRecords: () => [],
        },
      };
      observations.push(observation);
      return observation.observer;
    });
  });
  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver;
  });

  it('uses entity presentation icons for real entries without linking picker rows or missing references', async () => {
    await setup({
      multiple: true,
      value: ['user:default/freben', 'user:default/missing'],
    });
    const link = await screen.findByRole('link', { name: 'Fredrik Adelöw' });
    expect(link).toHaveAttribute('href', '/entities/user%3Adefault%2Ffreben');
    expect(link.querySelector('svg')).toBeInTheDocument();
    const missing = screen.getByText('User missing').closest('li')!;
    expect(within(missing).queryByRole('link')).not.toBeInTheDocument();
    expect(missing.querySelector('svg')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    const row = await screen.findByRole('row', { name: /Fredrik Adelöw/ });
    expect(row.querySelector('svg')).toBeInTheDocument();
    expect(within(row).queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /User missing/ }).querySelector('svg'),
    ).not.toBeInTheDocument();
  });

  it('keeps loading feedback in a reserved slot inside the results', async () => {
    const { catalogApi, queryEntities } = await setup({}, entities);
    let finishPage!: () => void;
    const pending = new Promise<void>(resolve => {
      finishPage = resolve;
    });
    const query = queryEntities.getMockImplementation()!;
    queryEntities.mockImplementationOnce(async request => {
      await pending;
      return query.call(catalogApi, request);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    const observation = currentSentinel();
    const idleHeight = window.getComputedStyle(observation.target!).height;
    await act(async () => intersect(observation));
    const loading = within(screen.getByRole('grid')).getByText('Loading…');
    expect(loading).toBe(observation.target);
    expect(parseFloat(idleHeight)).toBeGreaterThan(0);
    expect(window.getComputedStyle(loading).height).toBe(idleHeight);
    expect(screen.getByText('Loading catalog results…')).toHaveStyle({
      position: 'absolute',
    });
    expect(screen.getAllByRole('row')).toHaveLength(20);

    await act(async () => finishPage());
    await screen.findByRole('row', { name: /person-39/ });
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(window.getComputedStyle(observation.target!).height).toBe(
      idleHeight,
    );
  });

  it('continues loading while the sentinel stays visible without another scroll event', async () => {
    const { queryEntities } = await setup({}, entities);
    sentinelVisible = true;
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    await screen.findByRole('row', { name: /person-44/ });
    expect(queryEntities).toHaveBeenCalledTimes(3);
    expect(
      screen.queryByRole('button', { name: 'Load more' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(45);
  });

  it('keeps one list in place while toggling selections and sorts selected rows first only on reopening', async () => {
    const { onChange } = await setup(
      {
        multiple: true,
        value: ['user:default/person-10'],
      },
      entities,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    const initial = await screen.findByRole('row', { name: /person-10/ });
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toBe(initial);
    expect(initial).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('grid')).toHaveLength(1);
    expect(
      screen.queryByRole('list', { name: 'Selected Owners' }),
    ).not.toBeInTheDocument();

    const next = screen.getByRole('row', { name: /person-12/ });
    await userEvent.click(next);
    expect(next).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('row')).toEqual(rows);
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove person-10' }),
    );
    expect(initial).toHaveAttribute('aria-selected', 'false');
    expect(screen.getAllByRole('row')).toEqual(rows);
    expect(onChange).toHaveBeenLastCalledWith(['user:default/person-12']);

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    expect(screen.getAllByRole('row')[0]).toHaveTextContent('person-12');
    const reopenedRows = screen.getAllByRole('row');
    await userEvent.click(
      screen.getByRole('button', { name: 'Clear selection' }),
    );
    expect(screen.getAllByRole('row')).toEqual(reopenedRows);
    expect(screen.queryAllByRole('row', { selected: true })).toHaveLength(0);
  });

  it('supports entering the list from the filter and reducing an over-limit selection with the keyboard', async () => {
    const { onChange } = await setup(
      {
        multiple: true,
        maxItems: 1,
        value: [
          'user:default/person-02',
          'user:default/person-03',
          'user:default/person-04',
        ],
      },
      entities,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    fireEvent.keyDown(screen.getByRole('searchbox'), {
      key: 'ArrowDown',
      isComposing: true,
    });
    expect(screen.getByRole('searchbox')).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('row', { name: /person-02/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith([
      'user:default/person-03',
      'user:default/person-04',
    ]);
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('row', { name: /person-04/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['user:default/person-03']);
  });

  it('stops automatic loading on errors and retries the same page explicitly', async () => {
    const { queryEntities } = await setup({}, entities);
    queryEntities.mockRejectedValueOnce(new Error('Unavailable'));
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    const observation = currentSentinel();
    await act(async () => {
      intersect(observation);
      intersect(observation);
    });
    const retry = await screen.findByRole('button', { name: /Retry/ });
    expect(queryEntities).toHaveBeenCalledTimes(2);
    await act(async () => {
      intersect(observation);
    });
    expect(queryEntities).toHaveBeenCalledTimes(2);
    await userEvent.click(retry);
    await screen.findByRole('row', { name: /person-39/ });
    expect(queryEntities.mock.calls[2]).toEqual(queryEntities.mock.calls[1]);
    expect(screen.getByRole('searchbox')).toHaveFocus();
    expect(
      screen.queryByRole('button', { name: /Retry/ }),
    ).not.toBeInTheDocument();
  });

  it('clears all selections without dismissing the popup or clearing the filter', async () => {
    const { onChange } = await setup({
      multiple: true,
      value: ['user:default/freben', 'user:default/missing'],
    });
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    await userEvent.type(screen.getByRole('searchbox'), 'person-30');
    await userEvent.click(
      screen.getByRole('button', { name: 'Clear selection' }),
    );
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('person-30');
    expect(screen.getByRole('searchbox')).toHaveFocus();
    expect(
      screen.getByRole('button', { name: 'Clear selection' }),
    ).toBeDisabled();
    expect(
      screen.queryByRole('list', { name: 'Selected Owners' }),
    ).not.toBeInTheDocument();
  });
  it('opens from the title and keeps linked selections separate from filtered options', async () => {
    const { onChange } = await setup({
      multiple: true,
      value: ['user:default/freben', 'user:default/missing'],
      popupTitle: 'Choose owners for this component',
      getItemHref: ref => `/entities/${encodeURIComponent(ref)}`,
      renderItem: item => <strong>Owner: {item.label}</strong>,
      itemLayout: 'list',
    });
    expect(
      await screen.findByRole('link', { name: 'Owner: Fredrik Adelöw' }),
    ).toHaveAttribute('href', '/entities/user%3Adefault%2Ffreben');
    expect(screen.getByText('Owner: User missing')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Owner: User missing' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    expect(
      screen.getByRole('heading', { name: 'Choose owners for this component' }),
    ).toBeVisible();
    expect(screen.getAllByRole('row', { selected: true })).toHaveLength(2);
    await userEvent.type(screen.getByRole('searchbox'), 'person-30');
    await screen.findByRole('row', { name: /person-30/ });
    expect(
      screen.queryByRole('row', { name: /Fredrik/ }),
    ).not.toBeInTheDocument();
    await userEvent.clear(screen.getByRole('searchbox'));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Remove User missing' }),
    );
    expect(onChange).toHaveBeenLastCalledWith(['user:default/freben']);
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  async function setup(
    props: Partial<EntitySelectionPickerProps> = {},
    items = [entity, ...entities],
  ) {
    const catalogApi = catalogApiMock({ entities: items });
    const getEntitiesByRefs = jest.spyOn(catalogApi, 'getEntitiesByRefs');
    const queryEntities = jest.spyOn(catalogApi, 'queryEntities');
    const onChange = jest.fn();
    function Picker() {
      const [value, setValue] = useState(props.value ?? []);
      return (
        <EntitySelectionPicker
          label="Owners"
          popupTitle="Choose owners for this component"
          getItemHref={ref => `/entities/${encodeURIComponent(ref)}`}
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
    const tree = (api = catalogApi) => (
      <TestApiProvider
        apis={[
          [catalogApiRef, api],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi: api }),
          ],
        ]}
      >
        <Picker />
      </TestApiProvider>
    );
    const rendered = await renderInTestApp(tree());
    return {
      catalogApi,
      onChange,
      getEntitiesByRefs,
      queryEntities,
      updateCatalog: (api: typeof catalogApi) => rendered.rerender(tree(api)),
    };
  }

  it('updates links when selected entities appear or disappear but not when lookups fail', async () => {
    const { onChange, updateCatalog } = await setup({
      value: ['user:default/freben'],
    });
    await screen.findByRole('link', { name: 'Fredrik Adelöw' });
    const failedApi = catalogApiMock({ entities: [] });
    failedApi.getEntitiesByRefs = jest
      .fn()
      .mockRejectedValue(new Error('Unavailable'));
    failedApi.queryEntities = jest
      .fn()
      .mockRejectedValue(new Error('Unavailable'));
    updateCatalog(failedApi);
    await act(async () => {});
    expect(
      screen.getByRole('link', { name: 'Fredrik Adelöw' }),
    ).toBeInTheDocument();
    updateCatalog(catalogApiMock({ entities: [] }));
    await waitFor(() =>
      expect(screen.queryByRole('link')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Fredrik Adelöw')).toBeInTheDocument();
    updateCatalog(catalogApiMock({ entities: [entity] }));
    expect(
      await screen.findByRole('link', { name: 'Fredrik Adelöw' }),
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each(['mui', 'bui'] as const)(
    'separates selection from search and does not commit dismissed input (%s)',
    async theme => {
      const { onChange } = await setup({
        theme,
        value: ['user:default/freben'],
      });
      expect(
        await screen.findByRole('link', { name: 'Fredrik Adelöw' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
      const search = screen.getByRole('searchbox');
      await userEvent.type(search, 'someone else');
      await userEvent.keyboard('{Escape}');
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Owners' })).toHaveFocus(),
      );

      await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
      expect(screen.getByRole('searchbox')).toHaveValue('');
      await userEvent.type(screen.getByRole('searchbox'), 'person-30');
      await userEvent.click(
        await screen.findByRole('row', { name: /person-30/ }),
      );
      expect(onChange).toHaveBeenLastCalledWith(['user:default/person-30']);
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
      await userEvent.type(screen.getByRole('searchbox'), 'person-30');
      expect(
        screen.getByRole('button', { name: 'Remove person-30' }),
      ).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Done' }));
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
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    await userEvent.type(screen.getByRole('searchbox'), 'freben');
    const user = await screen.findByRole('row', { name: /User freben/ });
    expect(within(user).getByText(/Not found in catalog/)).toBeInTheDocument();
    expect(
      screen.getByRole('row', { name: /Group freben/ }),
    ).toBeInTheDocument();
    await userEvent.click(user);
    expect(onChange).toHaveBeenLastCalledWith(['user:default/freben']);
    expect(user).toHaveAttribute('aria-selected', 'true');
    await userEvent.clear(screen.getByRole('searchbox'));
    expect(
      await screen.findByRole('row', { name: /User freben/ }),
    ).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(screen.getByRole('searchbox'), 'another');
    await userEvent.keyboard('{Escape}');
    expect(
      within(screen.getByRole('list', { name: 'Current Owners' })).getByText(
        'User freben',
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const retained = screen.getByRole('row', { name: /User freben/ });
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove User freben' }),
    );
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('row', { name: /User freben/ })).toBe(retained);
    expect(retained).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('does not label a failed lookup as a missing entity or offer duplicate real and virtual refs', async () => {
    const { getEntitiesByRefs, onChange } = await setup({
      allowMissingEntities: true,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    await userEvent.type(screen.getByRole('searchbox'), 'freben');
    await screen.findByRole('row', { name: /Fredrik Adelöw/ });
    // Wait for the debounced exact lookup, in addition to catalog search.
    await waitFor(() =>
      expect(getEntitiesByRefs).toHaveBeenCalledWith({
        entityRefs: ['user:default/freben'],
      }),
    );
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.queryByText(/Not found in catalog/)).not.toBeInTheDocument();
    getEntitiesByRefs.mockRejectedValueOnce(new Error('Unavailable'));
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'unavailable' },
    });
    expect(await screen.findByText(/Could not check/)).toBeInTheDocument();
    expect(
      screen.queryByRole('row', { name: /User unavailable/ }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('paginates without discarding off-page selections and enforces maxItems', async () => {
    const { onChange } = await setup(
      { multiple: true, value: ['user:default/person-44'], maxItems: 2 },
      entities,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Owners' }));
    const offPageSelection = screen.getByRole('row', { name: /person-44/ });
    expect(screen.getAllByRole('row')[0]).toBe(offPageSelection);
    await act(async () => {
      intersect(currentSentinel());
    });
    await userEvent.click(
      await screen.findByRole('row', { name: /person-20/ }),
    );
    expect(onChange).toHaveBeenLastCalledWith([
      'user:default/person-44',
      'user:default/person-20',
    ]);
    expect(screen.getByRole('row', { name: /person-21/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove person-20' }),
    );
    expect(onChange).toHaveBeenLastCalledWith(['user:default/person-44']);
    await act(async () => intersect(currentSentinel()));
    await screen.findByRole('row', { name: /person-43/ });
    expect(screen.getAllByRole('row')[0]).toBe(offPageSelection);
    expect(screen.getAllByRole('row', { name: /person-44/ })).toHaveLength(1);
  });

  it('keeps external values while disabled without exposing editable text', async () => {
    const { onChange } = await setup({
      value: ['legacy value'],
      disabled: true,
    });
    expect(screen.getByRole('button', { name: 'Owners' })).toBeDisabled();
    expect(screen.getByText('legacy value')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Remove/ }),
    ).not.toBeInTheDocument();
    await act(async () => {});
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
