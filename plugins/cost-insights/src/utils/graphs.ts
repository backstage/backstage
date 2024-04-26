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

import { TooltipProps } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { AlertCost, DataKey, ResourceData } from '../types';
import { Entity } from '@backstage/plugin-cost-insights-common';
import {
  currencyFormatter,
  dateFormatter,
  lengthyCurrencyFormatter,
} from './formatters';

export const formatGraphValue =
  (baseCurrency: Intl.NumberFormat) =>
  (value: number, _index: number, format?: string) => {
    if (format === 'number') {
      return value.toLocaleString();
    }

    if (value < 1) {
      return lengthyCurrencyFormatter(baseCurrency).format(value);
    }

    return currencyFormatter(baseCurrency).format(value);
  };

export const overviewGraphTickFormatter = (millis: string | number) =>
  typeof millis === 'number' ? dateFormatter.format(millis) : millis;

export const tooltipItemOf =
  (baseCurrency: Intl.NumberFormat) => (payload: Payload<string, string>) => {
    const value =
      payload.value && !isNaN(Number(payload.value))
        ? baseCurrency.format(Number(payload.value))
        : payload.value;
    const fill = payload.color as string;

    switch (payload.dataKey) {
      case DataKey.Current:
      case DataKey.Previous:
        return {
          label: payload.name,
          value: value,
          fill: fill,
        };
      default:
        return null;
    }
  };

export const resourceOf = (entity: Entity | AlertCost): ResourceData => ({
  name: entity.id,
  previous: entity.aggregation[0],
  current: entity.aggregation[1],
});

export const titleOf = (label?: string | number) => {
  return label ? String(label) : 'Unlabeled';
};

export const isInvalid = ({ label, payload }: TooltipProps<string, string>) => {
  // null labels are empty strings, which are valid
  return label === undefined || !payload || !payload.length;
};

export const isLabeled = (data?: Record<'activeLabel', string | undefined>) => {
  return data?.activeLabel && data?.activeLabel !== '';
};

export const isUnlabeled = (
  data?: Record<'activeLabel', string | undefined>,
) => {
  return data?.activeLabel === '';
};
