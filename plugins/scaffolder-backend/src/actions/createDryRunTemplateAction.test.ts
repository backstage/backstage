/*
 * Copyright 2026 The Backstage Authors
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
import { createDryRunTemplateAction } from './createDryRunTemplateAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { scaffolderServiceMock } from '@backstage/plugin-scaffolder-node/testUtils';

type DryRunTemplateOutput = {
  valid: boolean;
  message: string;
  errors?: string[];
  log?: Array<{ message: string; stepId?: string; status?: string }>;
  output?: Record<string, unknown>;
  steps?: Array<{ id: string; name: string; action: string }>;
};

const validTemplateYaml = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test-template
  namespace: default
  title: Test Template
spec:
  type: service
  steps:
    - id: step-1
      name: Step One
      action: debug:log
      input:
        message: hello
`;

const invalidYaml = `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test
  invalid: yaml: syntax: error
spec:
  type: service
  steps: [
`;

describe('createDryRunTemplateAction', () => {
  const mockScaffolderService = scaffolderServiceMock.mock();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return success with logs when dry-run succeeds', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const dryRunResult = {
      log: [
        {
          body: {
            message: 'Step completed',
            stepId: 'step-1',
            status: 'completed' as const,
          },
        },
      ],
      output: { result: 'ok' },
      steps: [{ id: 'step-1', name: 'Step One', action: 'debug:log' }],
      directoryContents: [],
    };

    mockScaffolderService.dryRun.mockResolvedValue(dryRunResult);

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:dry-run-template',
      input: { templateYaml: validTemplateYaml },
    });

    expect(result.output).toEqual({
      valid: true,
      message: 'Template validation successful',
      log: [
        {
          message: 'Step completed',
          stepId: 'step-1',
          status: 'completed',
        },
      ],
      output: { result: 'ok' },
      steps: [{ id: 'step-1', name: 'Step One', action: 'debug:log' }],
    });

    expect(mockScaffolderService.dryRun).toHaveBeenCalledWith(
      {
        template: expect.objectContaining({
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: expect.objectContaining({
            name: 'test-template',
          }),
        }),
        values: {},
        directoryContents: [],
      },
      { credentials: expect.anything() },
    );
  });

  it('should pass values and files to the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.dryRun.mockResolvedValue({
      log: [],
      output: {},
      steps: [],
      directoryContents: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const values = { name: 'my-app' };
    const files = [
      {
        path: 'README.md',
        content: 'hello',
      },
    ];

    await mockActionsRegistry.invoke({
      id: 'test:dry-run-template',
      input: {
        templateYaml: validTemplateYaml,
        values,
        files,
      },
    });

    expect(mockScaffolderService.dryRun).toHaveBeenCalledWith(
      {
        template: expect.any(Object),
        values,
        directoryContents: [
          {
            path: 'README.md',
            base64Content: Buffer.from('hello').toString('base64'),
          },
        ],
      },
      { credentials: expect.anything() },
    );
  });

  it('should return validation errors when YAML is invalid', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:dry-run-template',
      input: { templateYaml: invalidYaml },
    });

    expect(result.output).toEqual({
      valid: false,
      message: 'Failed to parse YAML template',
      errors: expect.arrayContaining([
        expect.stringContaining('YAML parsing error'),
      ]),
    });

    expect(mockScaffolderService.dryRun).not.toHaveBeenCalled();
  });

  it('should propagate errors from the scaffolder service', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    mockScaffolderService.dryRun.mockRejectedValue(
      new Error('Authentication error'),
    );

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:dry-run-template',
        input: { templateYaml: validTemplateYaml },
      }),
    ).rejects.toThrow('Authentication error');
  });

  it('should use default empty values and files when not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.dryRun.mockResolvedValue({
      log: [],
      output: {},
      steps: [],
      directoryContents: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    await mockActionsRegistry.invoke({
      id: 'test:dry-run-template',
      input: { templateYaml: validTemplateYaml },
    });

    expect(mockScaffolderService.dryRun).toHaveBeenCalledWith(
      {
        template: expect.any(Object),
        values: {},
        directoryContents: [],
      },
      { credentials: expect.anything() },
    );
  });

  it('should map log entries from body fields', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    mockScaffolderService.dryRun.mockResolvedValue({
      log: [{ body: { message: 'Plain log message' } }],
      output: {},
      steps: [],
      directoryContents: [],
    });

    createDryRunTemplateAction({
      actionsRegistry: mockActionsRegistry,
      scaffolderService: mockScaffolderService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:dry-run-template',
      input: { templateYaml: validTemplateYaml },
    });

    const output = result.output as DryRunTemplateOutput;
    expect(output.valid).toBe(true);
    expect(output.log).toEqual([
      { message: 'Plain log message', stepId: undefined, status: undefined },
    ]);
  });
});
