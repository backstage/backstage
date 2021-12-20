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

import { groupBy, keyBy } from 'lodash';
import fetch from 'node-fetch';
import { z } from 'zod';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import {
  AuthorizeResponse,
  AuthorizeResult,
  Identified,
} from '@backstage/plugin-permission-common';
import {
  ApplyConditionsResponse,
  ConditionalPolicyDecision,
  PolicyDecision,
} from '@backstage/plugin-permission-node';

const responseSchema = z.array(
  z.object({
    id: z.string(),
    result: z
      .literal(AuthorizeResult.ALLOW)
      .or(z.literal(AuthorizeResult.DENY)),
  }),
);

export type ResourcePolicyDecision = Identified<
  PolicyDecision & { resourceRef?: string }
>;

type ConditionalResourcePolicyDecision = Identified<
  ConditionalPolicyDecision & { resourceRef: string }
>;

export class PermissionIntegrationClient {
  private readonly discovery: PluginEndpointDiscovery;

  constructor(options: { discovery: PluginEndpointDiscovery }) {
    this.discovery = options.discovery;
  }

  async applyConditions(
    decisions: ResourcePolicyDecision[],
    authHeader?: string,
  ): Promise<Identified<AuthorizeResponse>[]> {
    const responses = await Promise.all(
      this.groupRequestsByPluginId(decisions).map(([pluginId, requests]) =>
        this.makeRequest(pluginId, requests, authHeader),
      ),
    );

    const responseIndex = keyBy(responses.flat(), 'id');

    return decisions.map(decision => responseIndex[decision.id] ?? decision);
  }

  private async makeRequest(
    pluginId: string,
    decisions: ConditionalResourcePolicyDecision[],
    authHeader?: string,
  ): Promise<ApplyConditionsResponse> {
    const endpoint = `${await this.discovery.getBaseUrl(
      pluginId,
    )}/.well-known/backstage/permissions/apply-conditions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(
        decisions.map(({ id, resourceRef, resourceType, conditions }) => ({
          id,
          resourceRef,
          resourceType,
          conditions,
        })),
      ),
      headers: {
        ...(authHeader ? { authorization: authHeader } : {}),
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Unexpected response from plugin upstream when applying conditions. Expected 200 but got ${response.status} - ${response.statusText}`,
      );
    }

    return responseSchema.parse(await response.json());
  }

  private groupRequestsByPluginId(
    decisions: ResourcePolicyDecision[],
  ): [string, ConditionalResourcePolicyDecision[]][] {
    return Object.entries(
      groupBy(
        decisions.filter(
          (decision): decision is ConditionalResourcePolicyDecision =>
            decision.result === AuthorizeResult.CONDITIONAL &&
            !!decision.resourceRef,
        ),
        'pluginId',
      ),
    );
  }
}
