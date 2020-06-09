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
  ComponentEntityV1beta1,
  ComponentEntityV1beta1Policy,
} from './ComponentEntityV1beta1';

describe('ComponentV1beta1Policy', () => {
  let entity: ComponentEntityV1beta1;
  let policy: EntityPolicy;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Component',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'me',
      },
    };
    policy = new ComponentEntityV1beta1Policy();
  });

  it('happy path: accepts valid data', async () => {
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta2';
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

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty wrong type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(policy.enforce(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects wrong lifecycle', async () => {
    (entity as any).spec.lifecycle = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects wrong empty', async () => {
    (entity as any).spec.lifecycle = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(policy.enforce(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/owner/);
  });
});
