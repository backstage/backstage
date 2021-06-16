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

import {
  CapabilityEntityV1alpha1,
  capabilityEntityV1alpha1Validator as validator,
} from './CapabilityEntityV1alpha1';

describe('CapabilityV1alpha1Validator', () => {
  let entity: CapabilityEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'build.dfds.cloud/v1alpha1',
      kind: 'Capability',
      metadata: {
        name: 'test',
      },
      spec: {
        identifier: 'developerautomation-xavgy',
        rootId: 'test',
        id: 'test',
        name: 'test',
        description: 'test',
        members: [],
        contexts: [],
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1alpha1 as well', async () => {
    (entity as any).apiVersion = 'build.dfds.cloud/v1alpha1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'build.dfds.cloud/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing identifier', async () => {
    delete (entity as any).spec.identifier;
    await expect(validator.check(entity)).rejects.toThrow(/identifier/);
  });

  it('rejects wrong identifier', async () => {
    (entity as any).spec.identifier = 7;
    await expect(validator.check(entity)).rejects.toThrow(/identifier/);
  });

  it('rejects empty identifier', async () => {
    (entity as any).spec.identifier = '';
    await expect(validator.check(entity)).rejects.toThrow(/identifier/);
  });
});
