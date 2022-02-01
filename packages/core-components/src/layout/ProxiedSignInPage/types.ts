/*
 * Copyright 2021 The Backstage Authors
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

import {
  BackstageIdentityResponse,
  ProfileInfo,
} from '@backstage/core-plugin-api';
import { z } from 'zod';

export const proxiedSessionSchema = z.object({
  providerInfo: z.object({}).catchall(z.unknown()).optional(),
  profile: z.object({
    email: z.string().optional(),
    displayName: z.string().optional(),
    picture: z.string().optional(),
  }),
  backstageIdentity: z.object({
    token: z.string(),
    identity: z.object({
      type: z.literal('user'),
      userEntityRef: z.string(),
      ownershipEntityRefs: z.array(z.string()),
    }),
  }),
});

/**
 * Generic session information for proxied sign-in providers, e.g. common
 * reverse authenticating proxy implementations.
 *
 * @public
 */
export type ProxiedSession = {
  providerInfo?: { [key: string]: unknown };
  profile: ProfileInfo;
  backstageIdentity: Omit<BackstageIdentityResponse, 'id'>;
};
