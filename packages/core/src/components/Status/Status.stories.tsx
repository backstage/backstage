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
import {
  StatusError,
  StatusFailed,
  StatusNA,
  StatusOK,
  StatusPending,
  StatusRunning,
  StatusWarning,
} from './Status';
import Table from '../Table';
import InfoCard from '../../layout/InfoCard';

export default {
  title: 'Status',
  component: StatusOK,
};

const data = [
  {
    status: <StatusOK />,
    label: 'OK',
    usage: 'Deployment successful',
  },
  {
    status: <StatusWarning />,
    label: 'Warning',
    usage: 'CPU utilization at 90%',
  },
  {
    status: <StatusError />,
    label: 'Error',
    usage: 'Service could not be created',
  },
  {
    status: <StatusFailed />,
    label: 'Failed',
    usage: 'Build for PR #34 failed',
  },
  {
    status: <StatusPending />,
    label: 'Pending',
    usage: 'Job is waiting',
  },
  {
    status: <StatusRunning />,
    label: 'Running',
    usage: 'Job is running',
  },
  {
    status: <StatusNA />,
    label: 'N/A',
    usage: 'Not sure what to do',
  },
];

const columns = [
  { field: 'status', title: 'Status' },
  { field: 'label', title: 'Label' },
  { field: 'usage', title: 'Example usage' },
];

const containerStyle = { width: 600 };

export const Default = () => (
  <div style={containerStyle}>
    <InfoCard title="Available status types">
      <Table
        options={{
          search: false,
          paging: false,
          toolbar: false,
        }}
        data={data}
        columns={columns}
      />
    </InfoCard>
  </div>
);

export const statusOK = () => <StatusOK />;
export const statusWarning = () => <StatusWarning />;
export const statusError = () => <StatusError />;
export const statusFailed = () => <StatusFailed />;
export const statusPending = () => <StatusPending />;
export const statusRunning = () => <StatusRunning />;
export const statusNA = () => <StatusNA />;
