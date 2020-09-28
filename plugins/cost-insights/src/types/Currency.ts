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
import { Duration } from './Duration';
import { assertNever } from './Maybe';

export enum CurrencyType {
  USD = 'USD',
  CarbonOffsetTons = 'CARBON_OFFSET_TONS',
  Beers = 'BEERS',
  IceCream = 'PINTS_OF_ICE_CREAM',
}

export interface Currency {
  kind: string | null;
  label: string;
  unit: string;
  prefix?: string;
  rate?: number;
}

export const rateOf = (cost: number, duration: Duration) => {
  switch (duration) {
    case Duration.P1M:
    case Duration.P30D:
      return cost / 12;
    case Duration.P90D:
    case Duration.P3M:
      return cost / 4;
    default:
      return assertNever(duration);
  }
};

export const defaultCurrencies: Currency[] = [
  {
    kind: null,
    label: 'Engineers 🛠',
    unit: 'engineer',
  },
  {
    kind: CurrencyType.USD,
    label: 'US Dollars 💵',
    unit: 'dollar',
    prefix: '$',
    rate: 1,
  },
  {
    kind: CurrencyType.CarbonOffsetTons,
    label: 'Carbon Offset Tons ♻️⚖️s',
    unit: 'carbon offset ton',
    rate: 3.5,
  },
  {
    kind: CurrencyType.Beers,
    label: 'Beers 🍺',
    unit: 'beer',
    rate: 4.5,
  },
  {
    kind: CurrencyType.IceCream,
    label: 'Pints of Ice Cream 🍦',
    unit: 'ice cream pint',
    rate: 5.5,
  },
];
