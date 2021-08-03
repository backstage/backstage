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
import mockFs from 'mock-fs';
import * as os from 'os';
import * as path from 'path';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import {
  getStaleFiles,
  getFileTreeRecursively,
  getCloudPathForLocalPath,
  getHeadersForFileExtension,
  lowerCaseEntityTripletInStoragePath,
} from './helpers';

describe('getHeadersForFileExtension', () => {
  const correctMapOfExtensions = [
    ['.html', 'text/plain; charset=utf-8'],
    ['.htm', 'text/plain; charset=utf-8'],
    ['.HTML', 'text/plain; charset=utf-8'],
    ['.dhtml', 'text/plain; charset=utf-8'],
    ['.xhtml', 'text/plain; charset=utf-8'],
    ['.xml', 'text/plain; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.svg', 'text/plain; charset=utf-8'],
    ['.SVG', 'text/plain; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.this-in-not-an-extension', 'text/plain; charset=utf-8'],
  ];

  test.each(correctMapOfExtensions)(
    'check content-type for %s extension',
    (extension, expectedContentType) => {
      const headers = getHeadersForFileExtension(extension);
      expect(headers).toHaveProperty('Content-Type');
      expect(headers['Content-Type'].toLowerCase()).toBe(expectedContentType);
    },
  );
});

describe('getFileTreeRecursively', () => {
  const root = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

  beforeEach(() => {
    mockFs({
      [root]: {
        file1: '',
        subDirA: {
          file2: '',
          emptyDir1: mockFs.directory(),
        },
        emptyDir2: mockFs.directory(),
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('returns complete file tree of a path', async () => {
    const fileList = await getFileTreeRecursively(root);
    expect(fileList.length).toBe(2);
    expect(fileList).toContain(path.resolve(root, 'file1'));
    expect(fileList).toContain(path.resolve(root, 'subDirA/file2'));
  });
});

describe('lowerCaseEntityTripletInStoragePath', () => {
  it('returns lower-cased entity triplet path', () => {
    const originalPath = 'default/Component/backstage/index.html';
    const actualPath = lowerCaseEntityTripletInStoragePath(originalPath);
    expect(actualPath).toBe('default/component/backstage/index.html');
  });

  it('does not lowercase beyond the triplet', () => {
    const originalPath = 'default/Component/backstage/assets/IMAGE.png';
    const actualPath = lowerCaseEntityTripletInStoragePath(originalPath);
    expect(actualPath).toBe('default/component/backstage/assets/IMAGE.png');
  });

  it('throws error when there is no triplet', () => {
    const originalPath = '/default/component/IMAGE.png';
    const error = `Encountered file unmanaged by TechDocs ${originalPath}. Skipping.`;
    expect(() =>
      lowerCaseEntityTripletInStoragePath(originalPath),
    ).toThrowError(error);
  });
});

describe('getStaleFiles', () => {
  const defaultFiles = [
    'default/Component/backstage/index.html',
    'default/Component/backstage/techdocs_metadata.json',
    'default/Component/backstage/assests/javascripts/bundle.7f4f3c92.min.js',
    'default/Component/backstage/assets/stylesheets/main.fe0cca5b.min.css',
  ];

  it('should return empty array if there is no stale file', () => {
    const oldFiles = [...defaultFiles];
    const newFiles = [...defaultFiles];
    const staleFiles = getStaleFiles(newFiles, oldFiles);
    expect(staleFiles).toHaveLength(0);
  });

  it('should return all stale files when they exists', () => {
    const oldFiles = [...defaultFiles, 'stale_file.png'];
    const newFiles = [...defaultFiles];
    const staleFiles = getStaleFiles(newFiles, oldFiles);
    expect(staleFiles).toHaveLength(1);
    expect(staleFiles).toEqual(expect.arrayContaining(['stale_file.png']));
  });
});

describe('getCloudPathForLocalPath', () => {
  const entity: Entity = {
    apiVersion: 'version',
    metadata: { namespace: 'default', name: 'backstage' },
    kind: 'Component',
  };

  it('should compose a remote bucket path including entity information', () => {
    const remoteBucket = getCloudPathForLocalPath(entity);
    expect(remoteBucket).toBe(
      `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}/`,
    );
  });

  it('should compose a remote filename including entity information', () => {
    const localPath = 'index.html';
    const remoteBucket = getCloudPathForLocalPath(entity, localPath);
    expect(remoteBucket).toBe(
      `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}/${localPath}`,
    );
  });

  it('should use the default namespace when it is undefined', () => {
    const localPath = 'index.html';
    const {
      kind,
      metadata: { name },
    } = entity;
    const remoteBucket = getCloudPathForLocalPath(
      { kind, metadata: { name } } as Entity,
      localPath,
    );
    expect(remoteBucket).toBe(
      `${ENTITY_DEFAULT_NAMESPACE}/${entity.kind}/${entity.metadata.name}/${localPath}`,
    );
  });

  it('should throw error when entity is invalid', () => {
    expect(() => getCloudPathForLocalPath({} as Entity)).toThrow();
  });
});
