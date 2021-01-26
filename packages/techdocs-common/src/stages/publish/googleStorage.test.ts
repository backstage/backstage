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
import mockFs from 'mock-fs';
import * as winston from 'winston';
import { ConfigReader } from '@backstage/config';
import { GoogleGCSPublish } from './googleStorage';
import { PublisherBase } from './types';

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

const logger = winston.createLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);

let publisher: PublisherBase;

beforeEach(async () => {
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
  it('should publish a directory', async () => {
    mockFs({
      '/path/to/generatedDirectory': {
        'index.html': '',
        '404.html': '',
        assets: {
          'main.css': '',
        },
      },
    });

    const entity = createMockEntity();
    expect(
      await publisher.publish({
        entity,
        directory: '/path/to/generatedDirectory',
      }),
    ).toBeUndefined();
    mockFs.restore();
  });
});
