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
import { Service, hcpConsulApiRef, GetServiceRequest } from '../../api/api';
import { StructuredMetadataTable, InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const ServiceDetailsCard = (props: { service: Service }) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Service> => {
    const request: GetServiceRequest = {
      cluster_resource_name: props.service.cluster_resource_name,
      service_name: props.service.name,
      namespace: props.service.namespace,
      partition: props.service.partition,
    };

    const service = await hcpConsulApi.getService(request);
    return service.data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const metadata = {
    namespace: value?.namespace,
    partition: value?.partition,
    tags: value?.tags,
    kind: value?.kind,
    instance_count: value?.instance_count,
    checks_critical: value?.checks_critical,
    checks_passing: value?.checks_passing,
    checks_warning: value?.checks_warning,
  };

  return (
    <InfoCard className="center">
      <StructuredMetadataTable metadata={metadata} />
    </InfoCard>
  );
};
