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

import { join as joinPath, sep as pathSep } from 'path';
import fs from 'fs-extra';
import { UrlReader } from '@backstage/backend-common';
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createFetchTemplateAction } from './template';
import {
  ActionContext,
  TemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './template.examples';
import yaml from 'yaml';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));

type FetchTemplateInput = ReturnType<
  typeof createFetchTemplateAction
> extends TemplateAction<infer U>
  ? U
  : never;

const aBinaryFile = fs.readFileSync(
  resolvePackagePath(
    '@backstage/plugin-scaffolder-backend',
    'fixtures/test-nested-template/public/react-logo192.png',
  ),
);

const mockFetchContents = fetchContents as jest.MockedFunction<
  typeof fetchContents
>;

describe('fetch:template examples', () => {
  let action: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const mockContext = (input: any) =>
    createMockActionContext({
      templateInfo: {
        baseUrl: 'base-url',
        entityRef: 'template:default/test-template',
      },
      input,
      workspacePath,
    });

  beforeEach(() => {
    mockDir.clear();
    action = createFetchTemplateAction({
      reader: Symbol('UrlReader') as unknown as UrlReader,
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  describe('handler', () => {
    describe('with valid input', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext(yaml.parse(examples[0].example).steps[0].input);

        mockFetchContents.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]: {
              'an-executable.sh': ctx =>
                fs.writeFileSync(ctx.path, '#!/usr/bin/env bash', {
                  encoding: 'utf8',
                  mode: parseInt('100755', 8),
                }),
              'empty-dir-${{ values.count }}': {},
              'static.txt': 'static content',
              '${{ values.name }}.txt': 'static content',
              subdir: {
                'templated-content.txt':
                  '${{ values.name }}: ${{ values.count }}',
              },
              '.${{ values.name }}': '${{ values.itemList | dump }}',
              'a-binary-file.png': aBinaryFile,
              symlink: ctx => ctx.symlink('a-binary-file.png'),
              brokenSymlink: ctx => ctx.symlink('./not-a-real-file.txt'),
            },
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('uses fetchContents to retrieve the template content', () => {
        expect(mockFetchContents).toHaveBeenCalledWith(
          expect.objectContaining({
            baseUrl: context.templateInfo?.baseUrl,
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

      it('copies files and maintains the original file permissions', async () => {
        await expect(
          fs
            .stat(`${workspacePath}/target/an-executable.sh`)
            .then(fObj => fObj.mode),
        ).resolves.toEqual(parseInt('100755', 8));
      });

      it('copies file symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/symlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.realpath(`${workspacePath}/target/symlink`),
        ).resolves.toBe(
          fs.realpathSync(
            joinPath(workspacePath, 'target', 'a-binary-file.png'),
          ),
        );
      });

      it('copies broken symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/brokenSymlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.readlink(`${workspacePath}/target/brokenSymlink`),
        ).resolves.toEqual(`.${pathSep}not-a-real-file.txt`);
      });
    });
  });
});
