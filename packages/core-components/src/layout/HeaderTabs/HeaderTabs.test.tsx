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
import React from 'react';
import { act } from 'react-dom/test-utils';
import { HeaderTabs } from './HeaderTabs';

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

    expect(rendered.getByText('Docs').parentElement).toHaveAttribute(
      'aria-selected',
      'false',
    );

    act(() => {
      rendered.getByText('Docs').click();
    });

    expect(rendered.getByText('Docs').parentElement).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
  it('should render extension component to tab if one present', async () => {
    const iconTab = [
      {
        id: 'icon-tab',
        label: 'Alarms',
      },
    ];

    const rendered = await renderInTestApp(<HeaderTabs tabs={iconTab} />);

    expect(rendered.getByText('Alarms')).toBeInTheDocument();
  });
});
