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

import { Config } from '@backstage/config';
import { AwsS3Integration, ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { readAwsS3Configs } from './config';
import { AwsS3Config } from './types';
import {
  ListObjectsV2Command,
  ListObjectsV2Output,
  S3,
} from '@aws-sdk/client-s3';
import * as uuid from 'uuid';
import { getEndpointFromInstructions } from '@aws-sdk/middleware-endpoint';
import {
  AwsCredentialsManager,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

// TODO: event-based updates using S3 events (+ queue like SQS)?
/**
 * Provider which discovers catalog files (any name) within an S3 bucket.
 *
 * Use `AwsS3EntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export class AwsS3EntityProvider implements EntityProvider {
  private readonly logger: LoggerService;
  private s3?: S3;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private endpoint?: string;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: LoggerService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): AwsS3EntityProvider[] {
    const providerConfigs = readAwsS3Configs(configRoot);

    // Even though the awsS3 integration allows a config array
    // there is no *real* support for multiple configs.
    // Usually, there will be just the integration for the default host.
    // In case, a custom endpoint is used, the host from this endpoint
    // will be extracted and used as host (e.g., localhost when used with LocalStack)
    // and the default integration will be added as second integration.
    // In this case, we still want the first one though, but have no means to select it
    // just from the bucket name (and region).
    const integration = ScmIntegrations.fromConfig(configRoot).awsS3.list()[0];
    if (!integration) {
      throw new Error('No integration found for awsS3');
    }

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return providerConfigs.map(providerConfig => {
      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for awsS3-provider:${providerConfig.id}.`,
        );
      }
      const awsCredentialsManager =
        DefaultAwsCredentialsManager.fromConfig(configRoot);
      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new AwsS3EntityProvider(
        providerConfig,
        integration,
        awsCredentialsManager,
        options.logger,
        taskRunner,
      );
    });
  }

  private constructor(
    private readonly config: AwsS3Config,
    private readonly integration: AwsS3Integration,
    private readonly awsCredentialsManager: AwsCredentialsManager,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.logger = logger.child({
      target: this.getProviderName(),
    });

    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AwsS3EntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(
              `${this.getProviderName()} refresh failed, ${error}`,
              error,
            );
          }
        },
      });
    };
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `awsS3-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    const { accountId, region, bucketName } = this.config;
    const credProvider = await this.awsCredentialsManager.getCredentialProvider(
      accountId ? { accountId } : undefined,
    );
    this.s3 = new S3({
      customUserAgent: 'backstage-aws-catalog-s3-entity-provider',
      apiVersion: '2006-03-01',
      credentialDefaultProvider: () => credProvider.sdkCredentialProvider,
      endpoint: this.integration.config.endpoint,
      region,
      forcePathStyle: this.integration.config.s3ForcePathStyle,
    });

    // https://github.com/aws/aws-sdk-js-v3/issues/4122#issuecomment-1298968804
    const endpoint = await getEndpointFromInstructions(
      {
        Bucket: bucketName,
      },
      ListObjectsV2Command,
      this.s3.config as unknown as Record<string, unknown>,
    );
    if (endpoint?.url)
      this.endpoint = endpoint.url.href.endsWith('/')
        ? endpoint.url.href
        : `${endpoint.url.href}/`;
    await this.scheduleFn();
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering AWS S3 objects');

    const keys = await this.listAllObjectKeys();
    logger.info(`Discovered ${keys.length} AWS S3 objects`);

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

    logger.info(`Committed ${locations.length} Locations for AWS S3 objects`);
  }

  private async listAllObjectKeys(): Promise<string[]> {
    if (!this.s3) {
      throw new Error('Not initialized');
    }

    const keys: string[] = [];

    let continuationToken: string | undefined = undefined;
    let output: ListObjectsV2Output;
    do {
      output = await this.s3.listObjectsV2({
        Bucket: this.config.bucketName,
        ContinuationToken: continuationToken,
        Prefix: this.config.prefix,
      });

      if (output.Contents) {
        output.Contents.forEach(item => {
          if (item.Key && !item.Key.endsWith('/')) {
            keys.push(item.Key);
          }
        });
      }
      continuationToken = output.NextContinuationToken;
    } while (continuationToken);

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
    return new URL(key, this.endpoint).href;
  }
}
