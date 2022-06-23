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
import { InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Typography } from '@material-ui/core';
import { dynatraceApiRef } from '../../../api';

type SyntheticsCardProps = {
  syntheticsIds: string;
  dynatraceBaseUrl: string;
};

const dynatraceMonitorPrefixes = (idPrefix: string): string => {
  switch (idPrefix) {
    case 'HTTP_CHECK':
      return 'ui/http-monitor';
    case 'BROWSER_MONITOR':
      return 'ui/browser-monitor';
    case 'SYNTHETIC_TEST':
      return 'ui/browser-monitor';
    default:
      throw new Error('Invalid synthetic Id');
  }
};

export const SyntheticsCard = (props: SyntheticsCardProps) => {
  const { syntheticsIds, dynatraceBaseUrl } = props;
  const dynatraceApi = useApi(dynatraceApiRef);
  const { value, loading, error } = useAsync(async () => {
    return dynatraceApi.getDynatraceSyntheticFailures(syntheticsIds);
  }, [dynatraceApi, syntheticsIds]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const deepLinkPrefix = dynatraceMonitorPrefixes(
    `${syntheticsIds.match(/(.+)-/)![1]}`,
  );
  const timestamps = value?.locationsExecutionResults.map(l => {
    return l.requestResults[0].startTimestamp;
  });

  return (
    <InfoCard
      title="Synthetics"
      subheader="Recent Activity"
      deepLink={{
        title: 'View Synthetics in Dynatrace',
        link: `${dynatraceBaseUrl}/${deepLinkPrefix}/${syntheticsIds}`,
      }}
    >
      <Typography>
        Locations: {JSON.stringify(value?.locationsExecutionResults.length)}
      </Typography>
      <Typography>
        Last Failures:{' '}
        {JSON.stringify(
          timestamps?.map(t => {
            return new Date(t).toString();
          }),
        )}
      </Typography>
    </InfoCard>
  );
};
