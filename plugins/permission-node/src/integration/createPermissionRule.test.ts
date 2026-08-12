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

import { StandardSchemaV1 } from '@standard-schema/spec';
import { z as zodV3 } from 'zod/v3';
import { z as zodV4 } from 'zod/v4';
import { PermissionRule } from '../types';
import {
  createPermissionRule,
  CreatePermissionRuleOptions,
} from './createPermissionRule';
import { createPermissionResourceRef } from './createPermissionResourceRef';

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
      params: {
        schema: zodV4.object({ owner: zodV4.string() }),
      },
      apply: (_resource, params) => params.owner.length > 0,
      toQuery: params => ({ owner: params.owner }),
    });

    expect(rule.params?.schema).toBeDefined();
  });

  it('keeps the legacy schema form but rejects combining both forms', () => {
    createPermissionRule({
      name: 'legacy',
      description: 'legacy',
      resourceRef,
      paramsSchema: zodV3.object({ owner: zodV3.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    });

    // @ts-expect-error params.schema and paramsSchema are mutually exclusive
    const invalidRule: CreatePermissionRuleOptions<
      typeof resourceRef,
      { owner: string }
    > = {
      name: 'invalid',
      description: 'invalid',
      resourceRef,
      params: {
        schema: zodV4.object({ owner: zodV4.string() }),
      },
      paramsSchema: zodV3.object({ owner: zodV3.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    };

    // @ts-expect-error params.schema and paramsSchema are mutually exclusive
    const invalidPermissionRule: PermissionRule<
      unknown,
      { owner: string },
      'test-resource',
      { owner: string }
    > = {
      name: 'invalid',
      description: 'invalid',
      resourceType: 'test-resource',
      params: {
        schema: zodV4.object({ owner: zodV4.string() }),
      },
      paramsSchema: zodV3.object({ owner: zodV3.string() }),
      apply: () => true,
      toQuery: params => ({ owner: params.owner }),
    };

    expect(invalidRule).toBeDefined();
    expect(invalidPermissionRule).toBeDefined();
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
        params: { schema },
        apply: () => true,
        toQuery: () => ({ owner: 'test' }),
      }),
    ).toThrow(
      "Permission rule 'unsupported' parameter schema does not support JSON Schema conversion",
    );
  });
});
