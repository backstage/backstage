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
import { GetStatusPagesOpts, ilertApiRef, TableState } from '../api';
import { StatusPage } from '../types';

export const useStatusPages = (paging: boolean) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [tableState, setTableState] = React.useState<TableState>({
    page: 0,
    pageSize: 10,
  });

  const [statusPagesList, setStatusPagesList] = React.useState<StatusPage[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchStatusPagesCall = async () => {
    try {
      setIsLoading(true);
      const opts: GetStatusPagesOpts = {};
      if (paging) {
        opts.maxResults = tableState.pageSize;
        opts.startIndex = tableState.page * tableState.pageSize;
      }
      const data = await ilertApi.fetchStatusPages(opts);
      setStatusPagesList(data || []);
      setIsLoading(false);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      setIsLoading(false);
      throw e;
    }
  };

  const fetchStatusPages = useAsyncRetry(fetchStatusPagesCall, [tableState]);

  const refetchStatusPages = () => {
    setTableState({ ...tableState, page: 0 });
    Promise.all([fetchStatusPagesCall()]);
  };

  const error = fetchStatusPages.error;
  const retry = () => {
    fetchStatusPages.retry();
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
      statusPages: statusPagesList,
      isLoading,
      error,
    },
    {
      setTableState,
      setStatusPagesList,
      setIsLoading,
      retry,
      refetchStatusPages,
      onChangePage,
      onChangeRowsPerPage,
    },
  ] as const;
};
