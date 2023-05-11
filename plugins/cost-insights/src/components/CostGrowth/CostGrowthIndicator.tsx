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
import classnames from 'classnames';
import { Typography, TypographyProps } from '@material-ui/core';
import { default as ArrowDropUp } from '@material-ui/icons/ArrowDropUp';
import { default as ArrowDropDown } from '@material-ui/icons/ArrowDropDown';
import { growthOf } from '../../utils/change';
import { GrowthType } from '../../types';
import { useCostGrowthStyles as useStyles } from '../../utils/styles';
import { ChangeStatistic, Maybe } from '@backstage/plugin-cost-insights-common';
import { useConfig } from '../../hooks';

/** @public */
export type CostGrowthIndicatorProps = TypographyProps & {
  change: ChangeStatistic;
  formatter?: (
    change: ChangeStatistic,
    options?: { absolute: boolean },
  ) => Maybe<string>;
};

/** @public */
export const CostGrowthIndicator = (props: CostGrowthIndicatorProps) => {
  const { engineerThreshold } = useConfig();
  const { change, formatter, className, ...extraProps } = props;

  const classes = useStyles();

  const growth = growthOf(change, engineerThreshold);

  const classNames = classnames(classes.indicator, className, {
    [classes.excess]: growth === GrowthType.Excess,
    [classes.savings]: growth === GrowthType.Savings,
  });

  return (
    <Typography className={classNames} component="span" {...extraProps}>
      {formatter ? formatter(change, { absolute: true }) : change.ratio}
      {growth === GrowthType.Excess && <ArrowDropUp aria-label="excess" />}
      {growth === GrowthType.Savings && <ArrowDropDown aria-label="savings" />}
    </Typography>
  );
};
