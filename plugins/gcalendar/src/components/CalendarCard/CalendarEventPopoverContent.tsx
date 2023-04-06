/*
 * Copyright 2022 The Backstage Authors
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
import { sortBy } from 'lodash';
import React from 'react';
import DOMPurify from 'dompurify';

import { useAnalytics } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { AttendeeChip } from './AttendeeChip';
import { GCalendarEvent } from '../../api';
import { getTimePeriod, getZoomLink } from './util';

const useStyles = makeStyles(
  theme => {
    return {
      description: {
        wordBreak: 'break-word',
        '& a': {
          color: theme.palette.primary.main,
          fontWeight: 500,
        },
      },
      divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },
    };
  },
  {
    name: 'GCalendarEventPopoverContent',
  },
);

type CalendarEventPopoverProps = {
  event: GCalendarEvent;
};

export const CalendarEventPopoverContent = ({
  event,
}: CalendarEventPopoverProps) => {
  const classes = useStyles({ event });
  const analytics = useAnalytics();
  const zoomLink = getZoomLink(event);

  return (
    <Box display="flex" flexDirection="column" width={400} p={2}>
      <Box display="flex" alignItems="center">
        <Box flex={1}>
          <Typography variant="h6">{event.summary}</Typography>
          <Typography variant="subtitle2">{getTimePeriod(event)}</Typography>
        </Box>
        {event.htmlLink && (
          <Tooltip title="Open in Calendar">
            <Link
              data-testid="open-calendar-link"
              to={event.htmlLink}
              onClick={_e =>
                analytics.captureEvent('click', 'open in calendar')
              }
              noTrack
            >
              <IconButton>
                <ArrowForwardIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </Box>
      {zoomLink && (
        <Link
          to={zoomLink}
          onClick={_e => analytics.captureEvent('click', 'zoom link')}
          noTrack
        >
          Join Zoom Meeting
        </Link>
      )}

      {event.description && (
        <>
          <Divider className={classes.divider} variant="fullWidth" />
          <Box
            className={classes.description}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event.description, {
                USE_PROFILES: { html: true },
              }),
            }}
          />
        </>
      )}

      {event.attendees && (
        <>
          <Divider className={classes.divider} variant="fullWidth" />
          <Box>
            <Typography variant="subtitle2">Attendees</Typography>
            <Box mb={1} />
            {sortBy(event.attendees || [], 'email').map(user => (
              <AttendeeChip key={user.email} user={user} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
