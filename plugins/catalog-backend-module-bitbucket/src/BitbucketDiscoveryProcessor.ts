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

import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { BitbucketRepositoryParser } from './lib';
import { BitbucketCloudDiscoveryProcessor } from './BitbucketCloudDiscoveryProcessor';
import { BitbucketServerDiscoveryProcessor } from './BitbucketServerDiscoveryProcessor';

/**
 * @public
 * @deprecated Use `BitbucketCloudDiscoveryProcessor` and/or `BitbucketServerDiscoveryProcessor` instead.
 */
export class BitbucketDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly bitbucketCloudProcessor;
  private readonly bitbucketServerProcessor;

  static fromConfig(
    config: Config,
    options: {
      parser?: BitbucketRepositoryParser;
      logger: Logger;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new BitbucketDiscoveryProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    parser?: BitbucketRepositoryParser;
    logger: Logger;
  }) {
    this.integrations = options.integrations;
    this.bitbucketCloudProcessor = new BitbucketCloudDiscoveryProcessor(
      options,
    );
    this.bitbucketServerProcessor = new BitbucketServerDiscoveryProcessor(
      options,
    );
  }

  getProcessorName(): string {
    return 'BitbucketDiscoveryProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'bitbucket-discovery') {
      return false;
    }

    const integration = this.integrations.bitbucket.byUrl(location.target);
    if (!integration) {
      throw new Error(
        `There is no Bitbucket integration that matches ${location.target}. Please add a configuration entry for it under integrations.bitbucket`,
      );
    }

    const isBitbucketCloud = integration.config.host === 'bitbucket.org';
    if (isBitbucketCloud) {
      return this.bitbucketCloudProcessor.readLocation(
        {
          ...location,
          type: 'bitbucket-cloud-discovery',
        },
        _optional,
        emit,
      );
    }

    return this.bitbucketServerProcessor.readLocation(
      {
        ...location,
        type: 'bitbucket-server-discovery',
      },
      _optional,
      emit,
    );
  }
}
