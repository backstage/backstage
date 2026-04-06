/*
 * Copyright 2022 The Backstage Authors
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
import { useTemplateSchema } from './useTemplateSchema';
import { renderHook } from '@testing-library/react';
import { TestApiProvider } from '@backstage/frontend-test-utils';
import { mockApis } from '@backstage/frontend-test-utils';
import { PropsWithChildren } from 'react';
import { TemplateParameterSchema } from '../../types';

describe('useTemplateSchema', () => {
  it('should generate the correct schema', () => {
    const manifest: TemplateParameterSchema = {
      title: 'Test Template',
      description: 'Test Template Description',
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 Description',
          schema: {
            type: 'object',
            properties: {
              field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
            },
          },
        },
        {
          title: 'Step 2',
          description: 'Step 2 Description',
          schema: {
            type: 'object',
            properties: {
              field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
            },
          },
        },
      ],
    };

    const mockFeatureFlagsApi = mockApis.featureFlags.mock({
      isActive: jest.fn(() => false),
    });

    const { result } = renderHook(() => useTemplateSchema(manifest), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[mockFeatureFlagsApi]}>
          {children}
        </TestApiProvider>
      ),
    });

    const [first, second] = result.current.steps;

    expect(first.uiSchema).toEqual({
      field1: { 'ui:field': 'MyCoolComponent' },
    });

    expect(first.schema).toEqual({
      type: 'object',
      properties: {
        field1: { type: 'string' },
      },
    });

    expect(second.uiSchema).toEqual({
      field2: { 'ui:field': 'MyCoolerComponent' },
    });

    expect(second.schema).toEqual({
      type: 'object',
      properties: {
        field2: { type: 'string' },
      },
    });
  });

  describe('FeatureFlags', () => {
    it('should use featureFlags property to skip a step if the whole step is disabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              'ui:backstage': {
                featureFlag: 'my-feature-flag',
              },
              properties: {
                field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      expect(result.current.steps).toHaveLength(1);
    });

    it('should use featureFlags property to enable a step if the whole step is enabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              'ui:backstage': {
                featureFlag: 'my-feature-flag',
              },
              properties: {
                field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => true) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      expect(result.current.steps).toHaveLength(2);
    });

    it('should filter out the particular property if the featureFlag is disabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              properties: {
                field1: {
                  type: 'string',
                  'ui:field': 'MyCoolComponent',
                  'ui:backstage': {
                    featureFlag: 'my-feature-flag',
                  },
                },
                visibleField: {
                  type: 'string',
                  'ui:field': 'MyCoolComponent',
                },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const [first] = result.current.steps;

      expect(first.schema).toEqual({
        type: 'object',
        properties: {
          visibleField: {
            type: 'string',
          },
        },
      });
    });

    it('should deal with steps having no properties', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'About step',
            description:
              'The first step giving the initial information about the template',
            schema: {
              type: 'object',
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const [first] = result.current.steps;

      expect(first.schema).toEqual({
        type: 'object',
        properties: {},
      });
    });

    it('should deal with dependencies and oneOf options', () => {
      const firstStepDependencies = {
        preconditions: {
          oneOf: [
            {
              title: 'About',
              description: 'you have chosen option A',
              properties: {
                preconditions: {
                  enum: ['optionA'],
                },
              },
            },
            {
              title: 'About',
              description: 'you have chosen option B',
              properties: {
                preconditions: {
                  enum: ['optionB'],
                },
              },
            },
          ],
        },
      };

      const secondStepDependencies = {
        preconditions: {
          oneOf: [
            {
              required: ['inputA'],
              properties: {
                preconditions: {
                  enum: ['optionA'],
                },
                inputA: {
                  title: 'Input A',
                  type: 'string',
                },
              },
            },
            {
              required: ['inputB'],
              properties: {
                preconditions: {
                  enum: ['optionB'],
                },
                inputA: {
                  title: 'Input B',
                  type: 'string',
                },
              },
            },
          ],
        },
      };

      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'First step',
            schema: {
              type: 'object',
              properties: {
                preconditions: {
                  title: 'Preconditions',
                  type: 'string',
                  description: 'Choose an option',
                  enum: ['optionA', 'optionB'],
                  enumNames: ['Option A', 'Option B'],
                },
              },
              dependencies: firstStepDependencies,
            },
          },
          {
            title: 'Second step',
            schema: {
              dependencies: secondStepDependencies,
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const [first, second] = result.current.steps;

      expect(first.schema).toEqual({
        dependencies: firstStepDependencies,
        properties: expect.anything(),
        type: 'object',
      });

      expect(second.schema).toEqual({
        dependencies: secondStepDependencies,
      });
    });
  });

  describe('Conditional Schema Keywords', () => {
    it('preserves if/then/else keywords through schema extraction', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Conditional Template',
        description: 'Template with if/then/else conditionals',
        steps: [
          {
            title: 'Conditional Step',
            schema: {
              type: 'object',
              properties: {
                toggle: { type: 'boolean', title: 'Toggle' },
              },
              if: {
                properties: { toggle: { const: true } },
              },
              then: {
                properties: {
                  conditionalField: {
                    type: 'string',
                    title: 'Conditional',
                  },
                },
                required: ['conditionalField'],
              },
              else: {
                properties: {
                  alternateField: { type: 'number', title: 'Alternate' },
                },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const step = result.current.steps[0];

      // The 'if' keyword is NOT destructured by extractUiSchema, so it passes
      // through the extraction pipeline completely untouched.
      expect(step.schema).toHaveProperty('if');
      expect(step.schema).toMatchObject({
        if: {
          properties: { toggle: { const: true } },
        },
      });

      // 'then' and 'else' are destructured for ui:* extraction but their
      // structural content (properties, required, etc.) is preserved.
      expect(step.schema).toHaveProperty('then');
      expect(step.schema).toMatchObject({
        then: {
          properties: {
            conditionalField: { type: 'string', title: 'Conditional' },
          },
          required: ['conditionalField'],
        },
      });

      expect(step.schema).toHaveProperty('else');
      expect(step.schema).toMatchObject({
        else: {
          properties: {
            alternateField: { type: 'number', title: 'Alternate' },
          },
        },
      });

      // Verify the base properties also survive alongside conditionals
      expect(step.schema).toMatchObject({
        type: 'object',
        properties: {
          toggle: { type: 'boolean', title: 'Toggle' },
        },
      });
    });

    it('preserves dependencies keyword with schema dependencies through extraction', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Dependencies Template',
        description: 'Template with schema-style dependencies',
        steps: [
          {
            title: 'Provider Step',
            schema: {
              type: 'object',
              properties: {
                cloudProvider: {
                  type: 'string',
                  enum: ['AWS', 'GCP', 'Azure'],
                  title: 'Cloud Provider',
                },
              },
              dependencies: {
                cloudProvider: {
                  oneOf: [
                    {
                      properties: {
                        cloudProvider: { enum: ['AWS'] },
                        awsRegion: {
                          type: 'string',
                          title: 'AWS Region',
                          enum: ['us-east-1', 'us-west-2'],
                        },
                      },
                    },
                    {
                      properties: {
                        cloudProvider: { enum: ['GCP'] },
                        gcpRegion: {
                          type: 'string',
                          title: 'GCP Region',
                          enum: ['us-central1', 'europe-west1'],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const step = result.current.steps[0];

      // Verify the dependencies keyword is preserved
      expect(step.schema).toHaveProperty('dependencies');
      expect(step.schema.dependencies).toBeDefined();

      // Verify the full structural content of the oneOf branches within
      // the dependency is preserved, including properties and enum values
      expect(step.schema).toMatchObject({
        dependencies: {
          cloudProvider: {
            oneOf: [
              {
                properties: {
                  cloudProvider: { enum: ['AWS'] },
                  awsRegion: {
                    type: 'string',
                    title: 'AWS Region',
                    enum: ['us-east-1', 'us-west-2'],
                  },
                },
              },
              {
                properties: {
                  cloudProvider: { enum: ['GCP'] },
                  gcpRegion: {
                    type: 'string',
                    title: 'GCP Region',
                    enum: ['us-central1', 'europe-west1'],
                  },
                },
              },
            ],
          },
        },
      });
    });

    it('preserves both if/then/else and dependencies in the same step schema', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Combined Conditionals Template',
        description: 'Template with both if/then/else and dependencies',
        steps: [
          {
            title: 'Combined Step',
            schema: {
              type: 'object',
              properties: {
                enableAdvanced: { type: 'boolean', title: 'Enable Advanced' },
                environment: {
                  type: 'string',
                  enum: ['dev', 'staging', 'prod'],
                  title: 'Environment',
                },
              },
              if: {
                properties: { enableAdvanced: { const: true } },
              },
              then: {
                properties: {
                  advancedConfig: {
                    type: 'string',
                    title: 'Advanced Configuration',
                  },
                },
              },
              else: {
                properties: {
                  simpleConfig: {
                    type: 'string',
                    title: 'Simple Configuration',
                  },
                },
              },
              dependencies: {
                environment: {
                  oneOf: [
                    {
                      properties: {
                        environment: { enum: ['prod'] },
                        approver: {
                          type: 'string',
                          title: 'Approver',
                        },
                      },
                      required: ['approver'],
                    },
                    {
                      properties: {
                        environment: { enum: ['dev', 'staging'] },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider
            apis={[
              mockApis.featureFlags.mock({ isActive: jest.fn(() => false) }),
            ]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const step = result.current.steps[0];

      // Verify all conditional keywords coexist in the extracted schema
      expect(step.schema).toHaveProperty('if');
      expect(step.schema).toHaveProperty('then');
      expect(step.schema).toHaveProperty('else');
      expect(step.schema).toHaveProperty('dependencies');

      // Verify if/then/else structural content
      expect(step.schema).toMatchObject({
        if: {
          properties: { enableAdvanced: { const: true } },
        },
        then: {
          properties: {
            advancedConfig: { type: 'string', title: 'Advanced Configuration' },
          },
        },
        else: {
          properties: {
            simpleConfig: { type: 'string', title: 'Simple Configuration' },
          },
        },
      });

      // Verify dependencies structural content
      expect(step.schema).toMatchObject({
        dependencies: {
          environment: {
            oneOf: expect.arrayContaining([
              expect.objectContaining({
                properties: expect.objectContaining({
                  environment: { enum: ['prod'] },
                  approver: { type: 'string', title: 'Approver' },
                }),
                required: ['approver'],
              }),
              expect.objectContaining({
                properties: expect.objectContaining({
                  environment: { enum: ['dev', 'staging'] },
                }),
              }),
            ]),
          },
        },
      });

      // Verify base properties also survive
      expect(step.schema).toMatchObject({
        type: 'object',
        properties: {
          enableAdvanced: { type: 'boolean', title: 'Enable Advanced' },
          environment: {
            type: 'string',
            enum: ['dev', 'staging', 'prod'],
            title: 'Environment',
          },
        },
      });
    });
  });
});
