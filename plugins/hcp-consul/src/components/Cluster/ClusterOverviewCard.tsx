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
import { ListClustersRequest, Cluster } from '../../api/api';
import { useApi } from '@backstage/core-plugin-api';
import { StructuredMetadataTable } from '@backstage/core-components';
import { hcpConsulApiRef } from '../../api/api';

type ClusterOverviewCardProps = {
  projectID: string;
};

export const ClusterOverviewCard = ({
  projectID,
}: ClusterOverviewCardProps) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Cluster[]> => {
    // TODO: Should fetch all clusters
    const request: ListClustersRequest = {
      projectID: projectID,
      pagination: {
        page_size: 50,
      },
    };

    const clusters = await hcpConsulApi.listClusters(request);
    return clusters.data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const clusters = value || [];

  const totalCount = clusters.length;
  let selfManaged = 0;
  let hcpManaged = 0;
  let running = 0;
  let pending = 0;
  let disconnected = 0;

  clusters.forEach(cluster => {
    if (cluster.type === 'hcp_managed') {
      hcpManaged++;
    } else {
      selfManaged++;
    }

    if (cluster.state === 'running') {
      running++;
    } else if (cluster.state === 'disconnected') {
      disconnected++;
    } else if (cluster.state === 'pending') {
      pending++;
    }
  });

  const metadata = {
    'Total Clusters': totalCount,
    'Hashicorp managed clusters': hcpManaged,
    'Self managed clusters': selfManaged,
    Running: running,
    Pending: pending,
    Disconnected: disconnected,
  };

  return <StructuredMetadataTable metadata={metadata} />;
};
