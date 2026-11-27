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

jest.mock('fs-extra');

import fs from 'fs-extra';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents, fetchFile } from './fetch';
import os from 'node:os';

describe('fetchContents helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // The .git directory check reads the extracted tree; default to an
    // empty one unless a test overrides it
    (fs.readdir as unknown as jest.Mock).mockResolvedValue([]);
  });

  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const readUrl = jest.fn();
  const readTree = jest.fn();
  const reader: UrlReaderService = {
    readUrl,
    readTree,
    search: jest.fn(),
  };

  const options = {
    reader,
    integrations,
    outputPath: os.tmpdir(),
  };

  describe('fetch contents', () => {
    it('should reject absolute file locations', async () => {
      await expect(
        fetchContents({
          ...options,
          baseUrl: 'file:///some/path',
          fetchUrl: '/etc/passwd',
        }),
      ).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should reject relative file locations that exit the baseUrl', async () => {
      await expect(
        fetchContents({
          ...options,
          baseUrl: 'file:///some/path',
          fetchUrl: '../test',
        }),
      ).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should copy file to outputpath', async () => {
      await fetchContents({
        ...options,
        baseUrl: 'file:///some/path',
        fetchUrl: 'foo',
        outputPath: 'somepath',
      });
      expect(fs.copy).toHaveBeenCalledWith(
        resolvePath('/some/foo'),
        'somepath',
        expect.objectContaining({ filter: expect.any(Function) }),
      );
    });

    it('should reject if no integration matches location', async () => {
      await expect(
        fetchContents({
          ...options,
          baseUrl: 'http://example.com/some/folder',
        }),
      ).rejects.toThrow(
        'No integration found for location http://example.com/some/folder',
      );
    });

    it('should reject if fetch url is relative and no base url is specified', async () => {
      await expect(
        fetchContents({
          ...options,
          fetchUrl: 'foo',
        }),
      ).rejects.toThrow(
        'Failed to fetch, template location could not be determined and the fetch URL is relative, foo',
      );
    });

    it('should fetch url contents', async () => {
      const dirFunction = jest.fn();
      readTree.mockResolvedValue({
        dir: dirFunction,
      });
      (fs.mkdtemp as unknown as jest.Mock).mockResolvedValue('/tmp/staging');
      await fetchContents({
        ...options,
        outputPath: 'foo',
        fetchUrl: 'https://github.com/backstage/foo',
      });
      // The staging directory is created next to the target directory, not
      // in the system temp folder
      expect(fs.mkdtemp).toHaveBeenCalledWith(
        join(dirname(resolvePath('foo')), 'fetch-'),
      );
      expect(fs.ensureDir).toHaveBeenCalledWith('foo');
      expect(dirFunction).toHaveBeenCalledWith({ targetDir: '/tmp/staging' });
      expect(fs.copy).toHaveBeenCalledWith('/tmp/staging', 'foo');
      expect(fs.remove).toHaveBeenCalledWith('/tmp/staging');
    });

    it('should pass through the token provided through to the URL reader', async () => {
      await fetchContents({
        ...options,
        outputPath: 'mydir/foo',
        fetchUrl: 'https://github.com/backstage/foo',
        token: 'mockToken',
      });

      expect(readTree).toHaveBeenCalledWith(
        'https://github.com/backstage/foo',
        expect.objectContaining({ token: 'mockToken' }),
      );
    });

    it('should reject fetched trees that contain a .git directory', async () => {
      const dirFunction = jest.fn();
      readTree.mockResolvedValue({
        dir: dirFunction,
      });
      (fs.mkdtemp as unknown as jest.Mock).mockResolvedValue('/tmp/staging');
      (fs.readdir as unknown as jest.Mock).mockImplementation(
        async (dir: string) => {
          if (dir === '/tmp/staging/subdir') {
            return [{ name: '.GIT', isDirectory: () => true }];
          }
          return [
            { name: 'README.md', isDirectory: () => false },
            { name: 'subdir', isDirectory: () => true },
          ];
        },
      );

      await expect(
        fetchContents({
          ...options,
          outputPath: 'foo',
          fetchUrl: 'https://github.com/backstage/foo',
        }),
      ).rejects.toThrow(/contains a \.git directory/);

      expect(dirFunction).toHaveBeenCalledWith({ targetDir: '/tmp/staging' });
      // The target directory is left alone when the fetched tree is rejected
      expect(fs.copy).not.toHaveBeenCalled();
      expect(fs.remove).toHaveBeenCalledWith('/tmp/staging');
    });

    it('should not reject fetched trees when the target already contains a .git directory', async () => {
      const dirFunction = jest.fn();
      readTree.mockResolvedValue({
        dir: dirFunction,
      });
      (fs.mkdtemp as unknown as jest.Mock).mockResolvedValue('/tmp/staging');
      (fs.readdir as unknown as jest.Mock).mockImplementation(
        async (dir: string) => {
          // Only the target directory carries a pre-existing .git directory,
          // the fetched tree staged for extraction is clean
          if (dir === 'foo') {
            return [{ name: '.git', isDirectory: () => true }];
          }
          return [];
        },
      );

      await expect(
        fetchContents({
          ...options,
          outputPath: 'foo',
          fetchUrl: 'https://github.com/backstage/foo',
        }),
      ).resolves.toBeUndefined();

      expect(fs.copy).toHaveBeenCalledWith('/tmp/staging', 'foo');
    });
  });

  describe('fetch file', () => {
    it('should reject absolute file locations', async () => {
      await expect(
        fetchFile({
          ...options,
          baseUrl: 'file:///some/path',
          fetchUrl: '/etc/passwd',
        }),
      ).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should reject relative file locations that exit the baseUrl', async () => {
      await expect(
        fetchFile({
          ...options,
          baseUrl: 'file:///some/path',
          fetchUrl: '../test',
        }),
      ).rejects.toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should copy file to outputpath', async () => {
      await fetchFile({
        ...options,
        baseUrl: 'file:///some/path',
        fetchUrl: 'foo',
        outputPath: 'somepath',
      });
      expect(fs.copyFile).toHaveBeenCalledWith(
        resolvePath('/some/foo'),
        'somepath',
      );
    });

    it('should reject if no integration matches location', async () => {
      await expect(
        fetchFile({
          ...options,
          baseUrl: 'http://example.com/some/folder',
        }),
      ).rejects.toThrow(
        'No integration found for location http://example.com/some/folder',
      );
    });

    it('should reject if fetch url is relative and no base url is specified', async () => {
      await expect(
        fetchFile({
          ...options,
          fetchUrl: 'foo',
        }),
      ).rejects.toThrow(
        'Failed to fetch, template location could not be determined and the fetch URL is relative, foo',
      );
    });

    it('should fetch content from url', async () => {
      readUrl.mockResolvedValue({
        buffer: () => Buffer.from('test', 'utf8'),
      });
      await fetchFile({
        ...options,
        outputPath: 'foo',
        fetchUrl: 'https://github.com/backstage/foo',
      });
      expect(fs.ensureDir).toHaveBeenCalledWith('.');
      expect(fs.outputFile).toHaveBeenCalledWith(
        'foo',
        Buffer.from([116, 101, 115, 116]),
      );
    });

    it('should fetch binary content from url', async () => {
      readUrl.mockResolvedValue({
        buffer: () => Buffer.from([0, 1, 2, 3, 255, 254, 253, 252]),
      });
      await fetchFile({
        ...options,
        outputPath: 'foo',
        fetchUrl: 'https://github.com/backstage/foo',
      });
      expect(fs.ensureDir).toHaveBeenCalledWith('.');
      expect(fs.outputFile).toHaveBeenCalledWith(
        'foo',
        Buffer.from([0, 1, 2, 3, 255, 254, 253, 252]),
      );
    });

    it('should fetch content from url into directory', async () => {
      readUrl.mockResolvedValue({
        buffer: () => Buffer.from('test', 'utf8'),
      });
      await fetchFile({
        ...options,
        outputPath: 'mydir/foo',
        fetchUrl: 'https://github.com/backstage/foo',
      });
      expect(fs.ensureDir).toHaveBeenCalledWith('mydir');
      expect(fs.outputFile).toHaveBeenCalledWith(
        'mydir/foo',
        Buffer.from([116, 101, 115, 116]),
      );
    });

    it('should pass through the token provided through to the URL reader', async () => {
      await fetchFile({
        ...options,
        outputPath: 'mydir/foo',
        fetchUrl: 'https://github.com/backstage/foo',
        token: 'mockToken',
      });

      expect(readUrl).toHaveBeenCalledWith(
        'https://github.com/backstage/foo',
        expect.objectContaining({ token: 'mockToken' }),
      );
    });
  });
});
