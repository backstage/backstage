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
import { splunkOnCallApiRef, UnauthorizedError } from '../api';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import { TriggerDialog } from './TriggerDialog';
import { MissingTokenError } from './Errors/MissingTokenError';
import { User } from './types';

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

export const SPLUNK_ON_CALL_TEAM = 'splunk-on-call.com/team';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[SPLUNK_ON_CALL_TEAM]);

type Props = {
  entity: Entity;
};

export const SplunkOnCallCard = ({ entity }: Props) => {
  const classes = useStyles();
  const api = useApi(splunkOnCallApiRef);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const team = entity.metadata.annotations![SPLUNK_ON_CALL_TEAM];

  const handleRefresh = useCallback(() => {
    setRefreshIncidents(x => !x);
  }, []);

  const handleDialog = useCallback(() => {
    setShowDialog(x => !x);
  }, []);

  const { value: users, loading, error } = useAsync(async () => {
    const users = await api.getUsers();
    const usersHashMap = users.reduce(
      (map: Record<string, User>, obj: User) => {
        if (obj.username) {
          map[obj.username] = obj;
        }
        return map;
      },
      {},
    );
    return { usersHashMap, userList: users };
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
        title="Incidents"
        subheader={<HeaderIconLinkRow links={[triggerLink]} />}
      />
      <Divider />
      <CardContent>
        <Incidents team={team} refreshIncidents={refreshIncidents} />
        {users?.usersHashMap && (
          <EscalationPolicy team={team} users={users.usersHashMap} />
        )}
        {users && (
          <TriggerDialog
            users={users.userList}
            showDialog={showDialog}
            handleDialog={handleDialog}
            onIncidentCreated={handleRefresh}
          />
        )}
      </CardContent>
    </Card>
  );
};
