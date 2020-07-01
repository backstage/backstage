/*
 * Copyright 2020 Spotify AB
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

import { EntityPolicy } from '../types';
import {
  TemplateEntityV1alpha1,
  TemplateEntityV1alpha1Policy,
} from './TemplateEntityV1alpha1';

describe('TemplateEntityV1alpah1', () => {
  let entity: TemplateEntityV1alpha1;
  let policy: EntityPolicy;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'cookiecutter',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          required: ['storePath', 'owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
            storePath: {
              type: 'string',
              title: 'Store path',
              description: 'GitHub store path in org/repo format',
            },
          },
        },
      },
    };
    policy = new TemplateEntityV1alpha1Policy();
  });

  it('happy path: accepts valid data', async () => {
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(policy.enforce(entity)).rejects.toThrow(/apiVersion/);
  });

  it('rejects unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(policy.enforce(entity)).rejects.toThrow(/kind/);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('acceptps any other type', async () => {
    (entity as any).spec.type = 'hallo';
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });
});
