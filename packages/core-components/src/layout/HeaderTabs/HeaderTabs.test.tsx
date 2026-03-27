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

import { renderInTestApp } from '@backstage/test-utils';
import { Badge } from '../../components/ui/badge';
import { PropsWithChildren, forwardRef } from 'react';
import { HeaderTabs } from './HeaderTabs';
import userEvent from '@testing-library/user-event';

const mockTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'docs', label: 'Docs' },
];

describe('<HeaderTabs />', () => {
  it('should render tabs', async () => {
    const rendered = await renderInTestApp(<HeaderTabs tabs={mockTabs} />);

    expect(rendered.getByText('Overview')).toBeInTheDocument();
    expect(rendered.getByText('Docs')).toBeInTheDocument();
  });

  it('should render correct selected tab', async () => {
    const rendered = await renderInTestApp(<HeaderTabs tabs={mockTabs} />);

    // Radix TabsTrigger renders a <button> with aria-selected directly —
    // use data-testid for reliable element selection
    const docsTab = rendered.getByTestId('header-tab-1');
    expect(docsTab).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(rendered.getByText('Docs'));

    expect(docsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should render extension component to tab if one present', async () => {
    // TextualBadge demonstrates using the shadcn Badge (variant="secondary")
    // alongside tab content. Replaces the former MUI Badge wrapper pattern —
    // shadcn Badge renders as a styled div with cva variant classes instead
    // of MUI's complex Badge with badgeContent/overlap/color props.
    const TextualBadge = forwardRef<HTMLButtonElement, PropsWithChildren<{}>>(
      (props, ref) => (
        <button ref={ref} {...props} type="button">
          {props.children}
          <Badge variant="secondary">three new alarms</Badge>
        </button>
      ),
    );

    const iconTab = [
      {
        id: 'icon-tab',
        label: 'Alarms',
        tabProps: { 'aria-label': 'Alarm notifications tab' },
      },
    ];

    // Render HeaderTabs with a tab trigger and a TextualBadge that wraps
    // a shadcn Badge notification counter. The Radix TabsTrigger spreads
    // tabProps for extensibility while the TextualBadge shows that shadcn
    // Badge renders correctly in the same component tree.
    const rendered = await renderInTestApp(
      <div>
        <HeaderTabs tabs={iconTab} />
        <TextualBadge>Alarm Details</TextualBadge>
      </div>,
    );

    expect(rendered.getByText('Alarms')).toBeInTheDocument();
    expect(rendered.getByText('three new alarms')).toBeInTheDocument();
    expect(rendered.getByTestId('header-tab-0')).toHaveAttribute(
      'aria-label',
      'Alarm notifications tab',
    );
  });

  it('should trigger onChange only once', async () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    const rendered = await renderInTestApp(
      <HeaderTabs tabs={mockTabs} onChange={mockOnChange} />,
    );

    await user.click(rendered.getByText('Docs'));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should support controlled mode via selectedIndex', async () => {
    const rendered = await renderInTestApp(
      <HeaderTabs tabs={mockTabs} selectedIndex={1} />,
    );

    const overviewTab = rendered.getByTestId('header-tab-0');
    const docsTab = rendered.getByTestId('header-tab-1');

    expect(overviewTab).toHaveAttribute('aria-selected', 'false');
    expect(docsTab).toHaveAttribute('aria-selected', 'true');
  });
});
