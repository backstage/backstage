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
import { InfoCard } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { dynatraceApiRef } from '../../../api';
import { SyntheticsLocation } from '../SyntheticsLocation';

type SyntheticsCardProps = {
  syntheticsId: string;
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
  const { syntheticsId } = props;
  const configApi = useApi(configApiRef);
  const dynatraceApi = useApi(dynatraceApiRef);
  const dynatraceBaseUrl = configApi.getString('dynatrace.baseUrl');

  const { value, loading, error } = useAsync(async () => {
    return dynatraceApi.getDynatraceSyntheticFailures(syntheticsId);
  }, [dynatraceApi, syntheticsId]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const deepLinkPrefix = dynatraceMonitorPrefixes(
    `${syntheticsId.split('-')[0]}`,
  );

  const lastFailed = value?.locationsExecutionResults.map(l => {
    return {
      timestamp: l.requestResults[0].startTimestamp,
      location: Number(l.locationId).toString(16),
    };
  });

  return (
    <InfoCard
      title="Synthetics"
      subheader={`Recent Activity for Monitor ${syntheticsId}`}
      deepLink={{
        title: 'View this Synthetic in Dynatrace',
        link: `${dynatraceBaseUrl}/${deepLinkPrefix}/${syntheticsId}`,
      }}
    >
      {lastFailed?.map(l => {
        return (
          <SyntheticsLocation
            key={l.location}
            lastFailedTimestamp={new Date(l.timestamp)}
            locationId={l.location}
          />
        );
      })}
    </InfoCard>
  );
};
