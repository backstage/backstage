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
import { useQuery } from '@tanstack/react-query';

import { useApi } from '@backstage/core-plugin-api';

import { microsoftCalendarApiRef } from '../api';

type Options = {
  calendarId: string;
  timeMin: string;
  timeMax: string;
  enabled?: boolean;
  timeZone?: string;
  refreshTime?: number;
};

export const useEventsQuery = ({
  calendarId,
  enabled,
  timeMin,
  timeMax,
  timeZone,
}: Options) => {
  const calendarApi = useApi(microsoftCalendarApiRef);
  return useQuery(
    ['calendarEvents', calendarId, timeMin, timeMax, timeZone],
    async () => {
      const data = await calendarApi.getEvents(
        calendarId,
        {
          startDateTime: timeMin,
          endDateTime: timeMax,
        },
        {
          Prefer: `outlook.timezone="${timeZone}"`,
        },
      );
      return data;
    },
    {
      cacheTime: 300000,
      enabled,
      refetchInterval: 60000,
      refetchIntervalInBackground: true,
    },
  );
};
