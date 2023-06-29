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
import {
  Progress,
  ResponseErrorPanel,
  EmptyState,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { ProblemsTable } from '../ProblemsTable';
import { dynatraceApiRef, DynatraceProblem } from '../../../api';
import { InfoCard } from '@backstage/core-components';

type ProblemsListProps = {
  dynatraceEntityId: string;
};

const cardContents = (
  problems: DynatraceProblem[],
  dynatraceBaseUrl: string,
) => {
  return problems.length ? (
    <ProblemsTable
      problems={problems || []}
      dynatraceBaseUrl={dynatraceBaseUrl}
    />
  ) : (
    <EmptyState title="No Problems to Report!" missing="data" />
  );
};

const dynatraceEntityPrefixes = (idPrefix: string): string => {
  switch (idPrefix) {
    case 'APPLICATION':
      return '#uemapplications/uemappmetrics;uemapplicationId=';

    case 'SERVICE':
      return '#services/serviceOverview;id=';

    case `MOBILE_APPLICATION`:
      return '#mobileappoverview;appID=';

    case 'SYNTHETIC_TEST':
      return 'ui/browser-monitor/';

    case 'KUBERNETES_CLUSTER':
      return 'ui/kubernetes/';

    case 'PROCESS_GROUP_INSTANCE':
      return '#processdetails;id=';

    default:
      return 'ui/entity/';
  }
};

export const ProblemsList = (props: ProblemsListProps) => {
  const { dynatraceEntityId } = props;
  const configApi = useApi(configApiRef);
  const dynatraceApi = useApi(dynatraceApiRef);
  const dynatraceBaseUrl = configApi.getString('dynatrace.baseUrl');

  const { value, loading, error } = useAsync(async () => {
    return dynatraceApi.getDynatraceProblems(dynatraceEntityId);
  }, [dynatraceApi, dynatraceEntityId]);
  const problems = value?.problems;

  const deepLinkPrefix = dynatraceEntityPrefixes(
    `${dynatraceEntityId.split('-')[0]}`,
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  return (
    <InfoCard
      title="Problems"
      subheader={`Last 2 hours - ${dynatraceEntityId}`}
      deepLink={{
        title: 'View Entity in Dynatrace',
        link: `${dynatraceBaseUrl}/${deepLinkPrefix}${dynatraceEntityId}`,
      }}
    >
      {cardContents(problems || [], dynatraceBaseUrl)}
    </InfoCard>
  );
};
