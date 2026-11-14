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

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
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
        description: 'Example service',
        tags: ['java', 'backend', 'production', 'critical', 'extra'],
      },
      spec: { type: 'service' },
    },
    {
      apiVersion: '',
      kind: 'User',
      metadata: { namespace: 'default', name: 'user1' },
      spec: {
        profile: {
          email: 'a-very-long-email-address@organization.example.com',
        },
      },
    },
  ],
});

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityPeekAheadPopover/>', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    const dialog = screen.queryByRole('dialog');
    if (dialog) {
      fireEvent.keyDown(dialog, { key: 'Escape' });
    }
    cleanup();
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  it('loads entity details and errors on hover', async () => {
    const interaction = user.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button data-testid="popover1">s1</Button>
        </EntityPeekAheadPopover>
        <EntityPeekAheadPopover entityRef="component:default/service2">
          <Button data-testid="popover2">s2</Button>
        </EntityPeekAheadPopover>
        <EntityPeekAheadPopover entityRef="user:default/user1">
          <Button>user</Button>
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
    fireEvent.pointerMove(document.body, { pointerType: 'mouse' });
    await interaction.hover(screen.getByTestId('popover1'));
    expect(await screen.findByText('service1')).toBeInTheDocument();
    expect(screen.getByText('Example service')).toBeVisible();
    expect(screen.getByText('service')).toBeVisible();
    expect(screen.getByText('java')).toBeVisible();
    expect(screen.queryByText('extra')).not.toBeInTheDocument();
    expect(
      screen.getByLabelText('Drill into the entity to see all of the tags.'),
    ).toBeVisible();

    expect(screen.getByText('s2')).toBeInTheDocument();
    expect(screen.queryByText('service2')).toBeNull();
    await interaction.hover(screen.getByTestId('popover2'));
    expect(
      await screen.findByText('Error: component:default/service2 not found'),
    ).toBeInTheDocument();
    await interaction.hover(screen.getByRole('button', { name: 'user' }));
    const emailAction = await screen.findByRole('link', {
      name: 'Email a-very-long-email-address@organization.example.com',
    });
    expect(emailAction).toHaveTextContent('Email');
    expect(emailAction).toHaveAttribute(
      'href',
      'mailto:a-very-long-email-address@organization.example.com',
    );
    expect(emailAction).not.toHaveTextContent('a-very-long-email-address');
    expect(screen.getByRole('link', { name: 'Show details' })).toBeVisible();
  });

  it('delays loading, cancels opening on leave, and keeps previews open while keyboard focus remains', async () => {
    const interaction = user.setup({ advanceTimers: jest.advanceTimersByTime });
    const getEntity = jest.spyOn(catalogApi, 'getEntityByRef');
    getEntity.mockClear();
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button>Peek</Button>
        </EntityPeekAheadPopover>
        <Button>Outside</Button>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    const trigger = screen.getByRole('button', { name: 'Peek' });
    jest
      .spyOn(trigger.parentElement!, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(200, 100, 100, 20));
    // React Aria starts hover previews only after observing pointer movement.
    fireEvent.pointerMove(document.body, { pointerType: 'mouse' });
    await interaction.hover(trigger);
    act(() => jest.advanceTimersByTime(499));
    expect(getEntity).not.toHaveBeenCalled();
    await interaction.unhover(trigger);
    act(() => jest.advanceTimersByTime(1000));
    expect(getEntity).not.toHaveBeenCalled();

    await interaction.tab();
    expect(trigger).toHaveFocus();
    act(() => jest.advanceTimersByTime(500));
    expect(await screen.findByText('service1')).toBeVisible();
    const dialog = screen.getByRole('dialog', {
      name: 'component:default/service1',
    });
    expect(dialog).toHaveAttribute('data-placement', 'bottom');
    const link = screen.getByRole('link', { name: 'Show details' });
    expect(link).toHaveAttribute('href', '/catalog/default/Component/service1');

    // Ending a hover must not dismiss a preview that still has keyboard focus.
    await interaction.hover(trigger);
    await interaction.unhover(trigger);
    act(() => jest.advanceTimersByTime(1000));
    expect(dialog).toBeVisible();
    fireEvent.pointerMove(document.body, {
      pointerType: 'mouse',
      clientX: 900,
      clientY: 600,
    });
    act(() => jest.advanceTimersByTime(1000));
    expect(trigger).toHaveFocus();
    expect(dialog).toBeVisible();

    await interaction.tab();
    expect(screen.getByRole('row', { name: 'java' })).toHaveFocus();
    await interaction.tab();
    expect(link).toHaveFocus();
    expect(dialog).toBeVisible();
    await interaction.keyboard('{Escape}');
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.pointerMove(document.body, { pointerType: 'mouse' });
    await interaction.hover(trigger);
    act(() => jest.advanceTimersByTime(1000));
    const reopened = await screen.findByRole('dialog');
    expect(reopened).toBeVisible();
    expect(getEntity).toHaveBeenCalledTimes(1);
    jest
      .spyOn(reopened, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(200, 130, 300, 200));
    fireEvent.pointerMove(reopened, {
      pointerType: 'mouse',
      clientX: 250,
      clientY: 160,
    });
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());
    act(() => jest.advanceTimersByTime(1000));
    expect(reopened).toBeVisible();
    fireEvent.pointerMove(document.body, {
      pointerType: 'mouse',
      clientX: 900,
      clientY: 600,
    });
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
