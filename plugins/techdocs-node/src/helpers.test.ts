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

import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import {
  getDocFilesFromRepository,
  getLocationForEntity,
  parseReferenceAnnotation,
  transformDirLocation,
} from './helpers';
import {
  UrlReaderService,
  UrlReaderServiceSearchResponse,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadTreeResponse,
} from '@backstage/backend-plugin-api';

jest.mock('@backstage/catalog-model', () => ({
  ...jest.requireActual('@backstage/catalog-model'),
  getEntitySourceLocation: jest.fn(),
}));

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const entityBase: Entity = {
  metadata: {
    namespace: 'default',
    name: 'mytestcomponent',
    description: 'A component for testing',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'documentation',
    lifecycle: 'experimental',
    owner: 'testuser',
  },
};

const metadataBase = {
  namespace: 'default',
  name: 'mytestcomponent',
  description: 'A component for testing',
};

const goodAnnotation = {
  annotations: {
    [TECHDOCS_ANNOTATION]:
      'url:https://github.com/backstage/backstage/blob/master/subfolder/',
  },
};

const mockEntityWithAnnotation: Entity = {
  ...entityBase,
  ...{
    metadata: {
      ...metadataBase,
      ...goodAnnotation,
    },
  },
};

const badAnnotation = {
  annotations: {
    [TECHDOCS_ANNOTATION]: 'bad-annotation',
  },
};

const mockEntityWithBadAnnotation: Entity = {
  ...entityBase,
  ...{
    metadata: {
      ...metadataBase,
      ...badAnnotation,
    },
  },
};

const scmIntegrations = ScmIntegrations.fromConfig(new ConfigReader({}));

afterEach(() => jest.resetAllMocks());

describe('parseReferenceAnnotation', () => {
  it('should parse annotation', () => {
    const parsedLocationAnnotation = parseReferenceAnnotation(
      TECHDOCS_ANNOTATION,
      mockEntityWithAnnotation,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe(
      'https://github.com/backstage/backstage/blob/master/subfolder/',
    );
  });

  it('should throw error without annotation', () => {
    expect(() => {
      parseReferenceAnnotation(TECHDOCS_ANNOTATION, entityBase);
    }).toThrow(/No location annotation/);
  });

  it('should throw error with bad annotation', () => {
    expect(() => {
      parseReferenceAnnotation(
        TECHDOCS_ANNOTATION,
        mockEntityWithBadAnnotation,
      );
    }).toThrow(/Unable to parse/);
  });
});

describe('transformDirLocation', () => {
  it.each`
    techdocsRef           | target
    ${'dir:.'}            | ${'https://my-url/folder/'}
    ${'dir:./sub-folder'} | ${'https://my-url/folder/sub-folder'}
  `(
    'should transform "$techdocsRef" for url type locations',
    ({ techdocsRef, target }) => {
      (getEntitySourceLocation as jest.Mock).mockReturnValue({
        type: 'url',
        target: 'https://my-url/folder/',
      });

      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            [TECHDOCS_ANNOTATION]: techdocsRef,
          },
        },
      };

      const result = transformDirLocation(
        entity,
        parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity),
        scmIntegrations,
      );

      expect(result).toEqual({ type: 'url', target });
    },
  );

  it.each`
    techdocsRef           | target
    ${'dir:.'}            | ${path.join(rootDir, 'working-copy')}
    ${'dir:./sub-folder'} | ${path.join(rootDir, 'working-copy', 'sub-folder')}
  `(
    'should transform "$techdocsRef" for file type locations',
    ({ techdocsRef, target }) => {
      (getEntitySourceLocation as jest.Mock).mockReturnValue({
        type: 'file',
        target: path.join(rootDir, 'working-copy', 'catalog-info.yaml'),
      });

      const entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            [TECHDOCS_ANNOTATION]: techdocsRef,
          },
        },
      };

      const result = transformDirLocation(
        entity,
        parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity),
        scmIntegrations,
      );

      expect(result).toEqual({ type: 'dir', target });
    },
  );

  it('should reject unsafe file location', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'file',
      target: '/tmp/catalog-info.yaml',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          [TECHDOCS_ANNOTATION]: 'dir:..',
        },
      },
    };

    expect(() =>
      transformDirLocation(
        entity,
        parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity),
        scmIntegrations,
      ),
    ).toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should reject other location types', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'other',
      target: '/',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          [TECHDOCS_ANNOTATION]: 'dir:.',
        },
      },
    };

    expect(() =>
      transformDirLocation(
        entity,
        parseReferenceAnnotation(TECHDOCS_ANNOTATION, entity),
        scmIntegrations,
      ),
    ).toThrow(/Unable to resolve location type other/);
  });
});

describe('getLocationForEntity', () => {
  it('should handle dir locations', () => {
    (getEntitySourceLocation as jest.Mock).mockReturnValue({
      type: 'url',
      target: 'https://my-url/folder/',
    });

    const entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {
          [TECHDOCS_ANNOTATION]: 'dir:.',
        },
      },
    };

    const parsedLocationAnnotation = getLocationForEntity(
      entity,
      scmIntegrations,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe('https://my-url/folder/');
  });

  it('should get location for entity', () => {
    const parsedLocationAnnotation = getLocationForEntity(
      mockEntityWithAnnotation,
      scmIntegrations,
    );
    expect(parsedLocationAnnotation.type).toBe('url');
    expect(parsedLocationAnnotation.target).toBe(
      'https://github.com/backstage/backstage/blob/master/subfolder/',
    );
  });
});

describe('getDocFilesFromRepository', () => {
  it('should read a remote directory using UrlReader.readTree', async () => {
    class MockUrlReader implements UrlReaderService {
      async read() {
        return Buffer.from('mock');
      }

      async readUrl(
        _url: string,
        _options?: UrlReaderServiceReadUrlOptions | undefined,
      ): Promise<UrlReaderServiceReadUrlResponse> {
        throw new Error('Method not implemented.');
      }

      async readTree(): Promise<UrlReaderServiceReadTreeResponse> {
        return {
          dir: async () => {
            return '/tmp/testfolder';
          },
          files: async () => {
            return [];
          },
          archive: async () => {
            return Readable.from('');
          },
          etag: 'etag123abc',
        };
      }

      async search(): Promise<UrlReaderServiceSearchResponse> {
        return {
          etag: '',
          files: [],
        };
      }
    }

    const output = await getDocFilesFromRepository(
      new MockUrlReader(),
      mockEntityWithAnnotation,
    );

    expect(output.preparedDir).toBe('/tmp/testfolder');
    expect(output.etag).toBe('etag123abc');
  });
});
