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
import {
  Content,
  ContentHeader,
  ResponseErrorPanel,
  SupportButton,
} from '@backstage/core-components';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { AlertNewModal } from '../Alert/AlertNewModal';
import { MissingAuthorizationHeaderError } from '../Errors';
import { AlertsTable } from './AlertsTable';

export const AlertsPage = () => {
  const [
    { tableState, states, alerts, alertsCount, isLoading, error },
    {
      onAlertStatesChange,
      onChangePage,
      onChangeRowsPerPage,
      onAlertChanged,
      refetchAlerts,
      setIsLoading,
    },
  ] = useAlerts(true);

  const [isModalOpened, setIsModalOpened] = React.useState(false);

  const handleCreateNewAlertClick = () => {
    setIsModalOpened(true);
  };

  if (error) {
    if (error.name === 'AuthenticationError') {
      return (
        <Content>
          <MissingAuthorizationHeaderError />
        </Content>
      );
    }

    return (
      <Content>
        <ResponseErrorPanel error={error} />
      </Content>
    );
  }

  return (
    <Content>
      <ContentHeader title="Alerts">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleCreateNewAlertClick}
        >
          Create Alert
        </Button>
        <AlertNewModal
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          refetchAlerts={refetchAlerts}
        />
        <SupportButton>
          This helps you to bring iLert into your developer portal.
        </SupportButton>
      </ContentHeader>
      <AlertsTable
        alerts={alerts}
        alertsCount={alertsCount}
        tableState={tableState}
        states={states}
        onAlertChanged={onAlertChanged}
        onAlertStatesChange={onAlertStatesChange}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Content>
  );
};
