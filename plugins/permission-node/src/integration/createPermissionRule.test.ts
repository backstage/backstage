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

import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from '@standard-schema/spec';
import { z as zodV3 } from 'zod/v3';
import { z as zodV4 } from 'zod/v4';
import type { PermissionRule } from '../types';
import {
  createPermissionRule,
  type CreatePermissionRuleOptions,
} from './createPermissionRule';
import { createPermissionResourceRef } from './createPermissionResourceRef';
import { permissionRuleParamsToJsonSchema } from './permissionRuleParams';

const resourceRef = createPermissionResourceRef<
  unknown,
  { owner: string }
>().with({
  pluginId: 'test',
  resourceType: 'test-resource',
});

describe('createPermissionRule', () => {
  it('accepts Standard Schema parameter schemas', () => {
    const rule = createPermissionRule({
      name: 'test',
      description: 'test',
      resourceRef,
      paramsSchema: zodV4.object({ owner: zodV4.string() }),
      apply: (_resource, params) => params.owner.length > 0,
      toQuery: params => ({ owner: params.owner }),
    });

    expect(rule.paramsSchema).toBeDefined();
  });

  it('accepts resource ref rules without a parameter schema', () => {
    const rule = createPermissionRule({
      name: 'parameterless',
      description: 'parameterless',
      resourceRef,
      apply: (_resource, params) => {
        const noParams: undefined = params;
        return noParams === undefined;
      },
      toQuery: params => {
        const noParams: undefined = params;
        return { owner: String(noParams) };
      },
    });

    expect(permissionRuleParamsToJsonSchema(rule)).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
      properties: {},
      type: 'object',
    });
  });

  it('keeps the legacy Zod schema overload and supports both rule types', () => {
    const legacyRule = createPermissionRule({
      name: 'legacy',
      description: 'legacy',
      resourceRef,
      paramsSchema: zodV3.object({ owner: zodV3.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    });

    const standardOptions: CreatePermissionRuleOptions<
      typeof resourceRef,
      { owner: string }
    > = {
      name: 'standard',
      description: 'standard',
      resourceRef,
      paramsSchema: zodV4.object({ owner: zodV4.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    };

    const standardPermissionRule: PermissionRule<
      unknown,
      { owner: string },
      'test-resource',
      { owner: string }
    > = {
      name: 'standard',
      description: 'standard',
      resourceType: 'test-resource',
      paramsSchema: zodV4.object({ owner: zodV4.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    };

    const legacyPermissionRule: PermissionRule<
      unknown,
      { owner: string },
      'test-resource',
      { owner: string }
    > = legacyRule;

    const legacyOptions: CreatePermissionRuleOptions<
      typeof resourceRef,
      { owner: string }
    > = {
      name: 'legacy',
      description: 'legacy',
      resourceRef,
      // @ts-expect-error Zod v3 is only accepted by the deprecated function overload
      paramsSchema: zodV3.object({ owner: zodV3.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    };

    expect(standardOptions.paramsSchema).toBeDefined();
    expect(standardPermissionRule.paramsSchema).toBeDefined();
    expect(legacyPermissionRule.paramsSchema).toBeDefined();
    expect(legacyOptions.paramsSchema).toBeDefined();
  });

  it('rejects Standard Schemas without JSON Schema conversion', () => {
    const schema: StandardSchemaV1<Record<string, never>> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: value => ({ value: value as Record<string, never> }),
      },
    };

    expect(() =>
      createPermissionRule({
        name: 'unsupported',
        description: 'unsupported',
        resourceRef,
        paramsSchema: schema as StandardSchemaV1<Record<string, never>> &
          StandardJSONSchemaV1<Record<string, never>>,
        apply: () => true,
        toQuery: () => ({ owner: 'test' }),
      }),
    ).toThrow(
      "Permission rule 'unsupported' parameter schema does not support JSON Schema conversion",
    );

    expect(() =>
      createPermissionRule({
        name: 'malformed',
        description: 'malformed',
        resourceRef,
        paramsSchema: {} as StandardSchemaV1<Record<string, never>> &
          StandardJSONSchemaV1<Record<string, never>>,
        apply: () => true,
        toQuery: () => ({ owner: 'test' }),
      }),
    ).toThrow(
      "Permission rule 'malformed' parameter schema does not support JSON Schema conversion",
    );

    expect(() =>
      createPermissionRule({
        name: 'not-zod',
        description: 'not-zod',
        resourceRef,
        paramsSchema: {
          safeParse: () => ({ success: true }),
        } as unknown as StandardSchemaV1<Record<string, never>> &
          StandardJSONSchemaV1<Record<string, never>>,
        apply: () => true,
        toQuery: () => ({ owner: 'test' }),
      }),
    ).toThrow(
      "Permission rule 'not-zod' parameter schema does not support JSON Schema conversion",
    );
  });
});
