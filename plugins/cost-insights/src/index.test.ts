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

import * as index from '.';

describe('index', () => {
  it('exports the cost insights plugin api', () => {
    expect(index).toEqual({
      AlertDismissOptions: [
        {
          label: 'This action item is now resolved.',
          reason: 'resolved',
        },
        {
          label: 'This is an expected increase at this time of year.',
          reason: 'seasonal',
        },
        {
          label: 'This increase is from a migration in process.',
          reason: 'migration',
        },
        {
          label: 'This is an expected increase due to our team’s priorities.',
          reason: 'expected',
        },
        {
          label: 'This action item doesn’t make sense for my team.',
          reason: 'not-applicable',
        },
        {
          label: 'Other (please specify)',
          reason: 'other',
        },
      ],
      AlertDismissReason: {
        Expected: 'expected',
        Migration: 'migration',
        NotApplicable: 'not-applicable',
        Other: 'other',
        Resolved: 'resolved',
        Seasonal: 'seasonal',
      },
      AlertSnoozeOptions: [
        {
          duration: 'P7D',
          label: '1 Week',
        },
        {
          duration: 'P30D',
          label: '1 Month',
        },
        {
          duration: 'P90D',
          label: '1 Quarter',
        },
      ],
      AlertStatus: {
        Accepted: 'accepted',
        Dismissed: 'dismissed',
        Snoozed: 'snoozed',
      },
      BarChart: expect.any(Function),
      BarChartLegend: expect.any(Function),
      BarChartTooltip: expect.any(Function),
      BarChartTooltipItem: expect.any(Function),
      ChangeThreshold: {
        '-0.05': 'lower',
        '0.05': 'upper',
        lower: -0.05,
        upper: 0.05,
      },
      CostGrowth: expect.any(Function),
      CostGrowthIndicator: expect.any(Function),
      CostInsightsLabelDataflowInstructionsPage: expect.any(Function),
      CostInsightsPage: expect.any(Function),
      CostInsightsProjectGrowthInstructionsPage: expect.any(Function),
      CurrencyType: {
        Beers: 'BEERS',
        CarbonOffsetTons: 'CARBON_OFFSET_TONS',
        IceCream: 'PINTS_OF_ICE_CREAM',
        USD: 'USD',
      },
      DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
      DataKey: {
        Current: 'current',
        Name: 'name',
        Previous: 'previous',
      },
      Duration: {
        P30D: 'P30D',
        P3M: 'P3M',
        P7D: 'P7D',
        P90D: 'P90D',
      },
      EngineerThreshold: 0.5,
      ExampleCostInsightsClient: expect.any(Function),
      GrowthType: {
        '0': 'Negligible',
        '1': 'Savings',
        '2': 'Excess',
        Excess: 2,
        Negligible: 0,
        Savings: 1,
      },
      IconType: {
        Compute: 'compute',
        Data: 'data',
        Database: 'database',
        ML: 'ml',
        Search: 'search',
        Storage: 'storage',
      },
      LegendItem: expect.any(Function),
      MockConfigProvider: expect.any(Function),
      MockCurrencyProvider: expect.any(Function),
      ProjectGrowthAlert: expect.any(Function),
      UnlabeledDataflowAlert: expect.any(Function),
      costInsightsApiRef: expect.any(Object),
      costInsightsPlugin: expect.any(Object),
      plugin: expect.any(Object),
    });
  });
});
