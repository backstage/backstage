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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { Search } from 'lucide-react';
import { IconComponent } from '@backstage/core-plugin-api';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { EntityContextMenu } from './EntityContextMenu';

function render(children: ReactNode) {
  return renderInTestApp(
    <TestApiProvider apis={[[permissionApiRef, mockApis.permission()]]}>
      <EntityProvider
        entity={{ apiVersion: 'a', kind: 'b', metadata: { name: 'c' } }}
        children={children}
      />
    </TestApiProvider>,
  );
}

describe('ComponentContextMenu', () => {
  it('should call onUnregisterEntity on button click', async () => {
    const mockCallback = jest.fn();
    await render(
      <EntityContextMenu
        onUnregisterEntity={mockCallback}
        onInspectEntity={() => {}}
      />,
    );

    // Use userEvent for Radix DropdownMenu pointer event compatibility
    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const unregister = await screen.findByText('Unregister entity');
    expect(unregister).toBeInTheDocument();
    await userEvent.click(unregister);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('check Unregister entity button is disabled', async () => {
    const mockCallback = jest.fn();

    await render(
      <EntityContextMenu
        UNSTABLE_contextMenuOptions={{ disableUnregister: 'disable' }}
        onUnregisterEntity={mockCallback}
        onInspectEntity={() => {}}
      />,
    );

    // Use userEvent for Radix DropdownMenu pointer event compatibility
    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const unregister = await screen.findByText('Unregister entity');
    expect(unregister).toBeInTheDocument();

    const unregisterSpanItem = screen.getByText(/Unregister entity/);
    // With Radix DropdownMenuItem, the <span> text is a direct child of the
    // <div role="menuitem"> element that carries the aria-disabled attribute.
    const unregisterMenuListItem = unregisterSpanItem?.parentElement;
    expect(unregisterMenuListItem).toHaveAttribute('aria-disabled');
  });

  it('should call onInspectEntity on button click', async () => {
    const mockCallback = jest.fn();

    await render(
      <EntityContextMenu
        onUnregisterEntity={() => {}}
        onInspectEntity={mockCallback}
      />,
    );

    // Use userEvent for Radix DropdownMenu pointer event compatibility
    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const inspect = await screen.findByText('Inspect entity');
    expect(inspect).toBeInTheDocument();
    await userEvent.click(inspect);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('supports extra items', async () => {
    const extra = {
      title: 'HELLO',
      Icon: Search as unknown as IconComponent,
      onClick: jest.fn(),
    };

    await render(
      <EntityContextMenu
        onUnregisterEntity={jest.fn()}
        onInspectEntity={jest.fn()}
        UNSTABLE_extraContextMenuItems={[extra]}
      />,
    );

    // Use userEvent for Radix DropdownMenu pointer event compatibility
    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    await userEvent.click(button);

    const item = await screen.findByText('HELLO');
    expect(item).toBeInTheDocument();
    await userEvent.click(item);

    expect(extra.onClick).toHaveBeenCalled();
  });
});
