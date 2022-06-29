/*
 * Copyright 2022 The Backstage Authors
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
import useAsync from 'react-use/lib/useAsync';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useApi } from '@backstage/core-plugin-api';
import { Chip } from '@material-ui/core';
import { dynatraceApiRef } from '../../../api';

type SyntheticsLocationProps = {
  lastFailedTimestamp: Date;
  locationId: string;
  key: string;
};

const failedInLast24Hours = (timestamp: Date): Boolean => {
  return timestamp > new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
};

const failedInLast6Hours = (timestamp: Date): Boolean => {
  return timestamp > new Date(new Date().getTime() - 1000 * 60 * 60 * 6);
};

const failedinLastHour = (timestamp: Date): Boolean => {
  return timestamp > new Date(new Date().getTime() - 1000 * 60 * 60);
};

const chipColor = (timestamp: Date): string => {
  if (failedinLastHour(timestamp)) {
    return 'salmon';
  }
  if (failedInLast6Hours(timestamp)) {
    return 'sandybrown';
  }
  if (failedInLast24Hours(timestamp)) {
    return 'palegoldenrod';
  }
  return 'lightgreen';
};

export const SyntheticsLocation = (props: SyntheticsLocationProps) => {
  const { lastFailedTimestamp, locationId } = props;
  const dynatraceApi = useApi(dynatraceApiRef);
  const { value, loading, error } = useAsync(async () => {
    return dynatraceApi.getDynatraceSyntheticLocationInfo(
      `SYNTHETIC_LOCATION-00000000000000${locationId}`,
    );
  });

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Chip
      label={`${value?.name}${
        failedInLast24Hours(new Date(lastFailedTimestamp))
          ? `: failed @ ${lastFailedTimestamp.toLocaleTimeString('en-CA')}`
          : ''
      }`}
      size="medium"
      style={{ backgroundColor: chipColor(lastFailedTimestamp) }}
    />
  );
};
