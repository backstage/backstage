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

import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { ScmIntegrations } from '@backstage/integration';
import { createMockDirectory } from '@backstage/backend-test-utils';
import {
  createFetchCookiecutterAction,
  CookiecutterRunner,
} from './cookiecutter';
import { join } from 'path';
import type { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { Writable, PassThrough } from 'stream';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ContainerRunner } from './ContainerRunner';

const executeShellCommand = jest.fn();
const commandExists = jest.fn();
const fetchContents = jest.fn();

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: (...args: any[]) => fetchContents(...args),
  executeShellCommand: (...args: any[]) => executeShellCommand(...args),
}));

jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);

describe('fetch:cookiecutter', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });
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

  const mockTmpDir = mockDir.path;

  let mockContext: ActionContext<{
    url: string;
    targetPath?: string;
    values: JsonObject;
    copyWithoutRender?: string[];
    extensions?: string[];
    imageName?: string;
  }>;

  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  const mockReader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const action = createFetchCookiecutterAction({
    integrations,
    containerRunner,
    reader: mockReader,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockContext = createMockActionContext({
      input: {
        url: 'https://google.com/cookie/cutter',
        targetPath: 'something',
        values: {
          help: 'me',
        },
      },
      templateInfo: {
        entityRef: 'template:default/cookiecutter',
        baseUrl: 'somebase',
      },
      workspacePath: mockTmpDir,
    });
    mockDir.setContent({ template: {} });

    commandExists.mockResolvedValue(null);

    // Mock when run container is called it creates some new files in the mock filesystem
    containerRunner.runContainer.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });

    // Mock when executeShellCommand is called it creates some new files in the mock filesystem
    executeShellCommand.mockImplementation(async () => {
      mockDir.setContent({
        'intermediate/testfile.json': '{}',
      });
    });
  });

  it('should throw an error when copyWithoutRender is not an array', async () => {
    (mockContext.input as any).copyWithoutRender = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrow(
      /Fetch action input copyWithoutRender must be an Array/,
    );
  });

  it('should throw an error when extensions is not an array', async () => {
    (mockContext.input as any).extensions = 'not an array';

    await expect(action.handler(mockContext)).rejects.toThrow(
      /Fetch action input extensions must be an Array/,
    );
  });

  it('should call fetchContents with the correct variables', async () => {
    fetchContents.mockImplementation(() => Promise.resolve());
    await action.handler(mockContext);
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        reader: mockReader,
        integrations,
        baseUrl: mockContext.templateInfo?.baseUrl,
        fetchUrl: mockContext.input.url,
        outputPath: join(
          mockTmpDir,
          'template',
          "{{cookiecutter and 'contents'}}",
        ),
      }),
    );
  });

  it('should call out to cookiecutter using executeShellCommand when cookiecutter is installed', async () => {
    commandExists.mockResolvedValue(true);

    await action.handler(mockContext);

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'cookiecutter',
        args: [
          '--no-input',
          '-o',
          join(mockTmpDir, 'intermediate'),
          join(mockTmpDir, 'template'),
          '--verbose',
        ],
        logStream: expect.any(Writable),
      }),
    );
  });

  it('should call out to the containerRunner when there is no cookiecutter installed', async () => {
    commandExists.mockResolvedValue(false);

    await action.handler(mockContext);

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName: 'spotify/backstage-cookiecutter',
        command: 'cookiecutter',
        args: ['--no-input', '-o', '/output', '/input', '--verbose'],
        mountDirs: {
          [join(mockTmpDir, 'intermediate')]: '/output',
          [join(mockTmpDir, 'template')]: '/input',
        },
        workingDir: '/input',
        envVars: { HOME: '/tmp' },
        logStream: expect.any(Writable),
      }),
    );
  });

  it('should use a custom imageName when there is an image supplied to the context', async () => {
    const imageName = 'test-image';
    mockContext.input.imageName = imageName;

    await action.handler(mockContext);

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName,
      }),
    );
  });

  it('should throw error if cookiecutter is not installed and containerRunner is undefined', async () => {
    commandExists.mockResolvedValue(false);
    const ccAction = createFetchCookiecutterAction({
      integrations,
      reader: mockReader,
    });

    await expect(ccAction.handler(mockContext)).rejects.toThrow(
      /Invalid state: containerRunner cannot be undefined when cookiecutter is not installed/,
    );
  });

  it('should handle array and object values correctly in cookiecutter.json', async () => {
    // Mock that cookiecutter is installed
    commandExists.mockResolvedValue(true);

    const testValues = {
      stringValue: 'test',
      arrayValue: [
        { name: 'item1', type: 'typeA' },
        { name: 'item2', type: 'typeB' },
      ],
      objectValue: {
        nested: {
          property: 'value',
        },
      },
    };

    const workspacePath = mockTmpDir;
    const templateDir = join(workspacePath, 'template');
    const templateContentsDir = join(templateDir, 'contents');

    // Set up a cookiecutter.json in the template contents directory
    mockDir.setContent({
      'template/contents/cookiecutter.json': JSON.stringify({
        project_name: 'default',
      }),
    });

    // Mock executeShellCommand to capture the cookiecutter.json and avoid running actual cookiecutter
    let capturedCookiecutterJson: any = null;
    executeShellCommand.mockImplementation(async () => {
      // Capture the cookiecutter.json content before it's processed
      const cookiecutterJsonContent = mockDir.content({ path: 'template' });
      if (
        cookiecutterJsonContent &&
        typeof cookiecutterJsonContent === 'object' &&
        'cookiecutter.json' in cookiecutterJsonContent
      ) {
        capturedCookiecutterJson = JSON.parse(
          cookiecutterJsonContent['cookiecutter.json'] as string,
        );
      }

      // Create output that cookiecutter would normally create
      mockDir.setContent({
        'intermediate/testproject': {},
      });
    });

    const runner = new CookiecutterRunner({});
    const logStream = new PassThrough();

    await runner.run({
      workspacePath,
      values: testValues,
      logStream,
      templateDir,
      templateContentsDir,
    });

    // Verify that the cookiecutter.json was written with correct structure
    expect(capturedCookiecutterJson).toBeDefined();
    expect(capturedCookiecutterJson.stringValue).toBe('test');
    expect(Array.isArray(capturedCookiecutterJson.arrayValue)).toBe(true);
    expect(capturedCookiecutterJson.arrayValue).toHaveLength(2);
    expect(capturedCookiecutterJson.arrayValue[0]).toEqual({
      name: 'item1',
      type: 'typeA',
    });
    expect(capturedCookiecutterJson.arrayValue[1]).toEqual({
      name: 'item2',
      type: 'typeB',
    });
    expect(typeof capturedCookiecutterJson.objectValue).toBe('object');
    expect(capturedCookiecutterJson.objectValue.nested.property).toBe('value');

    // Verify these are not stringified versions
    expect(typeof capturedCookiecutterJson.arrayValue).not.toBe('string');
    expect(typeof capturedCookiecutterJson.objectValue).not.toBe('string');
  });

  it('should automatically parse JSON strings back to objects/arrays', async () => {
    // Mock that cookiecutter is installed
    commandExists.mockResolvedValue(true);

    // Simulate the issue: arrays/objects passed as JSON strings instead of actual arrays/objects
    const problematicValues = {
      stringValue: 'test',
      // This is what might be happening - arrays being passed as JSON strings
      arrayValue:
        '[{"name":"item1","type":"typeA"},{"name":"item2","type":"typeB"}]',
      objectValue: '{"nested":{"property":"value"}}',
    };

    const workspacePath = mockTmpDir;
    const templateDir = join(workspacePath, 'template');
    const templateContentsDir = join(templateDir, 'contents');

    // Set up a cookiecutter.json in the template contents directory
    mockDir.setContent({
      'template/contents/cookiecutter.json': JSON.stringify({
        project_name: 'default',
      }),
    });

    // Mock executeShellCommand to capture the cookiecutter.json and avoid running actual cookiecutter
    let capturedCookiecutterJson: any = null;
    executeShellCommand.mockImplementation(async () => {
      // Capture the cookiecutter.json content before it's processed
      const cookiecutterJsonContent = mockDir.content({ path: 'template' });
      if (
        cookiecutterJsonContent &&
        typeof cookiecutterJsonContent === 'object' &&
        'cookiecutter.json' in cookiecutterJsonContent
      ) {
        capturedCookiecutterJson = JSON.parse(
          cookiecutterJsonContent['cookiecutter.json'] as string,
        );
      }

      // Create output that cookiecutter would normally create
      mockDir.setContent({
        'intermediate/testproject': {},
      });
    });

    const runner = new CookiecutterRunner({});
    const logStream = new PassThrough();

    await runner.run({
      workspacePath,
      values: problematicValues,
      logStream,
      templateDir,
      templateContentsDir,
    });

    // With the fix, these should now be parsed back to proper objects/arrays
    expect(capturedCookiecutterJson).toBeDefined();
    expect(capturedCookiecutterJson.stringValue).toBe('test');

    // The fix should convert JSON strings back to proper arrays/objects
    expect(Array.isArray(capturedCookiecutterJson.arrayValue)).toBe(true);
    expect(capturedCookiecutterJson.arrayValue).toHaveLength(2);
    expect(capturedCookiecutterJson.arrayValue[0]).toEqual({
      name: 'item1',
      type: 'typeA',
    });
    expect(capturedCookiecutterJson.arrayValue[1]).toEqual({
      name: 'item2',
      type: 'typeB',
    });
    expect(typeof capturedCookiecutterJson.objectValue).toBe('object');
    expect(capturedCookiecutterJson.objectValue.nested.property).toBe('value');
  });

  it('should handle edge cases when parsing JSON strings', async () => {
    // Mock that cookiecutter is installed
    commandExists.mockResolvedValue(true);

    // Test various edge cases
    const edgeCaseValues = {
      normalString: 'just a regular string',
      emptyArray: '[]',
      emptyObject: '{}',
      numberAsString: '42',
      booleanAsString: 'true',
      invalidJson: '[invalid json}',
      stringThatLooksLikeJson: '[this looks like json but is not]',
      nestedObject: '{"level1":{"level2":{"value":"deep"}}}',
      arrayOfPrimitives: '[1, 2, "three", true, null]',
      quotedStringValue: '"quoted string"',
      nullValue: null,
      undefinedValue: undefined,
    };

    const workspacePath = mockTmpDir;
    const templateDir = join(workspacePath, 'template');
    const templateContentsDir = join(templateDir, 'contents');

    // Set up a cookiecutter.json in the template contents directory
    mockDir.setContent({
      'template/contents/cookiecutter.json': JSON.stringify({
        project_name: 'default',
      }),
    });

    // Mock executeShellCommand to capture the cookiecutter.json and avoid running actual cookiecutter
    let capturedCookiecutterJson: any = null;
    executeShellCommand.mockImplementation(async () => {
      // Capture the cookiecutter.json content before it's processed
      const cookiecutterJsonContent = mockDir.content({ path: 'template' });
      if (
        cookiecutterJsonContent &&
        typeof cookiecutterJsonContent === 'object' &&
        'cookiecutter.json' in cookiecutterJsonContent
      ) {
        capturedCookiecutterJson = JSON.parse(
          cookiecutterJsonContent['cookiecutter.json'] as string,
        );
      }

      // Create output that cookiecutter would normally create
      mockDir.setContent({
        'intermediate/testproject': {},
      });
    });

    const runner = new CookiecutterRunner({});
    const logStream = new PassThrough();

    await runner.run({
      workspacePath,
      values: edgeCaseValues,
      logStream,
      templateDir,
      templateContentsDir,
    });

    // Verify edge cases are handled correctly
    expect(capturedCookiecutterJson).toBeDefined();

    // Normal string should remain unchanged
    expect(capturedCookiecutterJson.normalString).toBe('just a regular string');

    // Empty array/object strings should be parsed
    expect(Array.isArray(capturedCookiecutterJson.emptyArray)).toBe(true);
    expect(capturedCookiecutterJson.emptyArray).toHaveLength(0);
    expect(typeof capturedCookiecutterJson.emptyObject).toBe('object');
    expect(Object.keys(capturedCookiecutterJson.emptyObject)).toHaveLength(0);

    // Numbers and booleans as strings should remain as strings (not parsed)
    expect(capturedCookiecutterJson.numberAsString).toBe('42');
    expect(capturedCookiecutterJson.booleanAsString).toBe('true');

    // Invalid JSON should remain as string
    expect(capturedCookiecutterJson.invalidJson).toBe('[invalid json}');
    expect(capturedCookiecutterJson.stringThatLooksLikeJson).toBe(
      '[this looks like json but is not]',
    );

    // Nested object should be parsed
    expect(typeof capturedCookiecutterJson.nestedObject).toBe('object');
    expect(capturedCookiecutterJson.nestedObject.level1.level2.value).toBe(
      'deep',
    );

    // Array of primitives should be parsed
    expect(Array.isArray(capturedCookiecutterJson.arrayOfPrimitives)).toBe(
      true,
    );
    expect(capturedCookiecutterJson.arrayOfPrimitives).toEqual([
      1,
      2,
      'three',
      true,
      null,
    ]);

    // Quoted string should be parsed to just the string value
    expect(capturedCookiecutterJson.quotedStringValue).toBe('quoted string');

    // null and undefined should be preserved
    expect(capturedCookiecutterJson.nullValue).toBe(null);
    expect(capturedCookiecutterJson.undefinedValue).toBe(undefined);
  });
});
