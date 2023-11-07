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
import React from 'react';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  hcpConsulApiRef,
  ServiceAggregateResp,
  ServiceAggregateRequest,
} from '../../api/api';
import { StructuredMetadataTable } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

type ServicesOverviewProps = {
  projectID: string;
};

export const ServicesOverview = ({ projectID }: ServicesOverviewProps) => {
  const config = useApi(configApiRef);
  const hcpConsulApi = useApi(hcpConsulApiRef);
  const organizationID = config.getString('consul.organizationID');

  const { value, loading, error } =
    useAsync(async (): Promise<ServiceAggregateResp> => {
      const request: ServiceAggregateRequest = {
        organizationID: organizationID,
        projectID: projectID,
      };

      const service = await hcpConsulApi.getAggrServiceSummary(request);
      return service;
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const metadata = {
    'Total Services': value?.total_services,
    'Total Service Instances': value?.total_service_instances,
    'Healthy Service Instances': value?.passing_service_instances,
    'Warning Service Instances': value?.warning_service_instances,
    'Critical Service Instances': value?.critical_service_instances,
  };

  return <StructuredMetadataTable metadata={metadata} />;
};
