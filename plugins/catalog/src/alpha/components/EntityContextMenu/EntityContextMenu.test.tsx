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

import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import {
  EntityContextMenuItemBlueprint,
  type EntityContextMenuItemParams,
} from '@backstage/plugin-catalog-react/alpha';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { EntityContextMenu } from './EntityContextMenu';

function createContextMenuItem(params: EntityContextMenuItemParams) {
  const extension = EntityContextMenuItemBlueprint.make({
    name: 'test',
    params,
  });
  const tester = createExtensionTester(extension);

  return {
    data: tester.get(EntityContextMenuItemBlueprint.dataRefs.data),
    node: tester.query(extension).node,
  };
}

describe('EntityContextMenu', () => {
  it('renders menu item data and invokes useProps as a hook', async () => {
    const onClick = jest.fn();

    function useProps() {
      const [title] = useState('Supplied item');
      return { title, onClick };
    }

    await renderInTestApp(
      <EntityContextMenu
        contextMenuItems={[
          createContextMenuItem({
            icon: <span data-testid="supplied-icon" />,
            useProps,
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    const item = await screen.findByRole('menuitem', {
      name: 'Supplied item',
    });
    expect(screen.getByTestId('supplied-icon')).toBeInTheDocument();

    await userEvent.click(item);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports an action alongside an internal link', async () => {
    const onClick = jest.fn();

    await renderInTestApp(
      <EntityContextMenu
        contextMenuItems={[
          createContextMenuItem({
            icon: <span />,
            useProps: () => ({
              title: 'Linked action',
              href: '/internal',
              onClick,
            }),
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    const item = await screen.findByRole('menuitem', {
      name: 'Linked action',
    });
    expect(item).toHaveAttribute('href', '/internal');
    expect(item).not.toHaveAttribute('target');

    await userEvent.click(item);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders extras first with an icon and separator, and handles actions', async () => {
    const onClick = jest.fn();
    const Icon = () => <span data-testid="extra-icon" />;

    await renderInTestApp(
      <EntityContextMenu
        UNSTABLE_extraContextMenuItems={[
          { title: 'Extra item', Icon, onClick },
        ]}
        contextMenuItems={[
          createContextMenuItem({
            icon: <span />,
            useProps: () => ({
              title: 'Supplied item',
              onClick: () => {},
            }),
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
    expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('Extra item');
    expect(screen.getByTestId('extra-icon')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('menuitem', { name: 'Extra item' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports extra items with duplicate titles', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    try {
      await renderInTestApp(
        <EntityContextMenu
          UNSTABLE_extraContextMenuItems={[
            { title: 'Extra item', Icon: () => null, onClick: () => {} },
            { title: 'Extra item', Icon: () => null, onClick: () => {} },
          ]}
        />,
      );

      await userEvent.click(
        screen.getByRole('button', { name: 'More actions' }),
      );

      expect(
        screen.getAllByRole('menuitem', { name: 'Extra item' }),
      ).toHaveLength(2);
      expect(
        consoleError.mock.calls.some(args =>
          args.some(
            arg =>
              typeof arg === 'string' &&
              arg.includes('Encountered two children with the same key'),
          ),
        ),
      ).toBe(false);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('does not render a separator without extras', async () => {
    await renderInTestApp(
      <EntityContextMenu
        contextMenuItems={[
          createContextMenuItem({
            icon: <span />,
            useProps: () => ({
              title: 'Supplied item',
              onClick: () => {},
            }),
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('does not render a separator without supplied items', async () => {
    await renderInTestApp(
      <EntityContextMenu
        UNSTABLE_extraContextMenuItems={[
          { title: 'Extra item', Icon: () => null, onClick: () => {} },
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('closes immediately when a supplied async action remains pending', async () => {
    const pendingAction = new Promise<void>(() => {});

    await renderInTestApp(
      <EntityContextMenu
        contextMenuItems={[
          createContextMenuItem({
            icon: <span />,
            useProps: () => ({
              title: 'Pending action',
              onClick: () => pendingAction,
            }),
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Pending action' }),
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('handles rejections from supplied async actions', async () => {
    let rejectAction: (error: Error) => void = () => {};
    const action = new Promise<void>((_, reject) => {
      rejectAction = reject;
    });
    const catchSpy = jest.spyOn(action, 'catch');

    await renderInTestApp(
      <EntityContextMenu
        contextMenuItems={[
          createContextMenuItem({
            icon: <span />,
            useProps: () => ({
              title: 'Rejected action',
              onClick: () => action,
            }),
          }),
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Rejected action' }),
    );

    expect(catchSpy).toHaveBeenCalledWith(expect.any(Function));
    rejectAction(new Error('Action failed'));
  });
});
