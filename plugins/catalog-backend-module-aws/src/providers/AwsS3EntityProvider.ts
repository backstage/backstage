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

import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { AwsS3Integration, ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
  LocationSpec,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-backend';
import { AwsCredentials } from '../credentials/AwsCredentials';
import { readAwsS3Configs } from './config';
import { AwsS3Config } from './types';
import { S3 } from 'aws-sdk';
import { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import * as uuid from 'uuid';
import { Logger } from 'winston';

// TODO: event-based updates using S3 events (+ queue like SQS)?
/**
 * Provider which discovers catalog files (any name) within an S3 bucket.
 *
 * Use `AwsS3EntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export class AwsS3EntityProvider implements EntityProvider {
  private readonly logger: Logger;
  private readonly s3: S3;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: Logger;
      schedule: TaskRunner;
    },
  ): AwsS3EntityProvider[] {
    const providerConfigs = readAwsS3Configs(configRoot);

    // Even though the awsS3 integration allows a config array
    // there is no *real* support for multiple configs.
    // Usually, there will be just the integration for the default host.
    // In case, a config custom endpoint is used, the host from this endpoint
    // will be extracted and used as host (e.g., localhost when used with LocalStack)
    // and the default integration will be added as second integration.
    // In this case, we still want the first one though, but have no means to select it
    // just from the bucket name (and region).
    const integration = ScmIntegrations.fromConfig(configRoot).awsS3.list()[0];
    if (!integration) {
      throw new Error('No integration found for awsS3');
    }

    return providerConfigs.map(
      providerConfig =>
        new AwsS3EntityProvider(
          providerConfig,
          integration,
          options.logger,
          options.schedule,
        ),
    );
  }

  private constructor(
    private readonly config: AwsS3Config,
    private readonly integration: AwsS3Integration,
    logger: Logger,
    schedule: TaskRunner,
  ) {
    this.logger = logger.child({
      target: this.getProviderName(),
    });

    this.s3 = new S3({
      apiVersion: '2006-03-01',
      credentials: AwsCredentials.create(
        integration.config,
        'backstage-aws-s3-provider',
      ),
      endpoint: integration.config.endpoint,
      region: this.config.region,
      s3ForcePathStyle: integration.config.s3ForcePathStyle,
    });

    this.scheduleFn = this.createScheduleFn(schedule);
  }

  private createScheduleFn(schedule: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
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
            logger.error(error);
          }
        },
      });
    };
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `awsS3-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  async refresh(logger: Logger) {
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
    const keys: string[] = [];

    let continuationToken: string | undefined = undefined;
    let output: ListObjectsV2Output;
    do {
      const request = this.s3.listObjectsV2({
        Bucket: this.config.bucketName,
        ContinuationToken: continuationToken,
        Prefix: this.config.prefix,
      });

      output = await request.promise();
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
    const bucketName = this.config.bucketName;
    const endpoint = this.integration.config.endpoint;

    if (endpoint) {
      if (endpoint.startsWith(`https://${bucketName}.`)) {
        return `${endpoint}/${key}`;
      }

      return `${endpoint}/${bucketName}/${key}`;
    }

    return `https://${bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  }
}
