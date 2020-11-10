/*
 * Copyright 2020 Spotify AB
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

import React, { PropsWithChildren } from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { ResourceGrowthBarChartLegend } from './ResourceGrowthBarChartLegend';
import { defaultCurrencies } from '../../utils/currency';
import { findAlways } from '../../utils/assert';
import { MockConfigProvider, MockCurrencyProvider } from '../../utils/tests';
import { Duration } from '../../types';

const engineers = findAlways(defaultCurrencies, c => c.kind === null);

const MockContext = ({ children }: PropsWithChildren<{}>) => (
  <MockConfigProvider engineerCost={200_000}>
    <MockCurrencyProvider currency={engineers}>{children}</MockCurrencyProvider>
  </MockConfigProvider>
);

describe('<ResourceGrowthBarChartLegend />', () => {
  describe.each`
    ratio   | amount      | costText          | engineerTest
    ${2.5}  | ${300_000}  | ${'Cost Growth'}  | ${/\~6 engineers/}
    ${-2.5} | ${-120_000} | ${'Cost Savings'} | ${/\~2 engineers/}
  `(
    'Should display the cost text',
    ({ ratio, amount, costText, engineerTest }) => {
      it(`Should display the correct cost and engineer text for ${ratio} percent change`, async () => {
        const rendered = await renderInTestApp(
          <MockContext>
            <ResourceGrowthBarChartLegend
              duration={Duration.P3M}
              change={{ ratio, amount }}
              previousName="Q2 2020"
              currentName="Q3 2020"
              costStart={1000}
              costEnd={5000}
            />
          </MockContext>,
        );
        expect(rendered.getByText(costText)).toBeInTheDocument();
        expect(rendered.queryByText(engineerTest)).toBeInTheDocument();
      });
    },
  );
});
