/*
 * Copyright 2020 Spotify AB
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
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { PublisherType } from './types';
import { LocalPublish } from './local';

export type PublisherBaseParams = {
  entity: Entity;
  directory: string;
};

export type PublisherBaseReturn =
  | Promise<{ remoteUrl: string }>
  | { remoteUrl: string };

/**
 * Type for the publisher instance registered with backend which manages publishing of the
 * generated static files after the prepare and generate steps of TechDocs.
 *
 * Depending upon the value of techdocs.publisher.type in app config, this instance creates
 * and uses a publisher of the particular type i.e. local, google_gcs, aws_s3, etc. It defaults
 * to use the local publisher.
 */
export interface PublisherBase {
  /**
   * Invoke the app's configured publisher's publish method.
   *
   * @param {PublisherBaseParams} opts Object containing the entity from the service
   * catalog, and the directory that contains the generated static files from TechDocs.
   */
  publish(opts: PublisherBaseParams): PublisherBaseReturn;

  /**
   * Return true if local filesystem is being used to store generated files for TechDocs.
   */
  isLocalPublisher(): boolean;

  /**
   * Return true if an external cloud storage (GCS, S3, SFTP server, etc.) is being used to
   * store generated files for TechDocs.
   */
  isExternalPublisher(): boolean;
}

export class Publisher implements PublisherBase {
  private readonly logger: Logger;
  private readonly config: Config;
  private readonly discovery: PluginEndpointDiscovery;
  private readonly publisherType: PublisherType;
  private readonly publisher: any;

  constructor(
    logger: Logger,
    config: Config,
    discovery: PluginEndpointDiscovery,
  ) {
    this.logger = logger;
    this.config = config;
    this.discovery = discovery;

    this.publisherType =
      (this.config.getOptionalString(
        'techdocs.publisher.type',
      ) as PublisherType) ?? 'local';

    switch (this.publisherType) {
      case 'google_gcs':
        this.logger.info(
          'Creating Google Storage Bucket publisher for TechDocs',
        );
        this.publisher = new LocalPublish(this.logger, this.discovery);
        break;
      case 'local':
        this.logger.info('Creating Local publisher for TechDocs');
        this.publisher = new LocalPublish(this.logger, this.discovery);
        break;
      default:
        this.logger.info('Creating Local publisher for TechDocs');
        this.publisher = new LocalPublish(this.logger, this.discovery);
        break;
    }
  }

  publish({ entity, directory }: PublisherBaseParams): PublisherBaseReturn {
    return this.publisher.publish({ entity, directory });
  }

  isLocalPublisher(): boolean {
    return this.publisherType === 'local';
  }

  isExternalPublisher(): boolean {
    return this.publisherType !== 'local';
  }
}
