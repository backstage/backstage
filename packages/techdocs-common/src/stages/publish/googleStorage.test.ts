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
import { getVoidLogger } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import mockFs from 'mock-fs';
import os from 'os';
import path from 'path';
import { GoogleGCSPublish } from './googleStorage';
import { PublisherBase } from './types';

const createMockEntity = (annotations = {}): Entity => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      namespace: 'test-namespace',
      annotations: {
        ...annotations,
      },
    },
  };
};

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(rootDir, namespace as string, kind, name);
};

const logger = getVoidLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);

let publisher: PublisherBase;

beforeEach(async () => {
  mockFs.restore();
  const mockConfig = new ConfigReader({
    techdocs: {
      requestUrl: 'http://localhost:7000',
      publisher: {
        type: 'googleGcs',
        googleGcs: {
          credentials: '{}',
          bucketName: 'bucketName',
        },
      },
    },
  });

  publisher = await GoogleGCSPublish.fromConfig(mockConfig, logger);
});

describe('GoogleGCSPublish', () => {
  beforeEach(() => {
    const entity = createMockEntity();
    const entityRootDir = getEntityRootDir(entity);

    mockFs({
      [entityRootDir]: {
        'index.html': '',
        '404.html': '',
        assets: {
          'main.css': '',
        },
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should publish a directory', async () => {
    const entity = createMockEntity();
    const entityRootDir = getEntityRootDir(entity);

    expect(
      await publisher.publish({
        entity,
        directory: entityRootDir,
      }),
    ).toBeUndefined();
    mockFs.restore();
  });

  it('should fail to publish a directory', async () => {
    const wrongPathToGeneratedDirectory = path.join(
      rootDir,
      'wrong',
      'path',
      'to',
      'generatedDirectory',
    );

    const entity = createMockEntity();

    await expect(
      publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      }),
    ).rejects.toThrowError();

    await publisher
      .publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      })
      .catch(error => {
        expect(error.message).toEqual(
          // Can not do exact error message match due to mockFs adding unexpected characters in the path when throwing the error
          // Issue reported https://github.com/tschaub/mock-fs/issues/118
          expect.stringContaining(
            `Unable to upload file(s) to Google Cloud Storage. Error: Failed to read template directory: ENOENT, no such file or directory`,
          ),
        );
        expect(error.message).toEqual(
          expect.stringContaining(wrongPathToGeneratedDirectory),
        );
      });

    mockFs.restore();
  });
});
