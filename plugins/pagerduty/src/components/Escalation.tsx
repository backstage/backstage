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
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import EmailIcon from '@material-ui/icons/Email';
import { StatusWarning } from '@backstage/core';
import { OnCall } from './types';
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
});

const EscalationUser = ({ user }: OnCall) => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>
        <Avatar alt="User" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography className={classes.listItemPrimary}>
            {user.name}
          </Typography>
        }
        secondary={user.email}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Send e-mail to user" placement="left">
          <IconButton href={`mailto:${user.email}`}>
            <EmailIcon color="primary" />
          </IconButton>
        </Tooltip>
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

const EscalationUsersEmptyState = () => {
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemIcon>
        <div className={classes.denseListIcon}>
          <StatusWarning />
        </div>
      </ListItemIcon>
      <ListItemText primary="Empty escalation policy" />
    </ListItem>
  );
};

type EscalationPolicyProps = {
  escalation: OnCall[];
};

export const EscalationPolicy = ({ escalation }: EscalationPolicyProps) => (
  <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
    {escalation.length ? (
      escalation.map((item, index) => (
        <EscalationUser key={item.user.id + index} user={item.user} />
      ))
    ) : (
      <EscalationUsersEmptyState />
    )}
  </List>
);
