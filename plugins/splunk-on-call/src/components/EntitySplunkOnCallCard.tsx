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
import React, { useCallback, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import WebIcon from '@material-ui/icons/Web';
import { Alert } from '@material-ui/lab';
import { splunkOnCallApiRef, UnauthorizedError } from '../api';
import { MissingApiKeyOrApiIdError } from './Errors/MissingApiKeyOrApiIdError';
import { EscalationPolicy } from './Escalation';
import { Incidents } from './Incident';
import { TriggerDialog } from './TriggerDialog';
import { Team, User } from './types';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

import {
  EmptyState,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';

export const SPLUNK_ON_CALL_TEAM = 'splunk.com/on-call-team';
export const SPLUNK_ON_CALL_ROUTING_KEY = 'splunk.com/on-call-routing-key';

export const MissingAnnotation = () => (
  <div>
    <Typography>
      The Splunk On Call plugin requires setting either the{' '}
      <code>{SPLUNK_ON_CALL_TEAM}</code> or the{' '}
      <code>{SPLUNK_ON_CALL_ROUTING_KEY}</code> annotation.
    </Typography>
    <MissingAnnotationEmptyState annotation={SPLUNK_ON_CALL_TEAM} />
  </div>
);

export const InvalidAnnotation = ({
  teamName,
  routingKey,
}: {
  teamName: string | undefined;
  routingKey: string | undefined;
}) => {
  let titleSuffix = 'provided annotation';

  if (routingKey) {
    titleSuffix = `"${routingKey}" routing key`;
  }

  if (teamName) {
    titleSuffix = `"${teamName}" team name`;
  }

  return (
    <Card>
      <CardHeader title="Splunk On-Call" />
      <CardContent>
        <EmptyState
          title={`Splunk On-Call API returned no record of teams associated with the ${titleSuffix}`}
          missing="info"
          description="Escalation Policy and incident information unavailable. Splunk On-Call requires a valid team name or routing key."
        />
      </CardContent>
    </Card>
  );
};

export const MissingEventsRestEndpoint = () => (
  <CardContent>
    <EmptyState
      title="No Splunk On-Call REST endpoint available."
      missing="info"
      description="You need to add a valid REST endpoint to your 'app-config.yaml' if you want to enable Splunk On-Call."
    />
  </CardContent>
);

export const isSplunkOnCallAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[SPLUNK_ON_CALL_TEAM]) ||
  Boolean(entity.metadata.annotations?.[SPLUNK_ON_CALL_ROUTING_KEY]);

const useStyles = makeStyles({
  onCallCard: {
    marginBottom: '1em',
  },
});

/** @public */
export type EntitySplunkOnCallCardProps = {
  readOnly?: boolean;
};

/** @public */
export const EntitySplunkOnCallCard = (props: EntitySplunkOnCallCardProps) => {
  const { readOnly } = props;
  const classes = useStyles();
  const config = useApi(configApiRef);
  const api = useApi(splunkOnCallApiRef);
  const { entity } = useEntity();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const teamAnnotation = entity
    ? entity.metadata.annotations![SPLUNK_ON_CALL_TEAM]
    : undefined;
  const routingKeyAnnotation = entity
    ? entity.metadata.annotations![SPLUNK_ON_CALL_ROUTING_KEY]
    : undefined;

  const eventsRestEndpoint =
    config.getOptionalString('splunkOnCall.eventsRestEndpoint') || null;

  const handleRefresh = useCallback(() => {
    setRefreshIncidents(x => !x);
  }, []);

  const handleDialog = useCallback(() => {
    setShowDialog(x => !x);
  }, []);

  const {
    value: usersAndTeams,
    loading,
    error,
  } = useAsync(async () => {
    const allUsers = await api.getUsers();
    const usersHashMap = allUsers.reduce(
      (map: Record<string, User>, obj: User) => {
        if (obj.username) {
          map[obj.username] = obj;
        }
        return map;
      },
      {},
    );
    const teams = await api.getTeams();
    let foundTeams = [
      teams.find(teamValue => teamValue.name === teamAnnotation),
    ].filter(team => team !== undefined);

    if (!foundTeams.length && routingKeyAnnotation) {
      const routingKeys = await api.getRoutingKeys();
      const foundRoutingKey = routingKeys.find(
        key => key.routingKey === routingKeyAnnotation,
      );
      foundTeams = foundRoutingKey
        ? foundRoutingKey.targets
            .map(target => {
              const teamUrlParts = target._teamUrl.split('/');
              const teamSlug = teamUrlParts[teamUrlParts.length - 1];

              return teams.find(teamValue => teamValue.slug === teamSlug);
            })
            .filter(team => team !== undefined)
        : [];
    }

    return { usersHashMap, foundTeams };
  });

  if (!teamAnnotation && !routingKeyAnnotation) {
    return <MissingAnnotation />;
  }

  if (!eventsRestEndpoint) {
    return <MissingEventsRestEndpoint />;
  }

  if (error instanceof UnauthorizedError) {
    return <MissingApiKeyOrApiIdError />;
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

  if (!usersAndTeams?.foundTeams || !usersAndTeams?.foundTeams.length) {
    return (
      <InvalidAnnotation
        teamName={teamAnnotation}
        routingKey={routingKeyAnnotation}
      />
    );
  }

  const Content = ({
    team,
    usersHashMap,
  }: {
    team: Team | undefined;
    usersHashMap: any;
  }) => {
    const teamName = team?.name ?? '';

    return (
      <>
        <Incidents
          readOnly={readOnly || false}
          team={teamName}
          refreshIncidents={refreshIncidents}
        />
        {usersHashMap && team && (
          <EscalationPolicy team={teamName} users={usersHashMap} />
        )}
        <TriggerDialog
          team={teamName}
          showDialog={showDialog}
          handleDialog={handleDialog}
          onIncidentCreated={handleRefresh}
        />
      </>
    );
  };

  const triggerLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    onClick: handleDialog,
    color: 'secondary',
    icon: <AlarmAddIcon />,
  };

  const serviceLink = {
    label: 'Portal',
    href: 'https://portal.victorops.com/',
    icon: <WebIcon />,
  };

  const teams = usersAndTeams?.foundTeams || [];

  return (
    <>
      {teams.map((team, i) => (
        <Card key={i} className={classes.onCallCard}>
          <CardHeader
            title="Splunk On-Call"
            subheader={[
              <Typography key="team_name">
                Team: {team && team.name ? team.name : ''}
              </Typography>,
              <HeaderIconLinkRow
                key="incident_trigger"
                links={!readOnly ? [serviceLink, triggerLink] : [serviceLink]}
              />,
            ]}
          />
          <Divider />
          <CardContent>
            <Content team={team} usersHashMap={usersAndTeams?.usersHashMap} />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
