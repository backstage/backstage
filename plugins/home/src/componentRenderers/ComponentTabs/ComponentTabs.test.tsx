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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ComponentTabs } from './ComponentTabs';

describe('<ComponentTabs>', () => {
  test('should render tabs without exploding', () => {
    const { getByText } = render(
      <ComponentTabs
        title="Random Jokes"
        tabs={[
          {
            label: 'TabA',
            Component: () => <>ContentA</>,
          },
          {
            label: 'TabB',
            Component: () => <>ContentB</>,
          },
        ]}
      />,
    );

    expect(getByText('TabA')).toBeInTheDocument();
    expect(getByText('TabB')).toBeInTheDocument();

    expect(getByText('ContentA')).toBeInTheDocument();
    expect(getByText('ContentB')).toHaveStyle({
      display: 'none',
    });
  });

  test('should switch tab on click', async () => {
    const { getByText } = render(
      <ComponentTabs
        title="Random Jokes"
        tabs={[
          {
            label: 'TabA',
            Component: () => <>ContentA</>,
          },
          {
            label: 'TabB',
            Component: () => <>ContentB</>,
          },
        ]}
      />,
    );

    expect(getByText('ContentB')).toHaveStyle({
      display: 'none',
    });

    await userEvent.click(getByText('TabB'));

    expect(getByText('ContentA')).toHaveStyle({
      display: 'none',
    });
  });
});
