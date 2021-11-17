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
    const invalidConfig = {
      publisherType: 'unknown publisher',
    } as unknown as Command;

    expect(() => PublisherConfig.getValidConfig(invalidConfig)).toThrowError(
      `Unknown publisher type ${invalidConfig.publisherType}`,
    );
  });

  describe('for azureBlobStorage', () => {
    it('should require --azureAccountName', () => {
      const config = {
        publisherType: 'azureBlobStorage',
      } as unknown as Command;

      expect(() => PublisherConfig.getValidConfig(config)).toThrowError(
        'azureBlobStorage requires --azureAccountName to be specified',
      );
    });

    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: 'azureBlobStorage',
        azureAccountName: 'someAccountName',
        storageName: 'someContainer',
      } as unknown as Command;

      const actualConfig = PublisherConfig.getValidConfig(config);
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
      const config = {
        publisherType: 'awsS3',
        storageName: 'someStorageName',
        awsBucketRootPath: 'backstage-data/techdocs',
      } as unknown as Command;

      const actualConfig = PublisherConfig.getValidConfig(config);
      expect(actualConfig.getString('techdocs.publisher.type')).toBe('awsS3');
      expect(
        actualConfig.getString('techdocs.publisher.awsS3.bucketName'),
      ).toBe('someStorageName');
      expect(
        actualConfig.getString('techdocs.publisher.awsS3.bucketRootPath'),
      ).toBe('backstage-data/techdocs');
    });
  });

  describe('for openStackSwift', () => {
    it('should throw error on missing parameters', () => {
      const config = {
        publisherType: 'openStackSwift',
        osCredentialId: 'someCredentialId',
        osSecret: 'someSecret',
      } as unknown as Command;

      expect(() => PublisherConfig.getValidConfig(config)).toThrowError(
        `openStackSwift requires the following params to be specified: ${[
          'osAuthUrl',
          'osSwiftUrl',
        ].join(', ')}`,
      );
    });

    it('should return valid ConfigReader', () => {
      const config = {
        publisherType: 'openStackSwift',
        storageName: 'someStorageName',
        osCredentialId: 'someCredentialId',
        osSecret: 'someSecret',
        osAuthUrl: 'someAuthUrl',
        osSwiftUrl: 'someSwiftUrl',
      } as unknown as Command;

      const actualConfig = PublisherConfig.getValidConfig(config);
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
      const config = {
        publisherType: 'googleGcs',
        storageName: 'someStorageName',
        gcsBucketRootPath: 'backstage-data/techdocs',
      } as unknown as Command;

      const actualConfig = PublisherConfig.getValidConfig(config);
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
