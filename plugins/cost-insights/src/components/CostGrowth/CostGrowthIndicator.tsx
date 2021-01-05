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
import { Typography, TypographyProps } from '@material-ui/core';
import { default as ArrowDropUp } from '@material-ui/icons/ArrowDropUp';
import { default as ArrowDropDown } from '@material-ui/icons/ArrowDropDown';
import { growthOf } from '../../utils/change';
import { GrowthType } from '../../types';
import { useCostGrowthStyles as useStyles } from '../../utils/styles';

export type CostGrowthIndicatorProps = TypographyProps & {
  ratio: number;
  amount?: number;
  formatter?: (amount: number) => string;
};

export const CostGrowthIndicator = ({
  ratio,
  amount,
  formatter,
  className,
  ...props
}: CostGrowthIndicatorProps) => {
  const classes = useStyles();
  const growth = growthOf(ratio, amount);

  const classNames = classnames(classes.indicator, className, {
    [classes.savings]: growth === GrowthType.Savings,
    [classes.excess]: growth === GrowthType.Excess,
  });

  // Display cost as a factor of engineer cost growth and percentage growth
  if (typeof amount === 'number') {
    return (
      <Typography className={classNames} component="span" {...props}>
        {formatter ? formatter(amount) : amount}
        {growth === GrowthType.Savings && (
          <ArrowDropDown aria-label="savings" />
        )}
        {growth === GrowthType.Excess && <ArrowDropUp aria-label="excess" />}
      </Typography>
    );
  }

  // Display cost as a factor of percent change
  return (
    <Typography className={classNames} component="span" {...props}>
      {formatter ? formatter(ratio) : ratio}
      {ratio < 0 && <ArrowDropDown aria-label="savings" />}
      {ratio > 0 && <ArrowDropUp aria-label="excess" />}
    </Typography>
  );
};
