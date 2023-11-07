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
import { Grid } from '@material-ui/core';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  ListServiceRequest,
  Service,
  hcpConsulApiRef,
  HcpConsulApi,
} from '../../api/api';
import { useApi } from '@backstage/core-plugin-api';

import { ServiceInstancesComponent } from './ServiceInstancesComponent';
import { ServiceDetailsCard } from './ServiceDetailsCard';
import { PaginationButtonComponent } from '../common/PaginationButtonComponent';
import { SERVICES_PER_PAGE } from '../../constants';

type ServicesTableProps = {
  services: Service[];
};

export const ServicesTable = ({ services }: ServicesTableProps) => {
  const columns: TableColumn<Service>[] = [
    { title: 'Service', field: 'name' },
    { title: 'Cluster', field: 'cluster_id' },
    { title: 'Namespace', field: 'namespace' },
    { title: 'Partition', field: 'partition' },
  ];

  return (
    <Table
      title="Services List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={services}
      detailPanel={rowData => {
        return (
          <div>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={4}>
                <ServiceDetailsCard service={rowData.rowData} />
              </Grid>
              <Grid item xs={8}>
                <ServiceInstancesComponent service={rowData.rowData} />
              </Grid>
            </Grid>
          </div>
        );
      }}
    />
  );
};

type ServiceListTableComponentProps = {
  projectID: string;
};

export const ServiceListTableComponent = ({
  projectID,
}: ServiceListTableComponentProps) => {
  const hcpConsulApi = useApi(hcpConsulApiRef);
  const projectResourceName = `project/${projectID}`;

  const [services, setServices] = useState<Service[]>([]);
  const [prevToken, setPrevToken] = useState('');
  const [nextToken, setNextToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useAsync(async () => {
    await listAndSetServices(
      hcpConsulApi,
      projectResourceName,
      SERVICES_PER_PAGE,
      '',
      '',
      [],
      setServices,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  }, []);

  const handleNextClick = async () => {
    await listAndSetServices(
      hcpConsulApi,
      projectResourceName,
      SERVICES_PER_PAGE,
      '',
      nextToken,
      [],
      setServices,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };
  const handlePrevClick = async () => {
    await listAndSetServices(
      hcpConsulApi,
      projectResourceName,
      SERVICES_PER_PAGE,
      prevToken,
      '',
      [],
      setServices,
      setPrevToken,
      setNextToken,
      setLoading,
      setError,
    );
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <div>
      <ServicesTable services={services} />
      <PaginationButtonComponent
        prevToken={prevToken}
        nextToken={nextToken}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
    </div>
  );
};

export async function listAndSetServices(
  hcpConsulApi: HcpConsulApi,
  projectResourceName: string,
  pageSize: number,
  prevToken: string,
  nextToken: string,
  status: string[],
  setServices: React.Dispatch<React.SetStateAction<Service[]>>,
  setPrevToken: React.Dispatch<React.SetStateAction<string>>,
  setNextToken: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<any>>,
) {
  const request: ListServiceRequest = {
    project_resource_name: projectResourceName,
    status: status,
    pagination: {
      page_size: pageSize,
      next_page_token: nextToken,
      previous_page_token: prevToken,
    },
  };

  setLoading(true);
  try {
    const services = await hcpConsulApi.listServices(request);
    setServices(services.data);
    setNextToken(services.pagination.next_page_token);
    setPrevToken(services.pagination.previous_page_token);
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
}
