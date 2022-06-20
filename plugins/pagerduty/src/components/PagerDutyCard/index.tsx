/*
 * Copyright 2020 The Backstage Authors
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
import React, { ReactNode, useState, useCallback } from 'react';
import { Entity } from '@backstage/catalog-model';
import { Card, CardHeader, Divider, CardContent } from '@material-ui/core';
import { Incidents } from '../Incident';
import { EscalationPolicy } from '../Escalation';
import useAsync from 'react-use/lib/useAsync';
import { Alert } from '@material-ui/lab';
import { pagerDutyApiRef, UnauthorizedError } from '../../api';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import { MissingTokenError, ServiceNotFoundError } from '../Errors';
import WebIcon from '@material-ui/icons/Web';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { PAGERDUTY_INTEGRATION_KEY, PAGERDUTY_SERVICE_ID } from '../constants';
import { TriggerDialog } from '../TriggerDialog';
import { ChangeEvents } from '../ChangeEvents';

import { useApi } from '@backstage/core-plugin-api';
import { NotFoundError } from '@backstage/errors';
import {
  Progress,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  TabbedCard,
  CardTab,
  InfoCard,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getPagerDutyEntity } from '../pagerDutyEntity';

const BasicCard = ({ children }: { children: ReactNode }) => (
  <InfoCard title="PagerDuty">{children}</InfoCard>
);

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(
    entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY] ||
      entity.metadata.annotations?.[PAGERDUTY_SERVICE_ID],
  );

export const PagerDutyCard = () => {
  const { entity } = useEntity();
  const pagerDutyEntity = getPagerDutyEntity(entity);
  const api = useApi(pagerDutyApiRef);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const [refreshChangeEvents, setRefreshChangeEvents] =
    useState<boolean>(false);
  const [dialogShown, setDialogShown] = useState<boolean>(false);

  const showDialog = useCallback(() => {
    setDialogShown(true);
  }, [setDialogShown]);
  const hideDialog = useCallback(() => {
    setDialogShown(false);
  }, [setDialogShown]);

  const handleRefresh = useCallback(() => {
    setRefreshIncidents(x => !x);
    setRefreshChangeEvents(x => !x);
  }, []);

  const {
    value: service,
    loading,
    error,
  } = useAsync(async () => {
    const { service: foundService } = await api.getServiceByEntity(entity);

    return {
      id: foundService.id,
      name: foundService.name,
      url: foundService.html_url,
      policyId: foundService.escalation_policy.id,
      policyLink: foundService.escalation_policy.html_url,
    };
  });

  if (error) {
    let errorNode: ReactNode;

    switch (error.constructor) {
      case UnauthorizedError:
        errorNode = <MissingTokenError />;
        break;
      case NotFoundError:
        errorNode = <ServiceNotFoundError />;
        break;
      default:
        errorNode = (
          <Alert severity="error">
            Error encountered while fetching information. {error.message}
          </Alert>
        );
    }

    return <BasicCard>{errorNode}</BasicCard>;
  }

  if (loading) {
    return (
      <BasicCard>
        <Progress />
      </BasicCard>
    );
  }

  const serviceLink: IconLinkVerticalProps = {
    label: 'Service Directory',
    href: service!.url,
    icon: <WebIcon />,
  };

  /**
   * In order to create incidents using the REST API, a valid user email address must be present.
   * There is no guarantee the current user entity has a valid email association, so instead just
   * only allow triggering incidents when an integration key is present.
   */
  const createIncidentDisabled = !pagerDutyEntity.integrationKey;
  const triggerLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    onClick: showDialog,
    icon: <AlarmAddIcon />,
    color: 'secondary',
    disabled: createIncidentDisabled,
    title: createIncidentDisabled
      ? 'Must provide an integration-key to create incidents'
      : '',
  };

  const escalationPolicyLink: IconLinkVerticalProps = {
    label: 'Escalation Policy',
    href: service!.policyLink,
    icon: <DateRangeIcon />,
  };

  return (
    <>
      <Card data-testid="pagerduty-card">
        <CardHeader
          title="PagerDuty"
          subheader={
            <HeaderIconLinkRow
              links={[serviceLink, triggerLink, escalationPolicyLink]}
            />
          }
        />
        <Divider />
        <CardContent>
          <TabbedCard>
            <CardTab label="Incidents">
              <Incidents
                serviceId={service!.id}
                refreshIncidents={refreshIncidents}
              />
            </CardTab>
            <CardTab label="Change Events">
              <ChangeEvents
                serviceId={service!.id}
                refreshEvents={refreshChangeEvents}
              />
            </CardTab>
          </TabbedCard>
          <EscalationPolicy policyId={service!.policyId} />
        </CardContent>
      </Card>
      {!createIncidentDisabled && (
        <TriggerDialog
          data-testid="trigger-dialog"
          showDialog={dialogShown}
          handleDialog={hideDialog}
          onIncidentCreated={handleRefresh}
        />
      )}
    </>
  );
};
