/*
 * Copyright 2026 The Backstage Authors
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
import { createConnectionType } from '../system/createConnectionType';
import { z } from 'zod/v4';

/** @public */
export const GithubConnectionType = createConnectionType({
  type: 'github',
  title: 'GitHub',
  configSchema: z.object({
    host: z.string(),
    apiBaseUrl: z.string().optional(),
    rawBaseUrl: z.string().optional(),
  }),
  authMethods: [
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}),
    },
    {
      method: 'token',
      title: 'Token',
      configSchema: z.object({
        token: z.string(),
      }),
    },
    {
      method: 'app',
      title: 'GitHub App',
      configSchema: z.object({
        appId: z.union([z.number(), z.string()]),
        privateKey: z.string(),
        clientId: z.string(),
        clientSecret: z.string(),
        webhookSecret: z.string().optional(),
        publicAccess: z.boolean().optional(),
        orgs: z.array(z.string()).optional(),
      }),
    },
  ],
  matchAuth: (authMethods, query) => {
    const org = new URL(query).pathname
      .split('/')
      .filter(Boolean)[0]
      .toLocaleLowerCase();
    const apps = authMethods.filter(a => a.method === 'app');
    const appWithOrg = org ? apps.find(a => a.orgs?.includes(org)) : undefined;
    if (appWithOrg) return appWithOrg;

    const unrestrictedApp = apps.find(a => !a.orgs?.length);
    if (unrestrictedApp) return unrestrictedApp;

    if (apps.length === 1) return apps[0];

    return (
      authMethods.find(a => a.method === 'token') ??
      authMethods.find(a => a.method === 'none')
    );
  },
});
