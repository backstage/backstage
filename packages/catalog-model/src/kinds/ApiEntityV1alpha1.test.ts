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
  ApiEntityV1alpha1,
  ApiEntityV1alpha1Policy,
} from './ApiEntityV1alpha1';

describe('ApiV1alpha1Policy', () => {
  let entity: ApiEntityV1alpha1;
  let policy: EntityPolicy;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'openapi',
        definition: `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      responses:
        '200':
          description: A paged array of pets
          content:
            application/json:    
              schema:
                $ref: "#/components/schemas/Pets"
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        $ref: "#/components/schemas/Pet"
`,
      },
    };
    policy = new ApiEntityV1alpha1Policy();
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

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing definition', async () => {
    delete (entity as any).spec.definition;
    await expect(policy.enforce(entity)).rejects.toThrow(/definition/);
  });

  it('rejects wrong definition', async () => {
    (entity as any).spec.definition = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/definition/);
  });

  it('rejects empty definition', async () => {
    (entity as any).spec.definition = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/definition/);
  });
});
