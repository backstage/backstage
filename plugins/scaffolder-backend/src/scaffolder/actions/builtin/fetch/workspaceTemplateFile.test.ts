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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { ScmIntegrations } from '@backstage/integration';
import {
  ActionContext,
  TemplateAction,
} from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import fs from 'fs-extra';
import { join as joinPath } from 'path';
import { createWorkspaceTemplateFileAction } from './workspaceTemplateFile';

type WorkspaceTemplateInput = ReturnType<
  typeof createWorkspaceTemplateFileAction
> extends TemplateAction<infer U>
  ? U
  : never;

describe('fetch:template:file', () => {
  let action: TemplateAction<any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');
  const mockContext = (inputPatch: Partial<WorkspaceTemplateInput> = {}) =>
    createMockActionContext({
      templateInfo: {
        baseUrl: 'base-url',
        entityRef: 'template:default/test-template',
      },
      input: {
        sourcePath: './skeleton.txt',
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
    action = createWorkspaceTemplateFileAction({
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  it(`returns a TemplateAction with the id 'workspace:template:file'`, () => {
    expect(action.id).toEqual('workspace:template:file');
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
      let context: ActionContext<WorkspaceTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          values: {
            name: 'test-project',
            count: 1234,
            itemList: ['first', 'second', 'third'],
          },
        });

        mockDir.setContent({
          workspace: {
            'skeleton.txt':
              '${{ values.name }}: ${{ values.count }} ${{ values.itemList | dump }}',
          },
        });

        await action.handler(context);
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
      let context: ActionContext<WorkspaceTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          sourcePath: './static-content.txt',
          targetPath: './target/static-content.txt',
          values: {
            name: 'test-project',
            count: 1234,
          },
          replace: true,
        });

        mockDir.setContent({
          workspace: {
            'static-content.txt': '${{ values.name }}: ${{ values.count }}',
            target: {
              'static-content.txt': 'static-content',
            },
          },
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
      let context: ActionContext<WorkspaceTemplateInput>;

      beforeEach(async () => {
        context = mockContext({
          sourcePath: './static-content.txt',
          targetPath: './target/static-content.txt',
          values: {
            name: 'test-project',
            count: 1234,
          },
          replace: false,
        });

        mockDir.setContent({
          workspace: {
            'static-content.txt': '${{ values.name }}: ${{ values.count }}',
            target: {
              'static-content.txt': 'static-content',
            },
          },
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
      let context: ActionContext<WorkspaceTemplateInput>;

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

        mockDir.setContent({
          workspace: {
            'skeleton.txt':
              'static:{{ cookiecutter.name }}:{{ cookiecutter.count }}:{{ cookiecutter.itemList | jsonify }}',
          },
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
