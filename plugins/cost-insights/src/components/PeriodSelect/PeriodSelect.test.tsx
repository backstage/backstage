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
import { getByRole, screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { PeriodSelect, getDefaultOptions } from './PeriodSelect';
import { getDefaultPageFilters } from '../../utils/filters';
import { MockBillingDateProvider } from '../../testUtils';
import { Duration } from '../../types';
import { Group } from '@backstage/plugin-cost-insights-common';

const DefaultPageFilters = getDefaultPageFilters([{ id: 'tools' }] as Group[]);
const lastCompleteBillingDate = '2020-05-01';
const options = getDefaultOptions(lastCompleteBillingDate);

describe('<PeriodSelect />', () => {
  it('Renders without exploding', async () => {
    await renderInTestApp(
      <MockBillingDateProvider
        lastCompleteBillingDate={lastCompleteBillingDate}
      >
        <PeriodSelect
          duration={DefaultPageFilters.duration}
          onSelect={jest.fn()}
        />
      </MockBillingDateProvider>,
    );
    expect(screen.getByTestId('period-select')).toBeInTheDocument();
  });

  it('Should display all costGrowth period options', async () => {
    await renderInTestApp(
      <MockBillingDateProvider
        lastCompleteBillingDate={lastCompleteBillingDate}
      >
        <PeriodSelect
          duration={DefaultPageFilters.duration}
          onSelect={jest.fn()}
        />
      </MockBillingDateProvider>,
    );
    const periodSelectContainer = screen.getByTestId('period-select');
    const button = getByRole(periodSelectContainer, 'button');
    await userEvent.click(button);
    await waitFor(() => screen.getByText('Past 60 Days'));
    options.forEach(option =>
      expect(
        screen.getByTestId(`period-select-option-${option.value}`),
      ).toBeInTheDocument(),
    );
  });

  describe.each`
    duration
    ${Duration.P3M}
    ${Duration.P90D}
    ${Duration.P30D}
  `('Should select the correct duration', ({ duration }) => {
    it(`Should select ${duration}`, async () => {
      const mockOnSelect = jest.fn();
      const mockAggregation =
        // Can't select an option that's already the default
        DefaultPageFilters.duration === duration
          ? Duration.P30D
          : DefaultPageFilters.duration;

      await renderInTestApp(
        <MockBillingDateProvider
          lastCompleteBillingDate={lastCompleteBillingDate}
        >
          <PeriodSelect duration={mockAggregation} onSelect={mockOnSelect} />,
        </MockBillingDateProvider>,
      );
      const periodSelect = screen.getByTestId('period-select');
      const button = getByRole(periodSelect, 'button');

      await userEvent.click(button);
      await userEvent.click(
        screen.getByTestId(`period-select-option-${duration}`),
      );
      expect(mockOnSelect).toHaveBeenLastCalledWith(duration);
    });
  });
});
