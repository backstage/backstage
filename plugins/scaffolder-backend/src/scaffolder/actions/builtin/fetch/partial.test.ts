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

import os from 'os';
import { join as joinPath, resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { PassThrough } from 'stream';
import { fetchContents } from './helpers';
import { ActionContext, TemplateAction } from '../../types';
import { createFetchPartialAction, FetchPartialInput } from './partial';

jest.mock('./helpers', () => ({
  fetchContents: jest.fn(),
}));

const aBinaryFile = fs.readFileSync(
  resolvePath(
    'src',
    '../fixtures/test-nested-template/public/react-logo192.png',
  ),
);

const mockFetchContents = fetchContents as jest.MockedFunction<
  typeof fetchContents
>;

describe('fetch:partial', () => {
  let action: TemplateAction<any>;

  const workspacePath = os.tmpdir();
  const createTemporaryDirectory: jest.MockedFunction<
    ActionContext<FetchPartialInput>['createTemporaryDirectory']
  > = jest.fn(() =>
    Promise.resolve(
      joinPath(workspacePath, `${createTemporaryDirectory.mock.calls.length}`),
    ),
  );

  const logger = getVoidLogger();

  const mockContext = (inputPatch: Partial<FetchPartialInput> = {}) => ({
    baseUrl: 'base-url',
    input: {
      url: './skeleton',
      targetPath: './target',
      values: {
        test: 'value',
      },
      ...inputPatch,
    },
    output: jest.fn(),
    logStream: new PassThrough(),
    logger,
    workspacePath,
    createTemporaryDirectory,
  });

  beforeEach(() => {
    mockFs();

    action = createFetchPartialAction({
      reader: Symbol('UrlReader') as unknown as UrlReader,
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it(`returns a TemplateAction with the id 'fetch:partial'`, () => {
    expect(action.id).toEqual('fetch:partial');
  });

  describe('handler', () => {
    it('throws if output directory is outside the workspace', async () => {
      await expect(() =>
        action.handler(mockContext({ targetPath: '../' })),
      ).rejects.toThrowError(
        /relative path is not allowed to refer to a directory outside its parent/i,
      );
    });

    describe('with valid input', () => {
      let context: ActionContext<FetchPartialInput>;

      beforeEach(async () => {
        context = mockContext({
          values: {
            name: 'test-project',
            count: 1234,
            itemList: ['first', 'second', 'third'],
          },
        });

        mockFetchContents.mockImplementation(({ outputPath }) => {
          mockFs({
            [outputPath]: {
              'empty-dir-${{ values.count }}': {},
              'static.txt': 'static content',
              '${{ values.name }}.txt': 'static content',
              subdir: {
                'templated-content.txt.njk':
                  '${{ values.name }}: ${{ values.count }}',
              },
              '.${{ values.name }}.njk': '${{ values.itemList | dump }}',
              'a-binary-file.png': aBinaryFile,
            },
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('uses fetchContents to retrieve the template content', () => {
        expect(mockFetchContents).toHaveBeenCalledWith(
          expect.objectContaining({
            baseUrl: context.baseUrl,
            fetchUrl: context.input.url,
          }),
        );
      });

      it('copies files with no templating in names or content successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/static.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated names successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated content successfully', async () => {
        await expect(
          fs.readFile(
            `${workspacePath}/target/subdir/templated-content.txt`,
            'utf-8',
          ),
        ).resolves.toEqual('test-project: 1234');
      });

      it('processes dotfiles', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/.test-project`, 'utf-8'),
        ).resolves.toEqual('["first","second","third"]');
      });

      it('copies empty directories', async () => {
        await expect(
          fs.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8'),
        ).resolves.toEqual([]);
      });

      it('copies binary files as-is without processing them', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/a-binary-file.png`),
        ).resolves.toEqual(aBinaryFile);
      });
    });

    describe('with specified .jinja2 extension', () => {
      let context: ActionContext<FetchPartialInput>;

      beforeEach(async () => {
        context = mockContext({
          extension: '.jinja2',
          values: {
            name: 'test-project',
            count: 1234,
          },
        });

        mockFetchContents.mockImplementation(({ outputPath }) => {
          mockFs({
            [outputPath]: {
              '${{ values.name }}.njk':
                '${{ values.name }}: ${{ values.count }}',
              '${{ values.name }}.txt.jinja2':
                '${{ values.name }}: ${{ values.count }}',
            },
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('does not process .njk files', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.njk`, 'utf-8'),
        ).resolves.toEqual('${{ values.name }}: ${{ values.count }}');
      });

      it('does process .jinja2 files', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
        ).resolves.toEqual('test-project: 1234');
      });
    });
  });
});
