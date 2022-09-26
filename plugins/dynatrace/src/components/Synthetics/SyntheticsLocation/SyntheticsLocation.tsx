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
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Chip } from '@material-ui/core';
import { dynatraceApiRef } from '../../../api';

type SyntheticsLocationProps = {
  lastFailedTimestamp: Date;
  locationId: string;
  key: string;
};

const failedInLastXHours = (timestamp: Date, offset: number): boolean => {
  if (offset < 0 || offset > 24)
    throw new Error('offset must be between 0 and 24');
  return timestamp > new Date(new Date().getTime() - 1000 * 60 * 60 * offset);
};

const chipColor = (timestamp: Date): string => {
  if (failedInLastXHours(timestamp, 1)) {
    return 'salmon';
  }
  if (failedInLastXHours(timestamp, 6)) {
    return 'sandybrown';
  }
  if (failedInLastXHours(timestamp, 24)) {
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
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Chip
      label={`${value?.name}${
        failedInLastXHours(new Date(lastFailedTimestamp), 24)
          ? `: failed @ ${lastFailedTimestamp.toLocaleTimeString()}`
          : ''
      }`}
      size="medium"
      style={{ backgroundColor: chipColor(lastFailedTimestamp) }}
    />
  );
};
