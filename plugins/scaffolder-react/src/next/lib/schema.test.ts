/*
 * Copyright 2020 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { extractSchemaFromStep, resolveConditionalSchema } from './schema';

describe('extractSchemaFromStep', () => {
  it('transforms deep schema', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      'ui:welp': 'warp',
      properties: {
        field1: {
          type: 'string',
          'ui:derp': 'herp',
        },
        field2: {
          type: 'object',
          properties: {
            fieldX: {
              type: 'string',
              'ui:derp': 'xerp',
            },
          },
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      properties: {
        field1: {
          type: 'string',
        },
        field2: {
          type: 'object',
          properties: {
            fieldX: {
              type: 'string',
            },
          },
        },
      },
    };
    const expectedUiSchema = {
      'ui:welp': 'warp',
      field1: {
        'ui:derp': 'herp',
      },
      field2: {
        fieldX: {
          'ui:derp': 'xerp',
        },
      },
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('transforms schema with anyOf fields', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      anyOf: [
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 2',
              'ui:readonly': true,
            },
          },
        },
      ],
      oneOf: [
        {
          properties: {
            field4: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
      ],
      allOf: [
        {
          properties: {
            field5: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
      ],
      properties: {
        field1: {
          type: 'object',
          anyOf: [
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 2',
                  'ui:readonly': true,
                },
              },
            },
          ],
          oneOf: [
            {
              properties: {
                field4: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
          ],
          allOf: [
            {
              properties: {
                field5: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
          ],
        },
        field2: {
          type: 'string',
          'ui:derp': 'xerp',
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      anyOf: [
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 2',
            },
          },
        },
      ],
      oneOf: [
        {
          properties: {
            field4: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
      ],
      allOf: [
        {
          properties: {
            field5: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
      ],
      properties: {
        field1: {
          type: 'object',
          anyOf: [
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 2',
                },
              },
            },
          ],
          oneOf: [
            {
              properties: {
                field4: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
          ],
          allOf: [
            {
              properties: {
                field5: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
          ],
        },
        field2: {
          type: 'string',
        },
      },
    };
    const expectedUiSchema = {
      field3: {
        'ui:readonly': true,
      },
      field4: {
        'ui:readonly': true,
      },
      field5: {
        'ui:readonly': true,
      },
      field1: {
        field3: {
          'ui:readonly': true,
        },
        field4: {
          'ui:readonly': true,
        },
        field5: {
          'ui:readonly': true,
        },
      },
      field2: {
        'ui:derp': 'xerp',
      },
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('transforms schema with dependencies', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        credit_card: {
          type: 'number',
        },
      },
      required: ['name'],
      dependencies: {
        credit_card: {
          properties: {
            billing_address: {
              type: 'string',
              'ui:widget': 'textarea',
            },
          },
          required: ['billing_address'],
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        credit_card: {
          type: 'number',
        },
      },
      required: ['name'],
      dependencies: {
        credit_card: {
          properties: {
            billing_address: {
              type: 'string',
            },
          },
          required: ['billing_address'],
        },
      },
    };
    const expectedUiSchema = {
      billing_address: {
        'ui:widget': 'textarea',
      },
      credit_card: {},
      name: {},
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('transforms schema with array items', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        person: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              address: {
                type: 'string',
                'ui:widget': 'textarea',
              },
            },
          },
        },
        accountNumber: {
          type: 'number',
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      properties: {
        person: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              address: {
                type: 'string',
              },
            },
          },
        },
        accountNumber: {
          type: 'number',
        },
      },
    };
    const expectedUiSchema = {
      accountNumber: {},
      person: {
        items: {
          name: {},
          address: {
            'ui:widget': 'textarea',
          },
        },
      },
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('doesnt override existing uiSchema with things from dependencies', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      title:
        "Field 2 depend on field 1, field 1 is a radio button but it's visible as a field",
      required: ['exampleField1'],
      properties: {
        exampleField0: {
          title: 'Radio button that is not a dependency',
          type: 'string',
          enum: ['foo', 'bar'],
          'ui:widget': 'radio',
        },
        exampleField1: {
          title: 'Radio button input that is a dependency',
          type: 'string',
          enum: ['visible', 'hidden'],
          'ui:widget': 'radio',
        },
      },
      dependencies: {
        exampleField1: {
          oneOf: [
            {
              properties: {
                exampleField1: {
                  enum: ['visible'],
                },
                exampleField2: {
                  title: 'FIELD 2',
                  type: 'string',
                  description: 'Explanation',
                },
              },
            },
            {
              properties: {
                exampleField1: {
                  enum: ['hidden'],
                },
              },
            },
          ],
        },
      },
    };

    const expectedSchema = {
      type: 'object',
      title:
        "Field 2 depend on field 1, field 1 is a radio button but it's visible as a field",
      required: ['exampleField1'],
      properties: {
        exampleField0: {
          title: 'Radio button that is not a dependency',
          type: 'string',
          enum: ['foo', 'bar'],
        },
        exampleField1: {
          title: 'Radio button input that is a dependency',
          type: 'string',
          enum: ['visible', 'hidden'],
        },
      },
      dependencies: {
        exampleField1: {
          oneOf: [
            {
              properties: {
                exampleField1: {
                  enum: ['visible'],
                },
                exampleField2: {
                  title: 'FIELD 2',
                  type: 'string',
                  description: 'Explanation',
                },
              },
            },
            {
              properties: {
                exampleField1: {
                  enum: ['hidden'],
                },
              },
            },
          ],
        },
      },
    };

    const expectedUiSchema = {
      exampleField0: {
        'ui:widget': 'radio',
      },
      exampleField1: {
        'ui:widget': 'radio',
      },
      exampleField2: {},
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('transforms conditional schema', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        flag: {
          type: 'boolean',
        },
      },
      if: {
        properties: {
          flag: {
            const: true,
          },
        },
      },
      then: {
        properties: {
          user: {
            type: 'string',
            'ui:field': 'EntityPicker',
            'ui:options': {
              catalogFilter: [{ kind: 'User' }],
            },
          },
        },
      },
      else: {
        properties: {
          email: {
            type: 'string',
          },
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      properties: {
        flag: {
          type: 'boolean',
        },
      },
      if: {
        properties: {
          flag: {
            const: true,
          },
        },
      },
      then: {
        properties: {
          user: {
            type: 'string',
          },
        },
      },
      else: {
        properties: {
          email: {
            type: 'string',
          },
        },
      },
    };
    const expectedUiSchema = {
      flag: {},
      user: {
        'ui:field': 'EntityPicker',
        'ui:options': {
          catalogFilter: [{ kind: 'User' }],
        },
      },
      email: {},
    };

    expect(extractSchemaFromStep(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });
});

describe('resolveConditionalSchema', () => {
  it('resolves simple if/then/else based on boolean condition', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        toggle: {
          type: 'boolean',
        },
      },
      if: {
        properties: {
          toggle: {
            const: true,
          },
        },
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
          alternateField: {
            type: 'number',
            title: 'Alternate',
          },
        },
      },
    };

    // When the condition is met (toggle === true), the then branch is merged
    const resolvedTrue = resolveConditionalSchema(inputSchema, {
      toggle: true,
    });
    expect(resolvedTrue).toEqual({
      type: 'object',
      properties: {
        toggle: {
          type: 'boolean',
        },
        conditionalField: {
          type: 'string',
          title: 'Conditional',
        },
      },
      required: ['conditionalField'],
    });
    // alternateField must NOT appear when condition is met
    expect(
      (resolvedTrue.properties as JsonObject).alternateField,
    ).toBeUndefined();

    // When the condition is not met (toggle === false), the else branch is merged
    const resolvedFalse = resolveConditionalSchema(inputSchema, {
      toggle: false,
    });
    expect(resolvedFalse).toEqual({
      type: 'object',
      properties: {
        toggle: {
          type: 'boolean',
        },
        alternateField: {
          type: 'number',
          title: 'Alternate',
        },
      },
    });
    // conditionalField must NOT appear when condition is not met
    expect(
      (resolvedFalse.properties as JsonObject).conditionalField,
    ).toBeUndefined();

    // The base toggle property is always present in both branches
    expect((resolvedTrue.properties as JsonObject).toggle).toBeDefined();
    expect((resolvedFalse.properties as JsonObject).toggle).toBeDefined();
  });

  it('resolves nested if/then/else with multiple conditions', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        cloudProvider: {
          type: 'string',
          enum: ['AWS', 'GCP', 'Azure'],
        },
      },
      allOf: [
        {
          if: {
            properties: {
              cloudProvider: {
                const: 'AWS',
              },
            },
          },
          then: {
            properties: {
              awsRegion: {
                type: 'string',
              },
            },
          },
        },
        {
          if: {
            properties: {
              cloudProvider: {
                const: 'GCP',
              },
            },
          },
          then: {
            properties: {
              gcpRegion: {
                type: 'string',
              },
            },
          },
        },
      ],
    };

    // When cloud provider is AWS, awsRegion appears and gcpRegion does not
    const resolvedAWS = resolveConditionalSchema(inputSchema, {
      cloudProvider: 'AWS',
    });
    expect(resolvedAWS).toEqual({
      type: 'object',
      properties: {
        cloudProvider: {
          type: 'string',
          enum: ['AWS', 'GCP', 'Azure'],
        },
        awsRegion: {
          type: 'string',
        },
      },
    });
    expect((resolvedAWS.properties as JsonObject).gcpRegion).toBeUndefined();

    // When cloud provider is GCP, gcpRegion appears and awsRegion does not
    const resolvedGCP = resolveConditionalSchema(inputSchema, {
      cloudProvider: 'GCP',
    });
    expect(resolvedGCP).toEqual({
      type: 'object',
      properties: {
        cloudProvider: {
          type: 'string',
          enum: ['AWS', 'GCP', 'Azure'],
        },
        gcpRegion: {
          type: 'string',
        },
      },
    });
    expect((resolvedGCP.properties as JsonObject).awsRegion).toBeUndefined();
  });

  it('resolves property dependencies when dependent field is present', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        credit_card: {
          type: 'number',
        },
      },
      dependencies: {
        credit_card: {
          required: ['billing_address'],
          properties: {
            billing_address: {
              type: 'string',
            },
          },
        },
      },
    };

    // When the dependency field is present, the dependent schema is merged
    const resolvedWithCard = resolveConditionalSchema(inputSchema, {
      name: 'John',
      credit_card: 12345,
    });
    expect(resolvedWithCard).toEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        credit_card: {
          type: 'number',
        },
        billing_address: {
          type: 'string',
        },
      },
      required: ['billing_address'],
    });

    // When the dependency field is absent, no extra schema is merged
    const resolvedWithoutCard = resolveConditionalSchema(inputSchema, {
      name: 'John',
    });
    expect(resolvedWithoutCard).toEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        credit_card: {
          type: 'number',
        },
      },
    });
    // billing_address must NOT appear
    expect(
      (resolvedWithoutCard.properties as JsonObject).billing_address,
    ).toBeUndefined();
  });

  it('resolves schema dependencies with oneOf branches', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        selection: {
          type: 'string',
          enum: ['option1', 'option2'],
        },
      },
      dependencies: {
        selection: {
          oneOf: [
            {
              properties: {
                selection: {
                  enum: ['option1'],
                },
                extraField1: {
                  type: 'string',
                },
              },
            },
            {
              properties: {
                selection: {
                  enum: ['option2'],
                },
                extraField2: {
                  type: 'number',
                },
              },
            },
          ],
        },
      },
    };

    // When selection is 'option1', the first oneOf branch is merged
    const resolvedOpt1 = resolveConditionalSchema(inputSchema, {
      selection: 'option1',
    });
    expect(resolvedOpt1.properties).toMatchObject({
      extraField1: {
        type: 'string',
      },
    });
    expect((resolvedOpt1.properties as JsonObject).extraField2).toBeUndefined();

    // When selection is 'option2', the second oneOf branch is merged
    const resolvedOpt2 = resolveConditionalSchema(inputSchema, {
      selection: 'option2',
    });
    expect(resolvedOpt2.properties).toMatchObject({
      extraField2: {
        type: 'number',
      },
    });
    expect((resolvedOpt2.properties as JsonObject).extraField1).toBeUndefined();
  });

  it('resolves oneOf discriminated union', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        animalType: {
          type: 'string',
          enum: ['cat', 'dog'],
        },
      },
      oneOf: [
        {
          properties: {
            animalType: {
              enum: ['cat'],
            },
            purring: {
              type: 'boolean',
            },
          },
        },
        {
          properties: {
            animalType: {
              enum: ['dog'],
            },
            fetching: {
              type: 'boolean',
            },
          },
        },
      ],
    };

    // When animalType is 'cat', the cat branch properties are merged
    const resolvedCat = resolveConditionalSchema(inputSchema, {
      animalType: 'cat',
    });
    expect(resolvedCat.properties).toMatchObject({
      purring: {
        type: 'boolean',
      },
    });
    expect((resolvedCat.properties as JsonObject).fetching).toBeUndefined();
    // oneOf is removed after successful resolution
    expect(resolvedCat.oneOf).toBeUndefined();
    // Verify the base property retains its full definition (not overwritten
    // by the branch's narrow enum constraint). mergeSchemaInto uses
    // additive-only property merge — existing properties are preserved.
    expect((resolvedCat.properties as JsonObject).animalType).toEqual({
      type: 'string',
      enum: ['cat', 'dog'],
    });

    // When animalType is 'dog', the dog branch properties are merged
    const resolvedDog = resolveConditionalSchema(inputSchema, {
      animalType: 'dog',
    });
    expect(resolvedDog.properties).toMatchObject({
      fetching: {
        type: 'boolean',
      },
    });
    expect((resolvedDog.properties as JsonObject).purring).toBeUndefined();
    expect(resolvedDog.oneOf).toBeUndefined();
    // Same preservation check for the dog branch
    expect((resolvedDog.properties as JsonObject).animalType).toEqual({
      type: 'string',
      enum: ['cat', 'dog'],
    });
  });

  it('passes through schema with no conditional keywords unchanged', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: ['name'],
    };

    const resolved = resolveConditionalSchema(inputSchema, {});

    // The resolved schema should be structurally equivalent to the input
    expect(resolved).toEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: ['name'],
    });
  });

  it('is a pure function that does not mutate the input schema', () => {
    const inputSchema: JsonObject = {
      type: 'object',
      properties: {
        toggle: {
          type: 'boolean',
        },
      },
      if: {
        properties: {
          toggle: {
            const: true,
          },
        },
      },
      then: {
        properties: {
          conditionalField: {
            type: 'string',
          },
        },
      },
    };

    // Snapshot the original schema before calling resolveConditionalSchema
    const originalSnapshot = JSON.parse(JSON.stringify(inputSchema));

    // Call twice with the same inputs
    const result1 = resolveConditionalSchema(inputSchema, { toggle: true });
    const result2 = resolveConditionalSchema(inputSchema, { toggle: true });

    // Both calls produce identical output
    expect(result1).toEqual(result2);

    // The input schema is NOT mutated
    expect(inputSchema).toEqual(originalSnapshot);
  });

  it('resolves a schema with 20 conditional branches in under 50ms', () => {
    // Build a schema with 20 if/then/else branches wrapped in allOf.
    // This matches the AAP performance target: <50ms for ≤20 branches.
    const branches: JsonObject[] = [];
    for (let i = 0; i < 20; i++) {
      branches.push({
        if: {
          properties: {
            [`selector${i}`]: { const: `option${i}` },
          },
        },
        then: {
          properties: {
            [`conditionalField${i}`]: {
              type: 'string',
              title: `Conditional Field ${i}`,
            },
          },
          required: [`conditionalField${i}`],
        },
        else: {
          properties: {
            [`fallbackField${i}`]: {
              type: 'string',
              title: `Fallback Field ${i}`,
            },
          },
        },
      });
    }

    const selectorProperties: JsonObject = {};
    for (let i = 0; i < 20; i++) {
      selectorProperties[`selector${i}`] = {
        type: 'string',
        enum: [`option${i}`, `other${i}`],
      };
    }

    const schema: JsonObject = {
      type: 'object',
      properties: selectorProperties,
      allOf: branches,
    };

    // Form data that triggers all 20 "then" branches
    const formData: JsonObject = {};
    for (let i = 0; i < 20; i++) {
      formData[`selector${i}`] = `option${i}`;
    }

    // Warm up JIT
    resolveConditionalSchema(schema, formData);

    // Measure performance over 100 iterations for statistical significance
    const iterations = 100;
    const start = window.performance.now();
    for (let iter = 0; iter < iterations; iter++) {
      resolveConditionalSchema(schema, formData);
    }
    const elapsed = window.performance.now() - start;
    const avgMs = elapsed / iterations;

    // Target: <50ms per call for 20 branches
    expect(avgMs).toBeLessThan(50);

    // Verify correctness: all 20 conditional fields should be present
    const result = resolveConditionalSchema(schema, formData);
    for (let i = 0; i < 20; i++) {
      expect(
        (result.properties as JsonObject)?.[`conditionalField${i}`],
      ).toBeDefined();
    }
  });

  it('resolves deeply nested if/then/else chains within performance budget', () => {
    // Build a schema with 10 levels of nested if/then/else
    let innerSchema: JsonObject = {
      properties: {
        deepField: { type: 'string', title: 'Deep Field' },
      },
    };

    for (let depth = 9; depth >= 0; depth--) {
      innerSchema = {
        if: {
          properties: {
            [`level${depth}`]: { const: 'yes' },
          },
        },
        then: innerSchema,
        else: {
          properties: {
            [`fallback${depth}`]: { type: 'string' },
          },
        },
      };
    }

    const schema: JsonObject = {
      type: 'object',
      properties: {
        level0: { type: 'string', enum: ['yes', 'no'] },
      },
      ...innerSchema,
    };

    const formData: JsonObject = {};
    for (let i = 0; i < 10; i++) {
      formData[`level${i}`] = 'yes';
    }

    // Warm up
    resolveConditionalSchema(schema, formData);

    const iterations = 50;
    const start = window.performance.now();
    for (let iter = 0; iter < iterations; iter++) {
      resolveConditionalSchema(schema, formData);
    }
    const avgMs = (window.performance.now() - start) / iterations;

    // Should resolve well under 50ms even with nesting
    expect(avgMs).toBeLessThan(50);
  });
});
