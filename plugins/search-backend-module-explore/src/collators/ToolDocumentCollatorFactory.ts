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

import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { ExploreTool } from '@backstage-community/plugin-explore-common';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import { Readable } from 'stream';

/**
 * Extended IndexableDocument with explore tool specific properties
 *
 * @public
 */
export interface ToolDocument extends IndexableDocument, ExploreTool {}

/**
 * @internal
 */
export type ToolDocumentCollatorFactoryOptions = {
  discovery: DiscoveryService;
  logger: LoggerService;
  auth: AuthService;
};

/**
 * Search collator responsible for collecting explore tools to index.
 *
 * @internal
 */
export class ToolDocumentCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'tools';

  private readonly discovery: DiscoveryService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;

  private constructor(options: ToolDocumentCollatorFactoryOptions) {
    this.discovery = options.discovery;
    this.logger = options.logger;
    this.auth = options.auth;
  }

  static fromConfig(
    _config: Config,
    options: ToolDocumentCollatorFactoryOptions,
  ) {
    return new ToolDocumentCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<ToolDocument> {
    this.logger.info('Starting collation of explore tools');

    const tools = await this.fetchTools();

    for (const tool of tools) {
      yield {
        ...tool,
        text: tool.description,
        location: tool.url,
      };
    }

    this.logger.info('Finished collation of explore tools');
  }

  private async fetchTools() {
    const baseUrl = await this.discovery.getBaseUrl('explore');

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'explore',
    });
    const response = await fetch(`${baseUrl}/tools`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to explore fetch tools, ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.tools;
  }
}
