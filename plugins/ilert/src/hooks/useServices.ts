/*
 * Copyright 2021 The Backstage Authors
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
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import React from 'react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { GetServicesOpts, ilertApiRef, TableState } from '../api';
import { Service } from '../types';

export const useServices = (paging: boolean) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [tableState, setTableState] = React.useState<TableState>({
    page: 0,
    pageSize: 10,
  });

  const [servicesList, setServicesList] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchServicesCall = async () => {
    try {
      setIsLoading(true);
      const opts: GetServicesOpts = {};
      if (paging) {
        opts.maxResults = tableState.pageSize;
        opts.startIndex = tableState.page * tableState.pageSize;
      }
      const data = await ilertApi.fetchServices(opts);
      setServicesList(data || []);
      setIsLoading(false);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      setIsLoading(false);
      throw e;
    }
  };

  const fetchServices = useAsyncRetry(fetchServicesCall, [tableState]);

  const refetchServices = () => {
    setTableState({ ...tableState, page: 0 });
    Promise.all([fetchServicesCall()]);
  };

  const error = fetchServices.error;
  const retry = () => {
    fetchServices.retry();
  };

  const onChangePage = (page: number) => {
    setTableState({ ...tableState, page });
  };
  const onChangeRowsPerPage = (p: number) => {
    setTableState({ ...tableState, pageSize: p });
  };

  return [
    {
      tableState,
      services: servicesList,
      isLoading,
      error,
    },
    {
      setTableState,
      setServicesList,
      setIsLoading,
      retry,
      refetchServices,
      onChangePage,
      onChangeRowsPerPage,
    },
  ] as const;
};
