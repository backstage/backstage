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

import React from 'react';
import classnames from 'classnames';
import {
  ChangeStatistic,
  CurrencyType,
  Duration,
  EngineerThreshold,
  GrowthType,
} from '../../types';
import { rateOf } from '../../utils/currency';
import { growthOf } from '../../utils/change';
import { useCostGrowthStyles as useStyles } from '../../utils/styles';
import { formatPercent, formatCurrency } from '../../utils/formatters';
import { indefiniteArticleOf } from '../../utils/grammar';
import { useConfig, useCurrency } from '../../hooks';

export type CostGrowthProps = {
  change: ChangeStatistic;
  duration: Duration;
};

export const CostGrowth = ({ change, duration }: CostGrowthProps) => {
  const styles = useStyles();
  const { engineerCost } = useConfig();
  const [currency] = useCurrency();

  // Only display costs in absolute values
  const amount = Math.abs(change.amount);
  const ratio = Math.abs(change.ratio);

  const rate = rateOf(engineerCost, duration);
  const engineers = amount / rate;
  const converted = amount / (currency.rate ?? rate);

  // Determine if growth is significant enough to highlight
  const growth = growthOf(change.ratio, engineers);
  const classes = classnames({
    [styles.excess]: growth === GrowthType.Excess,
    [styles.savings]: growth === GrowthType.Savings,
  });

  const percent = formatPercent(ratio);

  let cost = `${percent} or ~${formatCurrency(converted, currency.unit)}`;
  // Always display the converted value but use the cost in engineers
  // to determine negligibility, as costs should be time-period aware
  if (engineers < EngineerThreshold) {
    cost = 'Negligible';
  } else if (currency.kind === CurrencyType.USD) {
    cost = `${percent} or ~${currency.prefix}${formatCurrency(converted)}`;
  } else if (amount < 1) {
    cost = `less than ${indefiniteArticleOf(['a', 'an'], currency.unit)}`;
  }

  return <span className={classes}>{cost}</span>;
};
