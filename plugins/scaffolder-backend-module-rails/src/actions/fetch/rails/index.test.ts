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

const mockRailsTemplater = { run: jest.fn() };
jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));
jest.mock('./railsNewRunner', () => {
  return {
    RailsNewRunner: jest.fn().mockImplementation(() => {
      return mockRailsTemplater;
    }),
  };
});

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { resolve as resolvePath } from 'path';
import { createFetchRailsAction } from './index';
import { fetchContents } from '@backstage/plugin-scaffolder-node';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Writable } from 'stream';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ContainerRunner } from './ContainerRunner';

describe('fetch:rails', () => {
  const mockDir = createMockDirectory();
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
    }),
  );

  const mockContext = createMockActionContext({
    input: {
      url: 'https://rubyonrails.org/generator',
      targetPath: 'something',
      values: {
        help: 'me',
      },
    },
    templateInfo: {
      baseUrl: 'somebase',
      entityRef: 'template:default/myTemplate',
    },
    workspacePath: mockDir.path,
  });

  const mockReader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };
  const containerRunner: ContainerRunner = {
    runContainer: jest.fn(),
  };

  const action = createFetchRailsAction({
    integrations,
    reader: mockReader,
    containerRunner,
    allowedImageNames: ['foo/rails-custom-image'],
  });

  beforeEach(() => {
    mockDir.setContent({
      result: '{}',
    });
    jest.clearAllMocks();
  });

  it('should call fetchContents with the correct values', async () => {
    await action.handler(mockContext);

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.templateInfo?.baseUrl,
      fetchUrl: mockContext.input.url,
      outputPath: resolvePath(mockContext.workspacePath),
    });
  });

  it('should execute the rails templater with the correct values', async () => {
    await action.handler(mockContext);

    expect(mockRailsTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockContext.workspacePath,
      logStream: expect.any(Writable),
      values: mockContext.input.values,
    });
  });

  it('should execute the rails templater with optional inputs if they are present and valid', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        imageName: 'foo/rails-custom-image',
      },
    });

    expect(mockRailsTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockContext.workspacePath,
      logStream: expect.any(Writable),
      values: {
        ...mockContext.input.values,
        imageName: 'foo/rails-custom-image',
      },
    });
  });

  it('should not allow unknown images', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          imageName: 'foo/bar',
        },
      }),
    ).rejects.toThrow('Image foo/bar is not allowed');
  });

  it('should not allow any images', async () => {
    const action2 = createFetchRailsAction({
      integrations,
      reader: mockReader,
      containerRunner,
    });
    await expect(
      action2.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          imageName: 'foo/rails-custom-image',
        },
      }),
    ).rejects.toThrow('Image foo/rails-custom-image is not allowed');
  });

  it('should throw if the target directory is outside of the workspace path', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          targetPath: '/foo',
        },
      }),
    ).rejects.toThrow(
      /targetPath may not specify a path outside the working directory/,
    );
  });
});
