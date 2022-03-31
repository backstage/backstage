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
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';

import { InfoCard, Progress } from '@backstage/core-components';
import { useAnalytics } from '@backstage/core-plugin-api';

import { Box, IconButton, Typography } from '@material-ui/core';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';

import {
  useCalendarsQuery,
  useEventsQuery,
  useSignIn,
  useStoredCalendars,
} from '../../hooks';
import calendarCardIcon from '../../icons/calendarIcon.svg';
import { CalendarEvent } from './CalendarEvent';
import { CalendarSelect } from './CalendarSelect';
import { SignInContent } from './SignInContent';
import { getStartDate } from './util';

export const CalendarCard = () => {
  const [date, setDate] = useState(DateTime.now());
  const analytics = useAnalytics();

  const changeDay = (offset = 1) => {
    setDate(prev => prev.plus({ day: offset }));
    analytics.captureEvent('click', 'change date');
  };

  const { isSignedIn, isInitialized, signIn } = useSignIn();

  useEffect(() => {
    signIn(true);
  }, [signIn]);

  const { isLoading: isCalendarLoading, data: calendars = [] } =
    useCalendarsQuery({
      enabled: isSignedIn,
    });
  const primaryCalendarId = calendars.find(c => c.primary === true)?.id;
  const defaultSelectedCalendars = primaryCalendarId ? [primaryCalendarId] : [];
  const [storedCalendars, setStoredCalendars] = useStoredCalendars(
    defaultSelectedCalendars,
  );

  const { events, isLoading: isEventLoading } = useEventsQuery({
    calendars,
    selectedCalendars: storedCalendars,
    enabled: isSignedIn && calendars.length > 0,
    timeMin: date.startOf('day').toISO(),
    timeMax: date.endOf('day').toISO(),
    timeZone: date.zoneName,
  });

  return (
    <InfoCard
      noPadding
      title={
        <Box display="flex" alignItems="center">
          <Box height={24} width={24} mr={1}>
            <img src={calendarCardIcon} alt="Google Calendar" />
          </Box>
          {isSignedIn ? (
            <>
              <IconButton onClick={() => changeDay(-1)} size="small">
                <PrevIcon />
              </IconButton>
              <IconButton onClick={() => changeDay(1)} size="small">
                <NextIcon />
              </IconButton>
              <Box mr={0.5} />
              <Typography variant="h6">
                {date.toLocaleString({
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>

              <Box flex={1} />

              <CalendarSelect
                calendars={calendars}
                selectedCalendars={storedCalendars}
                setSelectedCalendars={setStoredCalendars}
                disabled={isCalendarLoading || !isSignedIn}
              />
            </>
          ) : (
            <Typography variant="h6">Agenda</Typography>
          )}
        </Box>
      }
      deepLink={{
        link: 'https://calendar.google.com/',
        title: 'Go to Calendar',
      }}
    >
      <Box>
        {(isCalendarLoading || isEventLoading || !isInitialized) && (
          <Box pt={2} pb={2}>
            <Progress variant="query" />
          </Box>
        )}
        {!isSignedIn && isInitialized && (
          <SignInContent handleAuthClick={() => signIn(false)} />
        )}
        {!isEventLoading && !isCalendarLoading && isSignedIn && (
          <Box p={1} pb={0} maxHeight={602} overflow="auto">
            {events.length === 0 && (
              <Box pt={2} pb={2}>
                <Typography align="center" variant="h6">
                  No events
                </Typography>
              </Box>
            )}
            {sortBy(events, [getStartDate]).map(event => (
              <CalendarEvent
                key={`${event.calendarId}-${event.id}`}
                event={event}
              />
            ))}
          </Box>
        )}
      </Box>
    </InfoCard>
  );
};
