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
import { GetAlertsOpts, ilertApiRef, TableState } from '../api';
import { ACCEPTED, Alert, AlertSource, AlertStatus, PENDING } from '../types';

export const useAlerts = (
  paging: boolean,
  singleSource?: boolean,
  alertSource?: AlertSource | null,
) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [tableState, setTableState] = React.useState<TableState>({
    page: 0,
    pageSize: 10,
  });
  const [states, setStates] = React.useState<AlertStatus[]>([
    ACCEPTED,
    PENDING,
  ]);
  const [alertsList, setAlertsList] = React.useState<Alert[]>([]);
  const [alertsCount, setAlertsCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAlertsCall = async () => {
    try {
      if (singleSource && !alertSource) {
        return;
      }
      setIsLoading(true);
      const opts: GetAlertsOpts = {
        states,
        alertSources: alertSource ? [alertSource.id] : [],
      };
      if (paging) {
        opts.maxResults = tableState.pageSize;
        opts.startIndex = tableState.page * tableState.pageSize;
      }
      const data = await ilertApi.fetchAlerts(opts);
      setAlertsList(data || []);
      setIsLoading(false);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      setIsLoading(false);
      throw e;
    }
  };

  const fetchAlertsCountCall = async () => {
    try {
      const count = await ilertApi.fetchAlertsCount({ states });
      setAlertsCount(count || 0);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const fetchAlerts = useAsyncRetry(fetchAlertsCall, [
    tableState,
    states,
    singleSource,
    alertSource,
  ]);

  const refetchAlerts = () => {
    setTableState({ ...tableState, page: 0 });
    Promise.all([fetchAlertsCall(), fetchAlertsCountCall()]);
  };

  const fetchAlertsCount = useAsyncRetry(fetchAlertsCountCall, [states]);

  const error = fetchAlerts.error || fetchAlertsCount.error;
  const retry = () => {
    fetchAlerts.retry();
    fetchAlertsCount.retry();
  };

  const onAlertChanged = (newAlert: Alert) => {
    let shouldRefetchAlerts = false;
    setAlertsList(
      alertsList.reduce((acc: Alert[], alert: Alert) => {
        if (newAlert.id === alert.id) {
          if (states.includes(newAlert.status)) {
            acc.push(newAlert);
          } else {
            shouldRefetchAlerts = true;
          }
          return acc;
        }
        acc.push(alert);
        return acc;
      }, []),
    );
    if (shouldRefetchAlerts) {
      refetchAlerts();
    }
  };

  const onChangePage = (page: number) => {
    setTableState({ ...tableState, page });
  };
  const onChangeRowsPerPage = (p: number) => {
    setTableState({ ...tableState, pageSize: p });
  };
  const onAlertStatesChange = (s: AlertStatus[]) => {
    setStates(s);
  };

  return [
    {
      tableState,
      states,
      alerts: alertsList,
      alertsCount,
      error,
      isLoading,
    },
    {
      setTableState,
      setStates,
      setAlertsList,
      setIsLoading,
      retry,
      onAlertChanged,
      refetchAlerts,
      onChangePage,
      onChangeRowsPerPage,
      onAlertStatesChange,
    },
  ] as const;
};
