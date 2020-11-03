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

const API_URL = 'https://api.pagerduty.com';
const EVENTS_API_URL = 'https://events.pagerduty.com/v2';

type Options = {
  method: string;
  headers: {
    'Content-Type': string;
    Accept: string;
    Authorization?: string;
  };
  body?: string;
};

const request = async (
  url: string,
  options: any, //Options,
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

const getByUrl = async (url: string, token: string) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${token}`,
      Accept: 'application/vnd.pagerduty+json;version=2',
      'Content-Type': 'application/json',
    },
  };
  return await request(url, options);
};

export const getServiceByIntegrationKey = async (
  integrationKey: string,
  token: string,
) => {
  const response = await getByUrl(
    `${API_URL}/services?include[]=integrations&include[]=escalation_policies&query=${integrationKey}`,
    token,
  );
  if (response.services.length > 1) {
    throw new Error('More than one service in response');
  }
  return response.services[0];
};

export const getIncidentsByServiceId = async (
  serviceId: string,
  token: string,
) => {
  return await getByUrl(
    `${API_URL}/incidents?service_ids[]=${serviceId}`,
    token,
  );
};

export const getOncallByPolicyId = async (policyId: string, token: string) => {
  return await getByUrl(
    `${API_URL}/oncalls?include[]=users&escalation_policy_ids[]=${policyId}`,
    token,
  );
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

  return request(`${EVENTS_API_URL}/enqueue`, options);
}
