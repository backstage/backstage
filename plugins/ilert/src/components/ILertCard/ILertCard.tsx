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
import { Entity } from '@backstage/catalog-model';
import { ResponseErrorPanel } from '@backstage/core-components';
import { AuthenticationError } from '@backstage/errors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { ILERT_INTEGRATION_KEY_ANNOTATION } from '../../constants';
import { useILertEntity } from '../../hooks';
import { useAlerts } from '../../hooks/useAlerts';
import { useAlertSource } from '../../hooks/useAlertSource';
import { AlertNewModal } from '../Alert/AlertNewModal';
import { AlertsTable } from '../AlertsPage';
import { MissingAuthorizationHeaderError } from '../Errors';
import { ILertCardActionsHeader } from './ILertCardActionsHeader';
import { ILertCardEmptyState } from './ILertCardEmptyState';
import { ILertCardHeaderStatus } from './ILertCardHeaderStatus';
import { ILertCardMaintenanceModal } from './ILertCardMaintenanceModal';
import { ILertCardOnCall } from './ILertCardOnCall';

/** @public */
export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ILERT_INTEGRATION_KEY_ANNOTATION]);

const useStyles = makeStyles({
  content: {
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingBottom: '0 !important',
    paddingTop: '0 !important',
    '& div div': {
      boxShadow: 'none !important',
    },
  },
});

/** @public */
export const ILertCard = () => {
  const classes = useStyles();
  const { integrationKey, name } = useILertEntity();
  const [{ alertSource }, { setAlertSource, refetchAlertSource }] =
    useAlertSource(integrationKey);
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
  ] = useAlerts(false, true, alertSource);

  const [isNewAlertModalOpened, setIsNewAlertModalOpened] =
    React.useState(false);
  const [isMaintenanceModalOpened, setIsMaintenanceModalOpened] =
    React.useState(false);

  if (error) {
    if (error instanceof AuthenticationError) {
      return <MissingAuthorizationHeaderError />;
    }

    return <ResponseErrorPanel error={error} />;
  }

  if (!integrationKey) {
    return <ILertCardEmptyState />;
  }

  return (
    <>
      <Card data-testid="ilert-card">
        <CardHeader
          title="iLert"
          subheader={
            <ILertCardActionsHeader
              alertSource={alertSource}
              setAlertSource={setAlertSource}
              setIsNewAlertModalOpened={setIsNewAlertModalOpened}
              setIsMaintenanceModalOpened={setIsMaintenanceModalOpened}
            />
          }
          action={<ILertCardHeaderStatus alertSource={alertSource} />}
        />
        <Divider />
        <CardContent className={classes.content}>
          <ILertCardOnCall alertSource={alertSource} />
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
            compact
          />
        </CardContent>
      </Card>
      <AlertNewModal
        isModalOpened={isNewAlertModalOpened}
        setIsModalOpened={setIsNewAlertModalOpened}
        refetchAlerts={refetchAlerts}
        initialAlertSource={alertSource}
        entityName={name}
      />
      <ILertCardMaintenanceModal
        alertSource={alertSource}
        refetchAlertSource={refetchAlertSource}
        isModalOpened={isMaintenanceModalOpened}
        setIsModalOpened={setIsMaintenanceModalOpened}
      />
    </>
  );
};
