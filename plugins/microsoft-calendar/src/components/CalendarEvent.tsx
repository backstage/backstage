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
import classnames from 'classnames';
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import React, { useState } from 'react';

import { Link } from '@backstage/core-components';

import {
  Box,
  Paper,
  Popover,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';

import webcamIcon from '../icons/webcam.svg';
import { CalendarEventPopoverContent } from './CalendarEventPopoverContent';
import { MicrosoftCalendarEvent } from '../api';
import {
  getOnlineMeetingLink,
  getTimePeriod,
  isAllDay,
  isPassed,
} from './util';

const useStyles = makeStyles(
  theme => ({
    event: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      cursor: 'pointer',
      paddingRight: 12,
    },
    declined: {
      textDecoration: 'line-through',
    },
    passed: {
      opacity: 0.6,
      transition: 'opacity 0.15s ease-in-out',
      '&:hover': {
        opacity: 1,
      },
    },
    link: {
      width: 48,
      height: 48,
      display: 'inline-block',
      padding: 8,
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
    },
    calendarColor: {
      width: 8,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
  }),
  {
    name: 'MicrosoftCalendarEvent',
  },
);

export const CalendarEvent = ({ event }: { event: MicrosoftCalendarEvent }) => {
  const classes = useStyles();
  const popoverState = usePopupState({
    variant: 'popover',
    popupId: event.id,
    disableAutoFocus: true,
  });
  const [hovered, setHovered] = useState(false);
  const onlineMeetingLink = getOnlineMeetingLink(event);

  const { onClick, ...restBindProps } = bindTrigger(popoverState);

  return (
    <>
      <Paper
        onClick={e => {
          onClick(e);
        }}
        {...restBindProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        elevation={hovered ? 4 : 1}
        className={classnames(classes.event, {
          [classes.passed]: isPassed(event),
        })}
        data-testid="microsoft-calendar-event"
      >
        <Box className={classes.calendarColor} mr={1} alignSelf="stretch" />
        <Box flex={1} pt={1} pb={1}>
          <Typography
            variant="subtitle2"
            className={classnames({ [classes.declined]: event.isCancelled })}
          >
            {event.subject}
          </Typography>
          {!isAllDay(event) && (
            <Typography variant="body2" data-testid="calendar-event-time">
              {getTimePeriod(event)}
            </Typography>
          )}
        </Box>

        {event.isOnlineMeeting && (
          <Tooltip title="Join Online Meeting">
            <Link
              data-testid="calendar-event-online-meeting-link"
              className={classes.link}
              to={onlineMeetingLink}
              onClick={e => {
                e.stopPropagation();
              }}
              noTrack
            >
              {/* we can use onlineMeetingProvider to show icon accordingly */}
              <img
                height={32}
                width={32}
                src={webcamIcon}
                alt="Online Meeting link"
              />
            </Link>
          </Tooltip>
        )}
      </Paper>

      <Popover
        {...bindPopover(popoverState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        data-testid="calendar-event-popover"
      >
        <CalendarEventPopoverContent event={event} />
      </Popover>
    </>
  );
};
