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
import React, { useState } from 'react';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import {
  hcpConsulApiRef,
  ListClustersRequest,
  Cluster,
  GetClusterRequest,
  ClusterDetails,
  HcpConsulApi,
} from '../../api/api';
import { useApi } from '@backstage/core-plugin-api';
import { StructuredMetadataTable, InfoCard } from '@backstage/core-components';
import { PaginationButtonComponent } from '../common/PaginationButtonComponent';
import { CLUSTERS_PER_PAGE } from '../../constants';

const cardContentStyle = { width: 500 };

type ClusterDetailsComponentrops = {
  resource_name: string;
};

const ClusterDetailsComponent = ({
  resource_name,
}: ClusterDetailsComponentrops) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);

  const { value, loading, error } =
    useAsync(async (): Promise<ClusterDetails> => {
      const request: GetClusterRequest = {
        cluster_resource_name: resource_name,
      };

      const cluster = await hcpConsulApi.getCluster(request);
      return cluster.data;
    }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const metadata = {
    node_count: value?.summary.node_count,
    server_count: value?.summary.server_count,
    service_count: value?.summary.service_count,
    service_passing: value?.summary.service_passing,
    service_warning: value?.summary.service_warning,
    service_critical: value?.summary.service_critical,
    client_count: value?.summary.client_count,
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item>
        <InfoCard className="center">
          <div style={cardContentStyle}>
            <StructuredMetadataTable metadata={metadata} />
          </div>
        </InfoCard>
      </Grid>
    </Grid>
  );
};

type ClustersTableViewProps = {
  clusters: Cluster[];
};

const ClustersTableView = ({ clusters }: ClustersTableViewProps) => {
  const columns: TableColumn<Cluster>[] = [
    { title: 'Name', field: 'name' },
    { title: 'State', field: 'state' },
    { title: 'Type', field: 'type' },
  ];

  return (
    <Table
      title="Clusters List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={clusters}
      detailPanel={rowData => {
        return (
          <ClusterDetailsComponent
            resource_name={rowData.rowData.resource_name}
          />
        );
      }}
    />
  );
};

type ClusterTableProps = {
  projectID: string;
};

export const ClusterTable = ({ projectID }: ClusterTableProps) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [prevToken, setPrevToken] = useState('');
  const [nextToken, setNextToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useAsync(async () => {
    await listAndSetClusters(
      hcpConsulApi,
      projectID,
      CLUSTERS_PER_PAGE,
      '',
      '',
      setClusters,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const handleNextClick = async () => {
    listAndSetClusters(
      hcpConsulApi,
      projectID,
      CLUSTERS_PER_PAGE,
      '',
      nextToken,
      setClusters,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };
  const handlePrevClick = async () => {
    listAndSetClusters(
      hcpConsulApi,
      projectID,
      CLUSTERS_PER_PAGE,
      prevToken,
      '',
      setClusters,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };

  return (
    <div>
      <ClustersTableView clusters={clusters || []} />
      <PaginationButtonComponent
        prevToken={prevToken}
        nextToken={nextToken}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
    </div>
  );
};

async function listAndSetClusters(
  hcpConsulApi: HcpConsulApi,
  projectID: string,
  pageSize: number,
  prevToken: string,
  nextToken: string,
  setClusters: React.Dispatch<React.SetStateAction<Cluster[]>>,
  setPrevToken: React.Dispatch<React.SetStateAction<string>>,
  setNextToken: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
) {
  const request: ListClustersRequest = {
    projectID: projectID,
    pagination: {
      page_size: pageSize,
      next_page_token: nextToken,
      previous_page_token: prevToken,
    },
  };

  setLoading(true);
  try {
    const clusters = await hcpConsulApi.listClusters(request);

    setClusters(clusters.data);
    setNextToken(clusters.pagination.next_page_token);
    setPrevToken(clusters.pagination.previous_page_token);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
}
