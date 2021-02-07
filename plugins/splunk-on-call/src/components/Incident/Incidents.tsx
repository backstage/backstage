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

import React, { useEffect } from 'react';
import { List, ListSubheader } from '@material-ui/core';
import { IncidentListItem } from './IncidentListItem';
import { IncidentsEmptyState } from './IncidentEmptyState';
import { useAsyncFn } from 'react-use';
import { splunkOnCallApiRef } from '../../api';
import { useApi, Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';

type Props = {
  refreshIncidents: boolean;
  team: string;
};

export const Incidents = ({ refreshIncidents, team }: Props) => {
  const api = useApi(splunkOnCallApiRef);

  const [{ value: incidents, loading, error }, getIncidents] = useAsyncFn(
    async () => {
      const allIncidents = await api.getIncidents();
      const teams = await api.getTeams();
      const teamSlug = teams.find(teamValue => teamValue.name === team)?.slug;
      const filteredIncidents = teamSlug
        ? allIncidents.filter(incident =>
            incident.pagedTeams?.includes(teamSlug),
          )
        : [];
      return filteredIncidents;
    },
  );

  useEffect(() => {
    getIncidents();
  }, [refreshIncidents, getIncidents]);

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

  if (!incidents?.length) {
    return <IncidentsEmptyState />;
  }

  return (
    <List dense subheader={<ListSubheader>INCIDENTS</ListSubheader>}>
      {incidents!.map((incident, index) => (
        <IncidentListItem
          onIncidentAction={() => getIncidents()}
          key={index}
          incident={incident}
        />
      ))}
    </List>
  );
};
