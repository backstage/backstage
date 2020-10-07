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
import { MenuItem, Select, SelectProps } from '@material-ui/core';
import {
  formatLastTwoLookaheadQuarters,
  formatLastTwoMonths,
} from '../../utils/formatters';
import { Duration, findAlways } from '../../types';
import { useSelectStyles as useStyles } from '../../utils/styles';

export type PeriodOption = {
  value: Duration;
  label: string;
};

const LAST_6_MONTHS = 'Past 6 Months';
const LAST_60_DAYS = 'Past 60 Days';
const LAST_2_COMPLETED_MONTHS = formatLastTwoMonths();
const LAST_2_LOOKAHEAD_QUARTERS = formatLastTwoLookaheadQuarters();

export const DEFAULT_OPTIONS: PeriodOption[] = [
  {
    value: Duration.P90D,
    label: LAST_6_MONTHS,
  },
  {
    value: Duration.P30D,
    label: LAST_60_DAYS,
  },
  {
    value: Duration.P1M,
    label: LAST_2_COMPLETED_MONTHS,
  },
  {
    value: Duration.P3M,
    label: LAST_2_LOOKAHEAD_QUARTERS,
  },
];

type PeriodSelectProps = {
  duration: Duration;
  onSelect: (duration: Duration) => void;
  options?: PeriodOption[];
};

const PeriodSelect = ({
  duration,
  onSelect,
  options = DEFAULT_OPTIONS,
}: PeriodSelectProps) => {
  const classes = useStyles();

  const handleOnChange: SelectProps['onChange'] = e => {
    onSelect(e.target.value as Duration);
  };

  const renderValue: SelectProps['renderValue'] = value => {
    const option = findAlways(DEFAULT_OPTIONS, o => o.value === value);
    return <b>{option.label}</b>;
  };

  return (
    <Select
      className={classes.select}
      variant="outlined"
      onChange={handleOnChange}
      value={duration}
      renderValue={renderValue}
      data-testid="period-select"
    >
      {options.map(option => (
        <MenuItem
          className={classes.menuItem}
          key={option.value}
          value={option.value}
          data-testid={`period-select-option-${option.value}`}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PeriodSelect;
