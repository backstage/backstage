/*
 * Copyright 2024 The Backstage Authors
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

jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import { join as joinPath } from 'path';
import fs from 'fs-extra';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchTemplateFileAction } from './templateFile';
import {
  ActionContext,
  TemplateAction,
  fetchFile,
} from '@backstage/plugin-scaffolder-node';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

type FetchTemplateInput = ReturnType<
  typeof createFetchTemplateFileAction
> extends TemplateAction<infer U>
  ? U
  : never;

const mockFetchFile = fetchFile as jest.MockedFunction<typeof fetchFile>;

describe('fetch:template:file', () => {
  let action: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');
  const mockContext = (inputPatch: Partial<FetchTemplateInput> = {}) =>
    createMockActionContext({
      templateInfo: {
        baseUrl: 'base-url',
        entityRef: 'template:default/test-template',
      },
      input: {
        url: './skeleton.txt',
        targetPath: './target/skeleton.txt',
        values: {
          test: 'value',
        },
        ...inputPatch,
      },
      workspacePath,
    });

  beforeEach(() => {
    mockDir.setContent({
      workspace: {},
    });
    action = createFetchTemplateFileAction({
      reader: Symbol('UrlReader') as unknown as UrlReaderService,
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  it(`returns a TemplateAction with the id 'fetch:template:file'`, () => {
    expect(action.id).toEqual('fetch:template:file');
  });

  describe('handler', () => {
    it('should disallow a target path outside working directory', async () => {
      await expect(
        action.handler(mockContext({ targetPath: '../' })),
      ).rejects.toThrow(
        /Relative path is not allowed to refer to a directory outside its parent/,
      );
    });

    describe('valid input', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          values: {
            name: 'test-project',
            count: 1234,
            itemList: ['first', 'second', 'third'],
          },
          token: 'mockToken',
        });

        mockFetchFile.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]:
              '${{ values.name }}: ${{ values.count }} ${{ values.itemList | dump }}',
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('uses fetchFile to retrieve the template content', () => {
        expect(mockFetchFile).toHaveBeenCalledWith(
          expect.objectContaining({
            baseUrl: context.templateInfo?.baseUrl,
            fetchUrl: context.input.url,
          }),
        );
      });

      it('passed through the token to fetchFile', () => {
        expect(mockFetchFile).toHaveBeenCalledWith(
          expect.objectContaining({
            token: 'mockToken',
          }),
        );
      });

      it('templates content successfully', async () => {
        await expect(
          fs.readFile(
            joinPath(workspacePath, context.input.targetPath),
            'utf-8',
          ),
        ).resolves.toEqual('test-project: 1234 ["first","second","third"]');
      });
    });

    describe('with replacement of existing files', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          url: './static-content.txt',
          targetPath: './target/static-content.txt',
          values: {
            name: 'test-project',
            count: 1234,
          },
          replace: true,
        });

        mockDir.setContent({
          [joinPath(workspacePath, 'target')]: {
            'static-content.txt': 'static-content',
          },
        });

        mockFetchFile.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]: '${{ values.name }}: ${{ values.count }}',
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('overwrites existing file', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8'),
        ).resolves.toEqual('test-project: 1234');
      });
    });

    describe('without replacement of existing files', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          url: './static-content.txt',
          targetPath: './target/static-content.txt',
          values: {
            name: 'test-project',
            count: 1234,
          },
          replace: false,
        });

        mockDir.setContent({
          [joinPath(workspacePath, 'target')]: {
            'static-content.txt': 'static-content',
          },
        });

        mockFetchFile.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]: '${{ values.name }}: ${{ values.count }}',
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('keeps existing file', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8'),
        ).resolves.toEqual('static-content');
      });
    });

    describe('cookiecutter compatibility mode', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          targetPath: './target/test-project.txt',
          values: {
            name: 'test-project',
            count: 1234,
            itemList: ['first', 'second', 'third'],
          },
          cookiecutterCompat: true,
        });

        mockFetchFile.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]:
              'static:{{ cookiecutter.name }}:{{ cookiecutter.count }}:{{ cookiecutter.itemList | jsonify }}',
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('copies files with cookiecutter-style templated variables successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
        ).resolves.toEqual(
          'static:test-project:1234:["first","second","third"]',
        );
      });
    });
  });
});
