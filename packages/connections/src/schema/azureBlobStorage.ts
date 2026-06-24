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
export const AzureBlobStorageConnectionType = createConnectionType({
  type: 'azure-blob-storage',
  title: 'Azure Blob Storage',
  configSchema: z.object({
    host: z.string(),
    accountName: z.string().optional(),
    endpoint: z.string().optional(),
    endpointSuffix: z.string().optional(),
  }),
  authMethods: [
    {
      method: 'none',
      configSchema: z.object({}),
    },
    {
      method: 'accountKey',
      configSchema: z.object({
        accountKey: z.string(),
      }),
    },
    {
      method: 'sasToken',
      configSchema: z.object({
        sasToken: z.string(),
      }),
    },
    {
      method: 'connectionString',
      configSchema: z.object({
        connectionString: z.string(),
      }),
    },
    {
      method: 'aadCredential',
      configSchema: z.object({
        clientId: z.string(),
        tenantId: z.string(),
        clientSecret: z.string(),
      }),
    },
  ],
});
