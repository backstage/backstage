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
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import {
  getStaleFiles,
  getFileTreeRecursively,
  getCloudPathForLocalPath,
  getHeadersForFileExtension,
  bulkStorageOperation,
  lowerCaseEntityTriplet,
  lowerCaseEntityTripletInStoragePath,
  normalizeExternalStorageRootPath,
  isValidContentPath,
} from './helpers';
import { createMockDirectory } from '@backstage/backend-test-utils';

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
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockDir.setContent({
      file1: '',
      subDirA: {
        file2: '',
        emptyDir1: {},
      },
      emptyDir2: {},
    });
  });

  it('returns complete file tree of a path', async () => {
    const fileList = await getFileTreeRecursively(mockDir.path);
    expect(fileList.length).toBe(2);
    expect(fileList).toContain(mockDir.resolve('file1'));
    expect(fileList).toContain(mockDir.resolve('subDirA/file2'));
  });
});

describe('lowerCaseEntityTriplet', () => {
  it('returns lower-cased entity triplet path', () => {
    const originalPath = 'default/Component/backstage/index.html';
    const actualPath = lowerCaseEntityTriplet(originalPath);
    expect(actualPath).toBe('default/component/backstage/index.html');
  });
});

describe('lowerCaseEntityTripletInStoragePath', () => {
  it('does not lowercase beyond the triplet', () => {
    const originalPath = 'default/Component/backstage/assets/IMAGE.png';
    const actualPath = lowerCaseEntityTripletInStoragePath(originalPath);
    expect(actualPath).toBe('default/component/backstage/assets/IMAGE.png');
  });

  it('throws error when there is no triplet', () => {
    const originalPath = '/default/component/IMAGE.png';
    const error = `Encountered file unmanaged by TechDocs ${originalPath}. Skipping.`;
    expect(() => lowerCaseEntityTripletInStoragePath(originalPath)).toThrow(
      error,
    );
  });
});

