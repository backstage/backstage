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

import { formatGraphValue, tooltipItemOf } from './graphs';
import { DataKey } from '../types';
import { createCurrencyFormat } from './currency';

describe('graphs', () => {
  it('formatGraphValue', () => {
    expect(formatGraphValue(createCurrencyFormat('SEK'))(1000, 0)).toEqual(
      'SEK 1,000',
    );
    expect(formatGraphValue(createCurrencyFormat('EUR'))(1000, 0)).toEqual(
      '€1,000',
    );
    expect(formatGraphValue(createCurrencyFormat('USD'))(1000, 0)).toEqual(
      '$1,000',
    );
  });
  it('tooltipItemOf', () => {
    expect(
      tooltipItemOf(createCurrencyFormat('EUR'))({
        value: '1000',
        color: 'red',
        dataKey: DataKey.Current,
        name: 'Kubernetes',
      }),
    ).toEqual({
      fill: 'red',
      label: 'Kubernetes',
      value: '€1,000.00',
    });
  });
});
