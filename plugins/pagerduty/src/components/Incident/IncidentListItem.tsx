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
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import { StatusError, StatusWarning } from '@backstage/core';
import { formatDistanceToNowStrict } from 'date-fns';
import { Incident } from '../types';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

const useStyles = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemPrimary: {
    fontWeight: 'bold',
  },
  listItemIcon: {
    minWidth: '1em',
  },
});

type Props = {
  incident: Incident;
};

export const IncidentListItem = ({ incident }: Props) => {
  const classes = useStyles();
  const user = incident.assignments[0]?.assignee;
  const createdAt = formatDistanceToNowStrict(new Date(incident.created_at));

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
        primary={incident.title}
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.listItemPrimary,
        }}
        secondary={
          <Typography noWrap variant="body2" color="textSecondary">
            Created {createdAt} ago and assigned to{' '}
            <Link
              href={user?.html_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user?.summary ?? 'nobody'}
            </Link>
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in PagerDuty" placement="top">
          <IconButton
            href={incident.html_url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <OpenInBrowserIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