describe('normalizeExternalStorageRootPath', () => {
  it('returns an empty string when empty string provided', () => {
    const originalPath = '';
    const normalPath = normalizeExternalStorageRootPath(originalPath);
    expect(normalPath).toBe('');
  });
  it('returns an empty string when only separator is provided', () => {
    const originalPath = '/';
    const normalPath = normalizeExternalStorageRootPath(originalPath);
    expect(normalPath).toBe('');
  });
  it('returns normalized path from path with leading and trailing sep', () => {
    const originalPath = '/backstage-data/techdocs/';
    const normalPath = normalizeExternalStorageRootPath(originalPath);
    expect(normalPath).toBe('backstage-data/techdocs');
  });
  it('returns normalized path from path without leading and trailing sep', () => {
    const originalPath = 'backstage-data/techdocs';
    const normalPath = normalizeExternalStorageRootPath(originalPath);
    expect(normalPath).toBe('backstage-data/techdocs');
  });
  it('returns normalized path from path with trailing sep', () => {
    const originalPath = 'backstage-data/techdocs/';
    const normalPath = normalizeExternalStorageRootPath(originalPath);
    expect(normalPath).toBe('backstage-data/techdocs');
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

  it('should not return directories as stale files if they are parent directories of new files', () => {
    const oldFiles = [...defaultFiles, 'default/Component/backstage/foo'];
    const newFiles = [
      ...defaultFiles,
      'default/Component/backstage/foo/bar/index.html',
    ];
    const staleFiles = getStaleFiles(newFiles, oldFiles);
    expect(staleFiles).toHaveLength(0);
  });
});

describe('getCloudPathForLocalPath', () => {
  const entity: Entity = {
    apiVersion: 'version',
    metadata: { namespace: 'custom', name: 'backstage' },
    kind: 'Component',
  };

  it('should compose a remote bucket path including entity information', () => {
    const remoteBucket = getCloudPathForLocalPath(entity);
    expect(remoteBucket).toBe('custom/component/backstage/');
  });

  it('should compose a remote filename including entity information', () => {
    const localPath = 'index.html';
    const remoteBucket = getCloudPathForLocalPath(entity, localPath);
    expect(remoteBucket).toBe(`custom/component/backstage/${localPath}`);
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
      `${DEFAULT_NAMESPACE}/component/backstage/${localPath}`,
    );
  });

  it('should preserve case when legacy flag is passed', () => {
    const remoteBucket = getCloudPathForLocalPath(entity, undefined, true);
    expect(remoteBucket).toBe('custom/Component/backstage/');
  });

  it('should throw error when entity is invalid', () => {
    expect(() => getCloudPathForLocalPath({} as Entity)).toThrow();
  });

  it('should prepend root directory to destination', () => {
    const localPath = 'index/html';
    const rootPath = 'backstage-data/techdocs/';
    const remoteBucket = getCloudPathForLocalPath(
      entity,
      localPath,
      false,
      rootPath,
    );
    expect(remoteBucket).toBe(
      `backstage-data/techdocs/custom/component/backstage/${localPath}`,
    );
  });

  it('should add trailing separator to root directory', () => {
    const localPath = 'index/html';
    const rootPath = 'backstage-data/techdocs';
    const remoteBucket = getCloudPathForLocalPath(
      entity,
      localPath,
      false,
      rootPath,
    );
    expect(remoteBucket).toBe(
      `backstage-data/techdocs/custom/component/backstage/${localPath}`,
    );
  });

  it('should remove leading separator from root directory', () => {
    const localPath = 'index/html';
    const rootPath = '/backstage-data/techdocs/';
    const remoteBucket = getCloudPathForLocalPath(
      entity,
      localPath,
      false,
      rootPath,
    );
    expect(remoteBucket).toBe(
      `backstage-data/techdocs/custom/component/backstage/${localPath}`,
    );
  });

  it('should ignore separator if root directory is explicitly defined', () => {
    const localPath = 'index/html';
    const rootPath = '/';
    const remoteBucket = getCloudPathForLocalPath(
      entity,
      localPath,
      false,
      rootPath,
    );
    expect(remoteBucket).toBe(`custom/component/backstage/${localPath}`);
  });
});

describe('bulkStorageOperation', () => {
  const length = 26;
  const args = Array.from({ length });
  const createConcurrentRequestCounter = (
    callback: (count: number) => void,
  ) => {
    let count = 0;
    return () =>
      new Promise(resolve => {
        callback(++count);
        setTimeout(() => {
          count--;
          resolve(null);
        }, 100);
      });
  };

  it('should take care of rate limit by default', async () => {
    const operation = createConcurrentRequestCounter((count: number) => {
      expect(count <= 25).toBeTruthy();
    });
    await bulkStorageOperation(operation, args);
  });

  it('should accept the number of concurrency limit', async () => {
    const concurrencyLimit = 10;
    const operation = createConcurrentRequestCounter((count: number) => {
      expect(count <= concurrencyLimit).toBeTruthy();
    });
    await bulkStorageOperation(operation, args, { concurrencyLimit });
  });

  it('should wait for all promises be resolved', async () => {
    const callback = jest.fn();
    const operation = createConcurrentRequestCounter(callback);
    await bulkStorageOperation(operation, args);
    expect(callback).toHaveBeenCalledTimes(length);
  });

  it('should call operation with the correct argument', async () => {
    const files = ['file1.txt', 'file2.txt'];
    const fn = jest.fn();
    await bulkStorageOperation(fn, files);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, files[0]);
    expect(fn).toHaveBeenNthCalledWith(2, files[1]);
  });

  describe('isValidContentPath', () => {
    it('should return true when content path is the same as bucket root', () => {
      expect(isValidContentPath('/s/t', '/s/t')).toBe(true);
      expect(isValidContentPath('/s/t', '/s/t/c')).toBe(true);
      expect(isValidContentPath('/s/t', '/s/t/c w s/f.txt')).toBe(true);
      expect(isValidContentPath('/s/t w s/', '/s/t w s/f.txt')).toBe(true);
      expect(isValidContentPath('/s/t w s/', '/s/t w s/c w s/f.txt')).toBe(
        true,
      );
      expect(
        isValidContentPath('/s/t w s/', '/s/t w s/c w s/../c w s/f.txt'),
      ).toBe(true);
    });

    it('should return false when content path is not a child of bucket root', () => {
      expect(isValidContentPath('/s/t', '/s')).toBe(false);
      expect(isValidContentPath('/s/t', '/s/t w s')).toBe(false);
      expect(isValidContentPath('/s/t w s', '/s/c')).toBe(false);
      expect(isValidContentPath('/s/t', '/s/t/../../c/f.txt')).toBe(false);
    });
  });
});
