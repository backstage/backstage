/*
 * Copyright 2023 The Backstage Authors
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
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
import { readAzureBlobStorageConfigs } from './config';
import {
  AzureBlobStorageIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import * as uuid from 'uuid';
import { AzureBlobStorageConfig } from './types';

/**
 * Provider which discovers catalog files (any name) within Azure BlobStorage
 *
 * Use `AzureStorageEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export class AzureBlobStorageEntityProvider implements EntityProvider {
  private readonly storageClient: BlobServiceClient;
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private readonly integration: AzureBlobStorageIntegration;
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: Logger;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
    },
  ): AzureBlobStorageEntityProvider[] {
    const providerConfigs = readAzureBlobStorageConfigs(configRoot);
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return providerConfigs.map(providerConfig => {
      const integration = ScmIntegrations.fromConfig(
        configRoot,
      ).azureBlobStorage.byHost(
        `${providerConfig.accountName}.blob.core.windows.net`,
      );

      if (!integration) {
        throw new Error(
          `No integration found for azureBlobStorage-provider:${providerConfig.accountName}.`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for azureBlobStorage-provider:${providerConfig.accountName}.`,
        );
      }
      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new AzureBlobStorageEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
      );
    });
  }

  private constructor(
    private readonly config: AzureBlobStorageConfig,
    integration: AzureBlobStorageIntegration,
    logger: Logger,
    taskRunner: TaskRunner,
  ) {
    this.integration = integration;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.storageClient = new BlobServiceClient(
      `https://${integration?.config?.host}${integration?.config?.secretAccessKey}`,
    );

    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AzureBlobStorageEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  getProviderName(): string {
    return `azureBlobStorage-provider:${this.config.accountName}`;
  }

  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering Azure BlobStorage objects');

    const keys = await this.listAllObjectKeys();
    logger.info(`Discovered ${keys.length} Azure BlobStorage objects`);

    const locations = keys.map(key => this.createLocationSpec(key));

    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => {
        return {
          locationKey: this.getProviderName(),
          entity: locationSpecToLocationEntity({ location }),
        };
      }),
    });

    logger.info(
      `Committed ${locations.length} Locations for Azure BlobStorage objects`,
    );
  }

  private async listAllObjectKeys(): Promise<string[]> {
    const keys: string[] = [];

    const containerClient: ContainerClient =
      this.storageClient.getContainerClient(this.config.containerName);
    const blobs = containerClient.listBlobsFlat({ prefix: this.config.prefix });
    for await (const blob of blobs) {
      keys.push(`${this.config.containerName}/${blob.name}`);
    }

    return keys;
  }

  private createLocationSpec(key: string): LocationSpec {
    return {
      type: 'url',
      target: this.createObjectUrl(key),
      presence: 'required',
    };
  }

  private createObjectUrl(key: string): string {
    return encodeURI(`https://${this.integration?.config?.host}/${key}`);
  }
}
