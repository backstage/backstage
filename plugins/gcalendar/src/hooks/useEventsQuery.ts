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
import { compact, unescape } from 'lodash';
import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import { useApi } from '@backstage/core-plugin-api';

import { gcalendarApiRef, GCalendar, GCalendarEvent } from '../api';

type Options = {
  selectedCalendars?: string[];
  timeMin: string;
  timeMax: string;
  enabled: boolean;
  calendars: GCalendar[];
  timeZone: string;
  refreshTime?: number;
};

export const useEventsQuery = ({
  selectedCalendars = [],
  calendars = [],
  enabled,
  timeMin,
  timeMax,
  timeZone,
}: Options) => {
  const calendarApi = useApi(gcalendarApiRef);
  const eventQueries = useQueries({
    queries: selectedCalendars
      .filter(id => calendars.find(c => c.id === id))
      .map(calendarId => {
        const calendar = calendars.find(c => c.id === calendarId);

        return {
          queryKey: ['calendarEvents', calendarId, timeMin, timeMax],
          enabled,
          initialData: [],
          refetchInterval: 60000,
          refetchIntervalInBackground: true,

          queryFn: async (): Promise<GCalendarEvent[]> => {
            const data = await calendarApi.getEvents(calendarId, {
              calendarId,
              timeMin,
              timeMax,
              showDeleted: false,
              singleEvents: true,
              maxResults: 100,
              orderBy: 'startTime',
              timeZone,
            });

            return (data.items || []).map(event => {
              const responseStatus = event.attendees?.find(
                a => !!a.self,
              )?.responseStatus;

              return {
                ...event,
                summary: unescape(event.summary || ''),
                calendarId,
                backgroundColor: calendar?.backgroundColor,
                primary: !!calendar?.primary,
                responseStatus,
              };
            });
          },
        };
      }),
  });

  const events = useMemo(
    () => compact(eventQueries.map(({ data }) => data).flat()),
    [eventQueries],
  );

  const isLoading =
    !!eventQueries.find(q => q.isFetching) && events.length === 0;

  return { events, isLoading };
};
