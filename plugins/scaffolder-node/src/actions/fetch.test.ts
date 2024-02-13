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
import { resolve as resolvePath } from 'path';
import { UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents, fetchFile } from './fetch';
import os from 'os';

describe('fetchContents helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
  const reader: UrlReader = {
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
      await fetchContents({
        ...options,
        outputPath: 'foo',
        fetchUrl: 'https://github.com/backstage/foo',
      });
      expect(fs.ensureDir).toHaveBeenCalledWith('foo');
      expect(dirFunction).toHaveBeenCalledWith({ targetDir: 'foo' });
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
      expect(fs.outputFile).toHaveBeenCalledWith('foo', 'test');
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
      expect(fs.outputFile).toHaveBeenCalledWith('mydir/foo', 'test');
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
