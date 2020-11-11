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
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  ListSubheader,
  Link,
  Typography,
} from '@material-ui/core';
import { StatusError, StatusWarning, StatusOK } from '@backstage/core';
import moment from 'moment';
import { Incident } from '../components/types';
import PagerdutyIcon from './Pd';

const useStyles = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgButtonImage: {
    height: '1em',
  },
  listItemPrimary: {
    fontWeight: 'bold',
  },
  listItemIcon: {
    minWidth: '1em',
  },
});

const IncidentsEmptyState = () => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>
        <div className={classes.denseListIcon}>
          <StatusOK />
        </div>
      </ListItemIcon>
      <ListItemText primary="No incidents" secondary="All clear!" />
    </ListItem>
  );
};

type IncidentListItemProps = {
  incident: Incident;
};

const IncidentListItem = ({ incident }: IncidentListItemProps) => {
  const classes = useStyles();
  const user = incident.assignments[0].assignee;
  return (
    <ListItem dense key={incident.id}>
      <ListItemIcon className={classes.listItemIcon}>
        <Tooltip title={incident.status} placement="top">
          <div className={classes.denseListIcon}>
            {incident.status === 'triggered' ? (
              <StatusError />
            ) : (
              <StatusWarning />
            )}
          </div>
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className={classes.listItemPrimary}>
            {incident.title}
          </Typography>
        }
        secondary={
          <span style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
            Created {moment(incident.created_at).fromNow()}, assigned to{' '}
            {(incident?.assignments[0]?.assignee?.summary && (
              <Link href={`mailto:${user.email}`}>{user.summary}</Link>
            )) ||
              'nobody'}
          </span>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in PagerDuty" placement="left">
          <IconButton
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <PagerdutyIcon viewBox="0 0 100 100" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type IncidentsProps = {
  incidents: Incident[];
};

export const Incidents = ({ incidents }: IncidentsProps) => (
  <List dense subheader={<ListSubheader>INCIDENTS</ListSubheader>}>
    {incidents.length ? (
      incidents.map((incident, index) => (
        <IncidentListItem key={incident.id + index} incident={incident} />
      ))
    ) : (
      <IncidentsEmptyState />
    )}
  </List>
);
