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
import useAsync from 'react-use/lib/useAsync';
import {
  Service,
  ServiceInstance,
  ListServiceInstancesRequest,
  hcpConsulApiRef,
  HcpConsulApi,
} from '../../api/api';
import { useApi } from '@backstage/core-plugin-api';
import { PaginationButtonComponent } from '../common/PaginationButtonComponent';
import { INSTANCES_PER_PAGE } from '../../constants';

const serviceInstanesColumns: TableColumn<ServiceInstance>[] = [
  {
    title: 'id',
    highlight: true,
    render: (row: ServiceInstance) => row.id,
  },
  {
    title: 'node',
    render: (row: ServiceInstance) => row.node,
  },
  {
    title: 'address',
    render: (row: ServiceInstance) => row.address,
  },
  {
    title: 'status',
    render: (row: ServiceInstance) => row.status,
  },
];

export const ServiceInstancesComponent = (props: { service: Service }) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);

  const [services, setServices] = useState<ServiceInstance[]>([]);
  const [prevToken, setPrevToken] = useState('');
  const [nextToken, setNextToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useAsync(async () => {
    await listAndSetServiceInstances(
      hcpConsulApi,
      props.service,
      INSTANCES_PER_PAGE,
      '',
      '',
      setServices,
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
    listAndSetServiceInstances(
      hcpConsulApi,
      props.service,
      INSTANCES_PER_PAGE,
      '',
      nextToken,
      setServices,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };
  const handlePrevClick = async () => {
    listAndSetServiceInstances(
      hcpConsulApi,
      props.service,
      INSTANCES_PER_PAGE,
      prevToken,
      '',
      setServices,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };

  return (
    <div>
      <Table
        title="Service Instances"
        data={services || []}
        columns={serviceInstanesColumns}
        options={{ search: false, paging: false }}
      />
      <PaginationButtonComponent
        prevToken={prevToken}
        nextToken={nextToken}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
    </div>
  );
};

async function listAndSetServiceInstances(
  hcpConsulApi: HcpConsulApi,
  service: Service,
  pageSize: number,
  prevToken: string,
  nextToken: string,
  setServices: React.Dispatch<React.SetStateAction<ServiceInstance[]>>,
  setPrevToken: React.Dispatch<React.SetStateAction<string>>,
  setNextToken: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
) {
  const request: ListServiceInstancesRequest = {
    cluster_resource_name: service.cluster_resource_name,
    service_name: service.name,
    namespace: service.namespace,
    partition: service.partition,
    pagination: {
      page_size: pageSize,
      next_page_token: nextToken,
      previous_page_token: prevToken,
    },
  };

  setLoading(true);
  try {
    const services = await hcpConsulApi.listServiceInstances(request);

    setServices(services.data);
    setNextToken(services.pagination.next_page_token);
    setPrevToken(services.pagination.previous_page_token);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
}
