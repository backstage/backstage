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
import { Select, MenuItem } from '@material-ui/core';
import { Maybe, Metric, findAlways } from '../../types';
import { useSelectStyles as useStyles } from '../../utils/styles';
import { NULL_METRIC } from '../../hooks/useConfig';

export type MetricSelectProps = {
  metric: Maybe<string>;
  metrics: Array<Metric>;
  onSelect: (metric: Maybe<string>) => void;
};

const MetricSelect = ({ metric, metrics, onSelect }: MetricSelectProps) => {
  const classes = useStyles();

  const handleOnChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (e.target.value === NULL_METRIC) {
      onSelect(null);
    } else {
      onSelect(e.target.value as string);
    }
  };

  const renderValue = (value: unknown) => {
    const kind = (value === NULL_METRIC ? null : value) as Maybe<string>;
    const { name } = findAlways(metrics, m => m.kind === kind);
    return <b>{name}</b>;
  };

  return (
    <Select
      className={classes.select}
      variant="outlined"
      value={metric || NULL_METRIC}
      renderValue={renderValue}
      onChange={handleOnChange}
    >
      {metrics.map((m: Metric) => (
        <MenuItem
          className={classes.menuItem}
          key={m.kind || NULL_METRIC}
          value={m.kind || NULL_METRIC}
        >
          {m.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MetricSelect;
