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

import { z } from 'zod/v3';
import {
  AuthorizeResult,
  ConditionalPolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  ApplyConditionsRequestEntry,
  ApplyConditionsResponseEntry,
} from '@backstage/plugin-permission-node';
import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';

const responseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      result: z.union([
        z.literal(AuthorizeResult.ALLOW),
        z.literal(AuthorizeResult.DENY),
        z.array(
          z.union([
            z.literal(AuthorizeResult.ALLOW),
            z.literal(AuthorizeResult.DENY),
          ]),
        ),
      ]),
    }),
  ),
});

export type ResourcePolicyDecision = ConditionalPolicyDecision & {
  resourceRef: string;
};

/**
 * @internal
 */
export class PermissionIntegrationClient {
  private readonly discovery: DiscoveryService;
  private readonly auth: AuthService;

  constructor(options: { discovery: DiscoveryService; auth: AuthService }) {
    this.discovery = options.discovery;
    this.auth = options.auth;
  }

  async applyConditions(
    pluginId: string,
    credentials: BackstageCredentials,
    decisions: readonly ApplyConditionsRequestEntry[],
  ): Promise<ApplyConditionsResponseEntry[]> {
    const baseUrl = await this.discovery.getBaseUrl(pluginId);
    const endpoint = `${baseUrl}/.well-known/backstage/permissions/apply-conditions`;

    const token = this.auth.isPrincipal(credentials, 'none')
      ? undefined
      : await this.auth
          .getPluginRequestToken({
            onBehalfOf: credentials,
            targetPluginId: pluginId,
          })
          .then(t => t.token);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        items: decisions,
      }),
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const result = responseSchema.parse(await response.json());

    return result.items;
  }
}
