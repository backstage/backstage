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

import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { HeaderActionMenu } from './HeaderActionMenu';
import userEvent from '@testing-library/user-event';

describe('<ComponentContextMenu />', () => {
  it('renders without any items and without exploding', async () => {
    const rendered = await renderInTestApp(
      <HeaderActionMenu actionItems={[]} />,
    );

    expect(rendered.queryByTestId('header-action-menu')).toBeInTheDocument();
    expect(
      rendered.queryByTestId('header-action-item'),
    ).not.toBeInTheDocument();
  });

  it('can open the menu and click menu items', async () => {
    const onClickFunction = jest.fn();
    const rendered = await renderInTestApp(
      <HeaderActionMenu
        actionItems={[{ label: 'Some label', onClick: onClickFunction }]}
      />,
    );
    // Menu content is not rendered until opened (Radix DropdownMenu uses portal)
    expect(screen.queryByText('Some label')).not.toBeInTheDocument();
    expect(onClickFunction).not.toHaveBeenCalled();

    // Open menu via trigger — use userEvent for Radix pointer event compatibility
    await userEvent.click(rendered.getByTestId('header-action-menu'));

    // After opening, portal-rendered content should be visible
    await waitFor(() => {
      expect(screen.getByText('Some label')).toBeInTheDocument();
    });
    expect(onClickFunction).not.toHaveBeenCalled();
    // Radix DropdownMenu sets aria-disabled on disabled items; verify it is NOT set here
    expect(screen.getByTestId('header-action-item')).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );

    // Click the menu item — implementation uses onSelect with event.preventDefault()
    await userEvent.click(screen.getByText('Some label'));
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(screen.getByText('Some label')).toBeInTheDocument();
  });

  it('Disabled', async () => {
    const rendered = await renderInTestApp(
      <HeaderActionMenu
        actionItems={[{ label: 'Some label', disabled: true }]}
      />,
    );

    // Open menu via trigger — use userEvent for Radix compatibility
    await userEvent.click(rendered.getByTestId('header-action-menu'));
    // Radix DropdownMenu sets aria-disabled="true" on disabled menu items
    await waitFor(() => {
      expect(screen.getByTestId('header-action-item')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  it('Secondary label', async () => {
    const onClickFunction = jest.fn();
    const rendered = await renderInTestApp(
      <HeaderActionMenu
        actionItems={[
          {
            label: 'Some label',
            secondaryLabel: 'Secondary label',
            onClick: onClickFunction,
          },
        ]}
      />,
    );

    expect(onClickFunction).not.toHaveBeenCalled();
    // Open menu via trigger — use userEvent for Radix compatibility
    await userEvent.click(rendered.getByTestId('header-action-menu'));
    // Wait for portal-rendered content to appear
    await waitFor(() => {
      expect(screen.getByText('Secondary label')).toBeInTheDocument();
    });
    expect(onClickFunction).not.toHaveBeenCalled();

    // Click the secondary label text — triggers onClick via onSelect handler
    await userEvent.click(screen.getByText('Secondary label'));
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(screen.getByText('Some label')).toBeInTheDocument();
  });

  it('should close when hitting escape', async () => {
    const rendered = await renderInTestApp(
      <HeaderActionMenu actionItems={[{ label: 'Some label' }]} />,
    );
    // Menu items should not be visible before opening
    expect(screen.queryByTestId('header-action-item')).not.toBeInTheDocument();

    // Open menu via trigger
    await userEvent.click(rendered.getByTestId('header-action-menu'));
    // After opening, menu content should be visible via Radix portal
    await waitFor(() => {
      expect(screen.getByTestId('header-action-item')).toBeInTheDocument();
    });

    // Press Escape to close — Radix DropdownMenu handles Escape key natively
    // via a document-level keydown listener
    await userEvent.keyboard('{Escape}');

    // After Escape, menu content is removed from the DOM
    await waitFor(() => {
      expect(
        screen.queryByTestId('header-action-item'),
      ).not.toBeInTheDocument();
    });
  });
});
