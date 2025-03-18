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
import { AwsS3Publish } from './awsS3';
import { AzureBlobStoragePublish } from './azureBlobStorage';
import { GoogleGCSPublish } from './googleStorage';
import { LocalPublish } from './local';
import { OpenStackSwiftPublish } from './openStackSwift';
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
      case 'googleGcs':
        logger.info('Creating Google Storage Bucket publisher for TechDocs');
        publishers.register(
          publisherType,
          GoogleGCSPublish.fromConfig(
            config,
            logger,
            options.publisherSettings?.googleGcs,
          ),
        );
        break;
      case 'awsS3':
        logger.info('Creating AWS S3 Bucket publisher for TechDocs');
        publishers.register(
          publisherType,
          await AwsS3Publish.fromConfig(config, logger),
        );
        break;
      case 'azureBlobStorage':
        logger.info(
          'Creating Azure Blob Storage Container publisher for TechDocs',
        );
        publishers.register(
          publisherType,
          AzureBlobStoragePublish.fromConfig(config, logger),
        );
        break;
      case 'openStackSwift':
        logger.info(
          'Creating OpenStack Swift Container publisher for TechDocs',
        );
        publishers.register(
          publisherType,
          OpenStackSwiftPublish.fromConfig(config, logger),
        );
        break;
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
