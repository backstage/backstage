/*
 * Copyright 2023 The Backstage Authors
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
import { DateTime, Duration } from 'luxon';
import { BackstageTheme } from '@backstage/theme';
import {
  Chip,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import React from 'react';
import { definitions } from '../../api/types';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  listItemPrimary: {
    display: 'flex', // vertically align with chip
    fontWeight: 'bold',
  },
  warning: {
    borderColor: theme.palette.status.warning,
    color: theme.palette.status.warning,
    '& *': {
      color: theme.palette.status.warning,
    },
  },
  error: {
    borderColor: theme.palette.status.error,
    color: theme.palette.status.error,
    '& *': {
      color: theme.palette.status.error,
    },
  },
}));

// Single item in the list of on-going incidents.
export const IncidentListItem = ({
  baseUrl,
  incident,
}: {
  baseUrl: string;
  incident: definitions['IncidentV2ResponseBody'];
}) => {
  const classes = useStyles();
  const reportedAt = incident.incident_timestamp_values?.find(ts =>
    ts.incident_timestamp.name.match(/reported/i),
  );

  // If reported isn't here for some reason, use created at.
  const reportedAtDate = reportedAt?.value?.value || incident.created_at;

  const sinceReported =
    new Date().getTime() - new Date(reportedAtDate).getTime();
  const sinceReportedLabel = DateTime.local()
    .minus(Duration.fromMillis(sinceReported))
    .toRelative({ locale: 'en' });
  const lead = incident.incident_role_assignments.find(roleAssignment => {
    return roleAssignment.role.role_type === 'lead';
  });

  return (
    <ListItem dense key={incident.id}>
      <ListItemText
        primary={
          <>
            <Chip
              data-testid={`chip-${incident.incident_status.id}`}
              label={incident.incident_status.name}
              size="small"
              variant="outlined"
              className={
                ['live'].includes(incident.incident_status.category)
                  ? classes.error
                  : classes.warning
              }
            />
            {incident.reference} {incident.name}
          </>
        }
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.listItemPrimary,
        }}
        secondary={
          <Typography noWrap variant="body2" color="textSecondary">
            Reported {sinceReportedLabel} and{' '}
            {lead?.assignee
              ? `${lead.assignee.name} is lead`
              : 'the lead is unassigned'}
            .
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in incident.io" placement="top">
          <IconButton
            href={`${baseUrl}/incidents/${incident.id}`}
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
