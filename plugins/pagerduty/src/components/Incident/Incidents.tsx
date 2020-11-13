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
import { List, ListSubheader } from '@material-ui/core';
import { Incident } from '../types';
import { IncidentListItem } from './IncidentListItem';
import { IncidentsEmptyState } from './IncidentEmptyState';

type IncidentsProps = {
  incidents: Incident[];
};

export const Incidents = ({ incidents }: IncidentsProps) => (
  <List
    dense
    subheader={<ListSubheader>{incidents.length && 'INCIDENTS'}</ListSubheader>}
  >
    {incidents.length ? (
      incidents.map((incident, index) => (
        <IncidentListItem key={incident.id + index} incident={incident} />
      ))
    ) : (
      <IncidentsEmptyState />
    )}
  </List>
);
