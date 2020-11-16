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
import React from 'react';
import { useApi, EmptyState } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';
import { Incidents } from './Incident';
import { EscalationPolicy } from './Escalation';
import { TriggerButton } from './TriggerButton';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { pagerDutyApiRef, UnauthorizedError } from '../api';
import { IconLinkVertical } from '@backstage/plugin-catalog';
import PagerDutyIcon from './PagerDutyIcon';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
}));

export const PAGERDUTY_INTEGRATION_KEY = 'pagerduty.com/integration-key';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[PAGERDUTY_INTEGRATION_KEY]);

type Props = {
  entity: Entity;
};

export const PagerDutyCard = ({ entity }: Props) => {
  const classes = useStyles();
  const api = useApi(pagerDutyApiRef);

  const { value, loading, error } = useAsync(async () => {
    const integrationKey = entity.metadata.annotations![
      PAGERDUTY_INTEGRATION_KEY
    ];

    const services = await api.getServiceByIntegrationKey(integrationKey);
    const incidents = await api.getIncidentsByServiceId(services[0].id);
    const oncalls = await api.getOnCallByPolicyId(
      services[0].escalation_policy.id,
    );
    const users = oncalls.map(oncall => oncall.user);

    return {
      incidents,
      users,
      id: services[0].id,
      name: services[0].name,
      homepageUrl: services[0].html_url,
    };
  });

  if (error) {
    if (error instanceof UnauthorizedError) {
      return (
        <EmptyState
          missing="info"
          title="Missing or invalid PagerDuty Token"
          description="The request to fetch data need a valid token. See README for more details."
        />
      );
    }

    return (
      <Alert severity="error">
        Error encountered while fetching information. {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <LinearProgress />;
  }

  const pagerdutyLink = {
    title: 'View in PagerDuty',
    href: value!.homepageUrl,
  };

  const triggerAlarm = {
    title: 'Trigger Alarm',
    action: <TriggerButton entity={entity} />,
  };

  return (
    <Card>
      <CardHeader
        title="PagerDuty"
        subheader={
          <nav className={classes.links}>
            <IconLinkVertical
              label={pagerdutyLink.title}
              href={pagerdutyLink.href}
              icon={<PagerDutyIcon viewBox="0 0 100 100" />}
            />
            <IconLinkVertical
              label={triggerAlarm.title}
              icon={<ReportProblemIcon />}
              action={triggerAlarm.action}
            />
          </nav>
        }
      />
      <Divider />
      <CardContent>
        <Incidents incidents={value!.incidents} />
        <EscalationPolicy users={value!.users} />
      </CardContent>
    </Card>
  );
};
