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

import { Command } from 'commander';
import { PublisherConfig } from './PublisherConfig';

describe('getValidPublisherConfig', () => {
  it('should not allow unknown publisher types', () => {
    const cmdWithInvalidConfig = new Command();
    cmdWithInvalidConfig.setOptionValue('publisherType', 'unknown publisher');
    const cmdOptions = cmdWithInvalidConfig.opts();

    expect(() =>
      PublisherConfig.getValidConfig(cmdWithInvalidConfig),
    ).toThrowError(`Unknown publisher type ${cmdOptions.publisherType}`);
  });

  describe('for azureBlobStorage', () => {
    it('should require --azureAccountName', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'azureBlobStorage');

      expect(() => PublisherConfig.getValidConfig(cmd)).toThrowError(
        'azureBlobStorage requires --azureAccountName to be specified',
      );
    });

    it('should return valid ConfigReader', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'azureBlobStorage');
      cmd.setOptionValue('azureAccountName', 'someAccountName');
      cmd.setOptionValue('storageName', 'someContainer');

      const actualConfig = PublisherConfig.getValidConfig(cmd);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(
        'azureBlobStorage',
      );
      expect(
        actualConfig.getString(
          'techdocs.publisher.azureBlobStorage.containerName',
        ),
      ).toBe('someContainer');
      expect(
        actualConfig.getString(
          'techdocs.publisher.azureBlobStorage.credentials.accountName',
        ),
      ).toBe('someAccountName');
    });
  });

  describe('for awsS3', () => {
    it('should return valid ConfigReader', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'awsS3');
      cmd.setOptionValue('storageName', 'someStorageName');
      cmd.setOptionValue('awsBucketRootPath', 'backstage-data/techdocs');

      const actualConfig = PublisherConfig.getValidConfig(cmd);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe('awsS3');
      expect(
        actualConfig.getString('techdocs.publisher.awsS3.bucketName'),
      ).toBe('someStorageName');
      expect(
        actualConfig.getString('techdocs.publisher.awsS3.bucketRootPath'),
      ).toBe('backstage-data/techdocs');
    });

    it('should return valid ConfigReader with SSE option', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'awsS3');
      cmd.setOptionValue('storageName', 'someStorageName');
      cmd.setOptionValue('awsS3sse', 'aws:kms');

      const actualConfig = PublisherConfig.getValidConfig(cmd);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe('awsS3');
      expect(actualConfig.getString('techdocs.publisher.awsS3.sse')).toBe(
        'aws:kms',
      );
    });
  });

  describe('for openStackSwift', () => {
    it('should throw error on missing parameters', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'openStackSwift');
      cmd.setOptionValue('osCredentialId', 'someCredentialId');
      cmd.setOptionValue('osSecret', 'someSecret');

      expect(() => PublisherConfig.getValidConfig(cmd)).toThrowError(
        `openStackSwift requires the following params to be specified: ${[
          'osAuthUrl',
          'osSwiftUrl',
        ].join(', ')}`,
      );
    });

    it('should return valid ConfigReader', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'openStackSwift');
      cmd.setOptionValue('storageName', 'someStorageName');
      cmd.setOptionValue('osCredentialId', 'someCredentialId');
      cmd.setOptionValue('osSecret', 'someSecret');
      cmd.setOptionValue('osAuthUrl', 'someAuthUrl');
      cmd.setOptionValue('osSwiftUrl', 'someSwiftUrl');

      const actualConfig = PublisherConfig.getValidConfig(cmd);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(
        'openStackSwift',
      );
      expect(
        actualConfig.getConfig('techdocs.publisher.openStackSwift').get(),
      ).toMatchObject({
        containerName: 'someStorageName',
        credentials: {
          id: 'someCredentialId',
          secret: 'someSecret',
        },
        authUrl: 'someAuthUrl',
        swiftUrl: 'someSwiftUrl',
      });
    });
  });

  describe('for googleGcs', () => {
    it('should return valid ConfigReader', () => {
      const cmd = new Command();
      cmd.setOptionValue('publisherType', 'googleGcs');
      cmd.setOptionValue('storageName', 'someStorageName');
      cmd.setOptionValue('gcsBucketRootPath', 'backstage-data/techdocs');

      const actualConfig = PublisherConfig.getValidConfig(cmd);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe(
        'googleGcs',
      );
      expect(
        actualConfig.getString('techdocs.publisher.googleGcs.bucketName'),
      ).toBe('someStorageName');
      expect(
        actualConfig.getString('techdocs.publisher.googleGcs.bucketRootPath'),
      ).toBe('backstage-data/techdocs');
    });
  });
});
