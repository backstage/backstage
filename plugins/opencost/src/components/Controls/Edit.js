/*
 * Copyright 2023 The Backstage Authors
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

import { makeStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import React from 'react';

import SelectWindow from '../SelectWindow';

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
  },
  formControl: {
    margin: 8,
    minWidth: 120,
  },
});

function EditControl({
  windowOptions,
  window,
  setWindow,
  aggregationOptions,
  aggregateBy,
  setAggregateBy,
  accumulateOptions,
  accumulate,
  setAccumulate,
  currencyOptions,
  currency,
  setCurrency,
}) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <SelectWindow
        windowOptions={windowOptions}
        window={window}
        setWindow={setWindow}
      />
      <FormControl className={classes.formControl}>
        <InputLabel id="aggregation-select-label">Breakdown</InputLabel>
        <Select
          id="aggregation-select"
          value={aggregateBy}
          onChange={e => {
            setAggregateBy(e.target.value);
          }}
        >
          {aggregationOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="accumulate-label">Resolution</InputLabel>
        <Select
          id="accumulate"
          value={accumulate}
          onChange={e => setAccumulate(e.target.value)}
        >
          {accumulateOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          id="currency"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        >
          {currencyOptions?.map(currencyVal => (
            <MenuItem key={currencyVal} value={currencyVal}>
              {currencyVal}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default React.memo(EditControl);
