/*
 * Copyright 2025 The Backstage Authors
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
  ActionsRegistryAction,
  ActionsService,
  ActionsServiceAction,
  DiscoveryService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { NotFoundError, ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';

export class DefaultActionsService implements ActionsService {
  private constructor(
    private readonly discovery: DiscoveryService,
    private readonly config: RootConfigService,
    private readonly logger: LoggerService,
  ) {}

  static create({
    discovery,
    config,
    logger,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
  }) {
    return new DefaultActionsService(discovery, config, logger);
  }

  async listActions() {
    const pluginSources =
      this.config.getOptionalStringArray('actions.pluginSources') ?? [];

    const remoteActionsList = await Promise.all(
      pluginSources.map(async source => {
        const pluginBaseUrl = await this.discovery.getBaseUrl(source);
        const response = await fetch(`${pluginBaseUrl}/.backstage/v1/actions`);
        if (!response.ok) {
          this.logger.warn(`Failed to fetch actions from ${source}`);
          return [];
        }

        const { actions } = (await response.json()) as {
          actions: Omit<ActionsRegistryAction<any, any>, 'action'>[];
        };

        return actions;
      }),
    );

    return { actions: remoteActionsList.flat() };
  }

  async invokeAction(opts: { id: string; input?: JsonObject }) {
    const pluginId = this.pluginIdFromActionId(opts.id);

    const baseUrl = await this.discovery.getBaseUrl(pluginId);
    const response = await fetch(
      `${baseUrl}/.backstage/v1/actions/${opts.id}/invoke`,
      {
        method: 'POST',
        body: JSON.stringify(opts.input),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    const { output } = await response.json();
    return { output };
  }

  private pluginIdFromActionId(id: string): string {
    const colonIndex = id.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid action id: ${id}`);
    }
    return id.substring(0, colonIndex);
  }
}
