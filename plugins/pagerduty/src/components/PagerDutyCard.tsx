/*
 * Copyright 2020 Spotify AB
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
import React, { useState, useCallback } from 'react';
import { useApi, Progress, HeaderIconLinkRow } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Button,
  makeStyles,
  Card,
  CardHeader,
  Divider,
  CardContent,
} from '@material-ui/core';
import { Incidents } from './Incident';
import { EscalationPolicy } from './Escalation';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { pagerDutyApiRef, UnauthorizedError } from '../api';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import { TriggerDialog } from './TriggerDialog';
import { MissingTokenError } from './Errors/MissingTokenError';
import WebIcon from '@material-ui/icons/Web';

const useStyles = makeStyles({
  triggerAlarm: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
    lineHeight: 1.5,
    '&:hover, &:focus, &.focus': {
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
  },
});

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const PagerDutyCard = (_props: Props) => {
  const classes = useStyles();
  const { entity } = useEntity();
  const api = useApi(pagerDutyApiRef);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const integrationKey = entity.metadata.annotations![
    PAGERDUTY_INTEGRATION_KEY
  ];

  const handleRefresh = useCallback(() => {
    setRefreshIncidents(x => !x);
  }, []);

  const handleDialog = useCallback(() => {
    setShowDialog(x => !x);
  }, []);

  const { value: service, loading, error } = useAsync(async () => {
    const services = await api.getServiceByIntegrationKey(integrationKey);

    return {
      id: services[0].id,
      name: services[0].name,
      url: services[0].html_url,
      policyId: services[0].escalation_policy.id,
    };
  });

  if (error instanceof UnauthorizedError) {
    return <MissingTokenError />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error encountered while fetching information. {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <Progress />;
  }

  const serviceLink = {
    label: 'Service Directory',
    href: service!.url,
    icon: <WebIcon />,
  };

  const triggerLink = {
    label: 'Create Incident',
    action: (
      <Button
        data-testid="trigger-button"
        color="secondary"
        onClick={handleDialog}
        className={classes.triggerAlarm}
      >
        Create Incident
      </Button>
    ),
    icon: <AlarmAddIcon onClick={handleDialog} />,
  };

  return (
    <Card>
      <CardHeader
        title="PagerDuty"
        subheader={<HeaderIconLinkRow links={[serviceLink, triggerLink]} />}
      />
      <Divider />
      <CardContent>
        <Incidents
          serviceId={service!.id}
          refreshIncidents={refreshIncidents}
        />
        <EscalationPolicy policyId={service!.policyId} />
        <TriggerDialog
          showDialog={showDialog}
          handleDialog={handleDialog}
          name={entity.metadata.name}
          integrationKey={integrationKey}
          onIncidentCreated={handleRefresh}
        />
      </CardContent>
    </Card>
  );
};
