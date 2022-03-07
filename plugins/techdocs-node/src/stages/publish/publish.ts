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
import { PublisherFactory, PublisherBase, PublisherType } from './types';

/**
 * Factory class to create a TechDocs publisher based on defined publisher type in app config.
 * Uses `techdocs.publisher.type`.
 * @public
 */
export class Publisher {
  /**
   * Returns a instance of TechDocs publisher
   * @param config - A Backstage configuration
   * @param options - Options for configuring the publisher factory
   */
  static async fromConfig(
    config: Config,
    { logger, discovery }: PublisherFactory,
  ): Promise<PublisherBase> {
    const publisherType = (config.getOptionalString(
      'techdocs.publisher.type',
    ) ?? 'local') as PublisherType;

    switch (publisherType) {
      case 'googleGcs':
        logger.info('Creating Google Storage Bucket publisher for TechDocs');
        return GoogleGCSPublish.fromConfig(config, logger);
      case 'awsS3':
        logger.info('Creating AWS S3 Bucket publisher for TechDocs');
        return AwsS3Publish.fromConfig(config, logger);
      case 'azureBlobStorage':
        logger.info(
          'Creating Azure Blob Storage Container publisher for TechDocs',
        );
        return AzureBlobStoragePublish.fromConfig(config, logger);
      case 'openStackSwift':
        logger.info(
          'Creating OpenStack Swift Container publisher for TechDocs',
        );
        return OpenStackSwiftPublish.fromConfig(config, logger);
      case 'local':
        logger.info('Creating Local publisher for TechDocs');
        return LocalPublish.fromConfig(config, logger, discovery);
      default:
        logger.info('Creating Local publisher for TechDocs');
        return LocalPublish.fromConfig(config, logger, discovery);
    }
  }
}
