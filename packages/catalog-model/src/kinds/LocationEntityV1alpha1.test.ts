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
  LocationEntityV1alpha1,
  LocationEntityV1alpha1Policy,
} from './LocationEntityV1alpha1';

describe('LocationV1alpha1Policy', () => {
  let entity: LocationEntityV1alpha1;
  let policy: EntityPolicy;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'github',
      },
    };
    policy = new LocationEntityV1alpha1Policy();
  });

  it('happy path: accepts valid data', async () => {
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('happy path: silently accepts v1beta1 as well', async () => {
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

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('accepts good target', async () => {
    (entity as any).spec.target =
      'https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/examples/artist-lookup-component.yaml';
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong target', async () => {
    (entity as any).spec.target = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/target/);
  });

  it('rejects empty target', async () => {
    (entity as any).spec.target = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/target/);
  });

  it('accepts good targets', async () => {
    (entity as any).spec.targets = [
      'https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/examples/artist-lookup-component.yaml',
      'https://github.com/spotify/backstage/blob/master/plugins/catalog-backend/examples/playback-order-component.yaml',
    ];
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong targets', async () => {
    (entity as any).spec.targets = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/targets/);
  });
});
