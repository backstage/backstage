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

import { act, fireEvent, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { EntityPeekAheadPopover } from './EntityPeekAheadPopover';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '../../api';
import Button from '@material-ui/core/Button';
import { entityRouteRef } from '../../routes';

const catalogApi = catalogApiMock({
  entities: [
    {
      apiVersion: '',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'service1',
      },
      spec: {
        tags: ['java'],
      },
    },
  ],
});

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityPeekAheadPopover/>', () => {
  it('loads entity details and errors on hover', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button data-testid="popover1">s1</Button>
        </EntityPeekAheadPopover>
        <EntityPeekAheadPopover entityRef="component:default/service2">
          <Button data-testid="popover2">s2</Button>
        </EntityPeekAheadPopover>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('s1')).toBeInTheDocument();
    expect(screen.queryByText('service1')).toBeNull();
    await user.hover(screen.getByTestId('popover1'));
    expect(await screen.findByText('service1')).toBeInTheDocument();

    expect(screen.getByText('s2')).toBeInTheDocument();
    expect(screen.queryByText('service2')).toBeNull();
    await user.hover(screen.getByTestId('popover2'));
    expect(
      await screen.findByText('Error: component:default/service2 not found'),
    ).toBeInTheDocument();
  });

  it('delays opening, cancels on leave, and allows interaction with the popover', async () => {
    jest.useFakeTimers();
    const getEntity = jest.spyOn(catalogApi, 'getEntityByRef');
    getEntity.mockClear();
    const { unmount } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button>Peek</Button>
        </EntityPeekAheadPopover>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    const trigger = screen.getByText('Peek').closest('button')!;

    jest
      .spyOn(trigger.parentElement!, 'getBoundingClientRect')
      .mockReturnValue({
        x: 200,
        y: 100,
        top: 100,
        left: 200,
        bottom: 120,
        right: 300,
        width: 100,
        height: 20,
        toJSON: () => ({}),
      });
    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(499));
    expect(getEntity).not.toHaveBeenCalled();
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText('service1')).not.toBeInTheDocument();
    expect(getEntity).not.toHaveBeenCalled();

    fireEvent.mouseEnter(trigger);
    act(() => jest.advanceTimersByTime(500));
    const title = await screen.findByText('service1');
    const popover = title.closest('[id]')!;
    const paper = title.closest('.MuiPopover-paper')!;
    expect(trigger.closest('[aria-owns]')).toHaveAttribute(
      'aria-owns',
      popover.id,
    );
    expect(popover).toHaveStyle({ pointerEvents: 'none' });
    expect(paper).toHaveStyle({
      pointerEvents: 'auto',
      top: '120px',
      left: '250px',
    });
    fireEvent.mouseLeave(trigger, { relatedTarget: title });
    fireEvent.mouseEnter(title, { relatedTarget: trigger });
    expect(title).toBeVisible();
    const link = screen.getByRole('button', { name: 'Show' });
    expect(link).toHaveAttribute('href', '/catalog/default/Component/service1');
    fireEvent.mouseLeave(paper, { relatedTarget: trigger });
    expect(title).toBeVisible();
    fireEvent.mouseLeave(trigger);
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText('service1')).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    act(() => jest.advanceTimersByTime(500));
    expect(await screen.findByText('service1')).toBeVisible();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByText('service1')).not.toBeInTheDocument();
    fireEvent.focus(trigger);
    unmount();
    act(() => jest.advanceTimersByTime(500));
    expect(jest.getTimerCount()).toBe(0);
    getEntity.mockRestore();
    jest.useRealTimers();
  });
});
