/*
 * Copyright 2021 The Backstage Authors
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
import { makeStyles } from '@material-ui/core/styles';
import moment, { Moment } from 'moment';
import Alert from '@material-ui/lab/Alert';
import { Table, TableColumn, Progress } from '@backstage/core-components';

const useStyles = makeStyles({
  container: {
    overflow: 'auto',
    width: '100%',
    '& h5': {
      fontSize: '18px !important',
    },
    '& td': {
      minWidth: '145px',
    },
    '& th': {
      minWidth: '145px',
    },
  },
});

export const DenseTable = ({
  service,
  startDate,
  endDate,
}: {
  service: object;
  startDate: Moment;
  endDate: Moment;
}) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { field: 'healthiness', title: 'Healthiness' },
    { field: 'impacted', title: 'Impacted' },
    { field: 'incidents', title: 'Incidents' },
    { field: 'mttd', title: 'MTTD' },
    { field: 'mtta', title: 'MTTA' },
    { field: 'mttm', title: 'MTTM' },
    { field: 'mttr', title: 'MTTR' },
  ];

  return (
    <div className={classes.container}>
      <Table
        title="Incident Analytics"
        subtitle={`${startDate.format('ll')} - ${endDate.format('ll')}`}
        options={{ paging: false, search: false }}
        columns={columns}
        data={[service]}
      />
    </div>
  );
};

export const secondsToDhms = (seconds: number) => {
  const secs = Number(seconds);
  const d = Math.floor(secs / (60 * 60 * 24));
  const h = Math.floor((secs / (60 * 60)) % 24);
  const m = Math.floor((secs / 60) % 60);
  const s = secs % 60;

  const dDisplay = d > 0 ? `${d}d ` : '';
  const hDisplay = h > 0 ? `${h}h ` : '00h ';
  const mDisplay = m > 0 ? `${m}m ` : '00m ';
  const sDisplay = s > 0 ? `${s}s` : '00s';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

export const truncateNum = (num: number) => {
  const matcher = `^-?\\d+(?:\\.\\d{0,3})?`;
  const re = new RegExp(matcher);
  const match = num.toString().match(re);
  const result = (match && match[0]) || '0'; // eslint-disable-line no-mixed-operators
  return result;
};

export const calcHealthiness = ({
  mttm,
  incidents,
  range,
}: {
  mttm: number;
  incidents: number;
  range: number;
}) => {
  const num = (1 - (mttm * incidents) / range) * 100;
  return `${truncateNum(num)}%`;
};

type AnalyticsDataType = {
  id?: string;
  count?: number;
  mttd?: number;
  mtta?: number;
  mttm?: number;
  mttr?: number;
  total_time?: number;
};

export const ServiceAnalytics = ({
  value,
  loading,
  error,
}: {
  value: AnalyticsDataType;
  loading: boolean;
  error: any;
}) => {
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const startDate = moment().subtract(30, 'days').utc();
  const endDate = moment().utc();

  // Transform and format the data to display in the table
  if (value.id) {
    const serviceData = {
      healthiness:
        value.mttm && value.count
          ? calcHealthiness({
              mttm: value.mttm,
              incidents: value.count,
              range: endDate.diff(startDate, 'seconds'),
            })
          : '100%',
      impacted: value.total_time ? secondsToDhms(value.total_time) : '-',
      incidents: value.count,
      mttd: value.mttd ? secondsToDhms(value.mttd) : '-',
      mtta: value.mtta ? secondsToDhms(value.mtta) : '-',
      mttm: value.mttm ? secondsToDhms(value.mttm) : '-',
      mttr: value.mttr ? secondsToDhms(value.mttr) : '-',
    };

    return (
      <DenseTable
        service={serviceData}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }

  return null;
};
