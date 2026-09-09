/*
 * Copyright 2020 The Backstage Authors
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
import { ForwardedError } from '@backstage/errors';
import { LocalPublish } from './local';
import {
  PublisherFactory,
  PublisherBase,
  PublisherType,
  PublisherBuilder,
} from './types';

/**
 * Factory class to create a TechDocs publisher based on defined publisher type in app config.
 * Uses `techdocs.publisher.type`.
 * @public
 */
export class Publisher implements PublisherBuilder {
  private publishers: Map<PublisherType | 'techdocs', PublisherBase> =
    new Map();

  register(type: PublisherType | 'techdocs', publisher: PublisherBase): void {
    this.publishers.set(type, publisher);
  }

  get(config: Config): PublisherBase {
    const publisherType = (config.getOptionalString(
      'techdocs.publisher.type',
    ) ?? 'local') as PublisherType;

    if (!publisherType) {
      throw new Error('TechDocs publisher type not specified for the entity');
    }

    const publisher = this.publishers.get(publisherType);
    if (!publisher) {
      throw new Error(
        `TechDocs publisher '${publisherType}' is not registered`,
      );
    }

    return publisher;
  }

  /**
   * Returns a instance of TechDocs publisher
   * @param config - A Backstage configuration
   * @param options - Options for configuring the publisher factory
   */
  static async fromConfig(
    config: Config,
    options: PublisherFactory,
  ): Promise<PublisherBase> {
    const { logger, discovery, customPublisher } = options;

    const publishers = new Publisher();

    if (customPublisher) {
      publishers.register('techdocs', customPublisher);
      return customPublisher;
    }

    const publisherType = (config.getOptionalString(
      'techdocs.publisher.type',
    ) ?? 'local') as PublisherType;

    switch (publisherType) {
      case 'googleGcs': {
        logger.info('Creating Google Storage Bucket publisher for TechDocs');
        const { GoogleGCSPublish } = await import('./googleStorage').catch(
          error => {
            throw new ForwardedError(
              `Failed to load the Google Cloud Storage TechDocs publisher, which requires ` +
                `'@google-cloud/storage'. It must be installed as an explicit dependency in ` +
                `your project`,
              error,
            );
          },
        );
        publishers.register(
          publisherType,
          GoogleGCSPublish.fromConfig(
            config,
            logger,
            options.publisherSettings?.googleGcs,
          ),
        );
        break;
      }
      case 'awsS3': {
        logger.info('Creating AWS S3 Bucket publisher for TechDocs');
        const { AwsS3Publish } = await import('./awsS3').catch(error => {
          throw new ForwardedError(
            `Failed to load the AWS S3 TechDocs publisher, which requires ` +
              `'@aws-sdk/client-s3', '@aws-sdk/credential-providers', '@aws-sdk/lib-storage', ` +
              `'@aws-sdk/types', '@backstage/integration-aws-node', '@smithy/node-http-handler' ` +
              `and 'hpagent'. They must be installed as explicit dependencies in your project`,
            error,
          );
        });
        publishers.register(
          publisherType,
          await AwsS3Publish.fromConfig(config, logger),
        );
        break;
      }
      case 'azureBlobStorage': {
        logger.info(
          'Creating Azure Blob Storage Container publisher for TechDocs',
        );
        const { AzureBlobStoragePublish } = await import(
          './azureBlobStorage'
        ).catch(error => {
          throw new ForwardedError(
            `Failed to load the Azure Blob Storage TechDocs publisher, which requires ` +
              `'@azure/identity' and '@azure/storage-blob'. They must be installed as ` +
              `explicit dependencies in your project`,
            error,
          );
        });
        publishers.register(
          publisherType,
          AzureBlobStoragePublish.fromConfig(config, logger),
        );
        break;
      }
      case 'openStackSwift': {
        logger.info(
          'Creating OpenStack Swift Container publisher for TechDocs',
        );
        const { OpenStackSwiftPublish } = await import(
          './openStackSwift'
        ).catch(error => {
          throw new ForwardedError(
            `Failed to load the OpenStack Swift TechDocs publisher, which requires ` +
              `'@trendyol-js/openstack-swift-sdk'. It must be installed as an explicit ` +
              `dependency in your project`,
            error,
          );
        });
        publishers.register(
          publisherType,
          OpenStackSwiftPublish.fromConfig(config, logger),
        );
        break;
      }
      case 'local':
        logger.info('Creating Local publisher for TechDocs');
        publishers.register(
          publisherType,
          LocalPublish.fromConfig(config, logger, discovery),
        );
        break;
      default:
        logger.info('Creating Local publisher for TechDocs');
        publishers.register(
          publisherType,
          LocalPublish.fromConfig(config, logger, discovery),
        );
    }

    return publishers.get(config);
  }
}
