/*
 * Copyright 2021 Spotify AB
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
import { getPeriod } from '../utils';
import { makeStyles, Tooltip } from '@material-ui/core';

export const ChromeUXReportPeriod = () => {
  const info =
    'The CrUX dataset on BigQuery is updated on the second Tuesday of every month. Each release is numbered according to the year and calendar month of the data collection period, for example 201912 corresponds to the UX data collected during December 2019 and would be released on the second Tuesday of January 2020 after the data collection period has ended.';
  const useStyles = makeStyles(() => ({
    customWidth: {
      maxWidth: 600,
    },
  }));
  const classes = useStyles();

  return (
    <Tooltip title={info} classes={{ tooltip: classes.customWidth }}>
      <div
        className="period"
        style={{
          display: 'flex',
          position: 'absolute',
          zIndex: 99,
          alignItems: 'center',
          justifyContent: 'center',
          width: '95%',
          marginTop: '30px',
          fontSize: '25px',
          fontWeight: 'bold',
          color: 'grey',
        }}
      >
        {getPeriod()}
      </div>
    </Tooltip>
  );
};
