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

import { ConfigReader } from '@backstage/config';
import { Command } from 'commander';

type Publisher = keyof typeof PublisherConfig['configFactories'];
type PublisherConfiguration = {
  [p in Publisher]?: any;
} & {
  type: Publisher;
};

/**
 * Helper when working with publisher-related configurations.
 */
export class PublisherConfig {
  /**
   * Maps publisher-specific config keys to config getters.
   */
  private static configFactories = {
    awsS3: PublisherConfig.getValidAwsS3Config,
    azureBlobStorage: PublisherConfig.getValidAzureConfig,
    googleGcs: PublisherConfig.getValidGoogleGcsConfig,
    openStackSwift: PublisherConfig.getValidOpenStackSwiftConfig,
  };

  /**
   * Returns Backstage config suitable for use when instantiating a Publisher. If
   * there are any missing or invalid options provided, an error is thrown.
   *
   * Note: This assumes that proper credentials are set in Environment
   * variables for the respective GCS/AWS clients to work.
   */
  static getValidConfig(cmd: Command): ConfigReader {
    const cmdOptions = cmd.opts();

    const publisherType = cmdOptions.publisherType;

    if (!PublisherConfig.isKnownPublisher(publisherType)) {
      throw new Error(`Unknown publisher type ${cmdOptions.publisherType}`);
    }

    return new ConfigReader({
      // This backend config is not used at all. Just something needed a create a mock discovery instance.
      backend: {
        baseUrl: 'http://localhost:7007',
        listen: {
          port: 7007,
        },
      },
      techdocs: {
        publisher: PublisherConfig.configFactories[publisherType](cmd),
        legacyUseCaseSensitiveTripletPaths:
          cmdOptions.legacyUseCaseSensitiveTripletPaths,
      },
    });
  }

  /**
   * Typeguard to ensure the publisher has a known config getter.
   */
  private static isKnownPublisher(
    type: string,
  ): type is keyof typeof PublisherConfig['configFactories'] {
    return PublisherConfig.configFactories.hasOwnProperty(type);
  }

  /**
   * Retrieve valid AWS S3 configuration based on the command.
   */
  private static getValidAwsS3Config(cmd: Command): PublisherConfiguration {
    const cmdOptions = cmd.opts();

    return {
      type: 'awsS3',
      awsS3: {
        bucketName: cmdOptions.storageName,
        ...(cmdOptions.awsBucketRootPath && {
          bucketRootPath: cmdOptions.awsBucketRootPath,
        }),
        ...(cmdOptions.awsRoleArn && {
          credentials: { roleArn: cmdOptions.awsRoleArn },
        }),
        ...(cmdOptions.awsEndpoint && { endpoint: cmdOptions.awsEndpoint }),
        ...(cmdOptions.awsS3ForcePathStyle && { s3ForcePathStyle: true }),
        ...(cmdOptions.awsS3sse && { sse: cmdOptions.awsS3sse }),
      },
    };
  }

  /**
   * Retrieve valid Azure Blob Storage configuration based on the command.
   */
  private static getValidAzureConfig(cmd: Command): PublisherConfiguration {
    const cmdOptions = cmd.opts();

    if (!cmdOptions.azureAccountName) {
      throw new Error(
        `azureBlobStorage requires --azureAccountName to be specified`,
      );
    }

    return {
      type: 'azureBlobStorage',
      azureBlobStorage: {
        containerName: cmdOptions.storageName,
        credentials: {
          accountName: cmdOptions.azureAccountName,
          accountKey: cmdOptions.azureAccountKey,
        },
      },
    };
  }

  /**
   * Retrieve valid GCS configuration based on the command.
   */
  private static getValidGoogleGcsConfig(cmd: Command): PublisherConfiguration {
    const cmdOptions = cmd.opts();
    return {
      type: 'googleGcs',
      googleGcs: {
        bucketName: cmdOptions.storageName,
        ...(cmdOptions.gcsBucketRootPath && {
          bucketRootPath: cmdOptions.gcsBucketRootPath,
        }),
      },
    };
  }

  /**
   * Retrieves valid OpenStack Swift configuration based on the command.
   */
  private static getValidOpenStackSwiftConfig(
    cmd: Command,
  ): PublisherConfiguration {
    const cmdOptions = cmd.opts();
    const missingParams = [
      'osCredentialId',
      'osSecret',
      'osAuthUrl',
      'osSwiftUrl',
    ].filter((param: string) => !cmdOptions[param]);

    if (missingParams.length) {
      throw new Error(
        `openStackSwift requires the following params to be specified: ${missingParams.join(
          ', ',
        )}`,
      );
    }

    return {
      type: 'openStackSwift',
      openStackSwift: {
        containerName: cmdOptions.storageName,
        credentials: {
          id: cmdOptions.osCredentialId,
          secret: cmdOptions.osSecret,
        },
        authUrl: cmdOptions.osAuthUrl,
        swiftUrl: cmdOptions.osSwiftUrl,
      },
    };
  }
}
