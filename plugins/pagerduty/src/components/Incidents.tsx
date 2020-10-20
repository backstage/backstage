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
} from '@material-ui/core';
import { StatusError, StatusWarning, StatusOK } from '@backstage/core';
import Pagerduty from './pd.svg';
import moment from 'moment';

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

type IncidentListProps = {
  incidents: any;
};

const IncidentList = ({ incidents }: IncidentListProps) => {
  const classes = useStyles();
  return incidents.map((incident: any) => (
    <ListItem key={incident.id}>
      <ListItemIcon>
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
        primary={incident.title}
        secondary={
          <span style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
            Created {moment(incident.createdAt).fromNow()}, assigned to{' '}
            {(incident.assignees.length && incident.assignees[0].name) ||
              'nobody'}
          </span>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in PagerDuty" placement="left">
          <IconButton
            href={incident.homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={Pagerduty}
              alt="View in PagerDuty"
              className={classes.svgButtonImage}
            />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  ));
};

type IncidentsProps = {
  incidents: Array<any>;
};

export const Incidents = ({ incidents }: IncidentsProps) => (
  <List dense subheader={<ListSubheader>Incidents</ListSubheader>}>
    {incidents.length ? (
      <IncidentList incidents={incidents} />
    ) : (
      <IncidentsEmptyState />
    )}
  </List>
);
