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
export const AwsS3ConnectionType = createConnectionType({
  type: 'aws-s3',
  title: 'AWS S3',
  configSchema: z.object({
    host: z.string(),
    endpoint: z.string().optional(),
    s3ForcePathStyle: z.boolean().optional(),
  }),
  authMethods: [
    {
      method: 'none',
      configSchema: z.object({}),
    },
    {
      method: 'accessKey',
      configSchema: z.object({
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
      }),
    },
    {
      method: 'assumeRole',
      configSchema: z.object({
        roleArn: z.string(),
        externalId: z.string().optional(),
      }),
    },
  ],
});
