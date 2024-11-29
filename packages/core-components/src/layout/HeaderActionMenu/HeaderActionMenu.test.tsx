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

import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { HeaderActionMenu } from './HeaderActionMenu';
import userEvent from '@testing-library/user-event';

describe('<ComponentContextMenu />', () => {
  it('renders without any items and without exploding', async () => {
    await renderInTestApp(<HeaderActionMenu actionItems={[]} />);
  });

  it('can open the menu and click menu items', async () => {
    const onClickFunction = jest.fn();
    const rendered = await renderInTestApp(
      <HeaderActionMenu
        actionItems={[{ label: 'Some label', onClick: onClickFunction }]}
      />,
    );
    expect(rendered.queryByText('Some label')).not.toBeInTheDocument();
    expect(onClickFunction).not.toHaveBeenCalled();
    await fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(onClickFunction).not.toHaveBeenCalled();
    expect(rendered.getByTestId('header-action-item')).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await fireEvent.click(rendered.queryByText('Some label') as Node);
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(rendered.getByText('Some label')).toBeInTheDocument();
  });

  it('Disabled', async () => {
    const rendered = await renderInTestApp(
      <HeaderActionMenu
        actionItems={[{ label: 'Some label', disabled: true }]}
      />,
    );

    fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(rendered.getByTestId('header-action-item')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
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
    await fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(onClickFunction).not.toHaveBeenCalled();
    await fireEvent.click(rendered.queryByText('Secondary label') as Node);
    expect(onClickFunction).toHaveBeenCalled();
    // We do not expect the dropdown to disappear after click
    expect(rendered.getByText('Some label')).toBeInTheDocument();
  });

  it('should close when hitting escape', async () => {
    const rendered = await renderInTestApp(
      <HeaderActionMenu actionItems={[{ label: 'Some label' }]} />,
    );
    expect(rendered.container.getAttribute('aria-hidden')).toBeNull();
    await fireEvent.click(rendered.getByTestId('header-action-menu'));
    expect(rendered.container.getAttribute('aria-hidden')).toBe('true');
    await userEvent.type(
      rendered.getByTestId('header-action-menu'),
      '{Escape}',
    );
    expect(rendered.container.getAttribute('aria-hidden')).toBeNull();
  });
});
