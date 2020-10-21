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

type Options = {
  method: string;
  headers: {
    'Content-Type': string;
    Accept: string;
  };
  body: string;
};

const request = async (
  url: string,
  options: Options,
): Promise<Response | Error> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const payload = await response.json();
    const errors = payload.errors.map((error: string) => error).join(' ');
    const message = `Request failed with ${response.status}, ${errors}`;

    throw new Error(message);
  }

  return await response.json();
};

export function triggerPagerDutyAlarm(
  integrationKey: string,
  source: string,
  description: string,
  userName: string,
) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify({
      event_action: 'trigger',
      routing_key: integrationKey,
      client: 'Backstage',
      client_url: source,
      payload: {
        summary: description,
        source: source,
        severity: 'error',
        class: 'manual trigger',
        custom_details: {
          user: userName,
        },
      },
    }),
  };

  return request('https://events.pagerduty.com/v2/enqueue', options);
}
