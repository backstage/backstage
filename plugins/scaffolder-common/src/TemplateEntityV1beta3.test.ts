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

import { entityKindSchemaValidator } from '@backstage/catalog-model';
import type { TemplateEntityV1beta3 } from './TemplateEntityV1beta3';
import schema from './Template.v1beta3.schema.json';

const validator = entityKindSchemaValidator(schema);

describe('templateEntityV1beta3Validator', () => {
  let entity: TemplateEntityV1beta3;

  beforeEach(() => {
    entity = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'website',
        owner: 'team-b',
        parameters: {
          required: ['owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
          },
        },
        steps: [
          {
            id: 'fetch',
            name: 'Fetch',
            action: 'fetch:plan',
            input: {
              url: './template',
            },
            if: '${{ parameters.owner }}',
          },
        ],
        output: {
          fetchUrl: '${{ steps.fetch.output.targetUrl }}',
        },
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    expect(validator(entity)).toBe(entity);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    expect(validator(entity)).toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    expect(validator(entity)).toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    expect(() => validator(entity)).toThrow(/type/);
  });

  it('accepts any other type', async () => {
    (entity as any).spec.type = 'hallo';
    expect(validator(entity)).toBe(entity);
  });

  it('accepts missing parameters', async () => {
    delete (entity as any).spec.parameters;
    expect(validator(entity)).toBe(entity);
  });

  it('accepts missing outputs', async () => {
    delete (entity as any).spec.outputs;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    expect(() => validator(entity)).toThrow(/type/);
  });

  it('rejects missing steps', async () => {
    delete (entity as any).spec.steps;
    expect(() => validator(entity)).toThrow(/steps/);
  });

  it('accepts step with missing id', async () => {
    delete (entity as any).spec.steps[0].id;
    expect(validator(entity)).toBe(entity);
  });

  it('accepts step with missing name', async () => {
    delete (entity as any).spec.steps[0].name;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects step with missing action', async () => {
    delete (entity as any).spec.steps[0].action;
    expect(() => validator(entity)).toThrow(/action/);
  });

  it('accepts missing owner', async () => {
    delete (entity as any).spec.owner;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    expect(() => validator(entity)).toThrow(/owner/);
  });

  it('rejects wrong type owner', async () => {
    (entity as any).spec.owner = 5;
    expect(() => validator(entity)).toThrow(/owner/);
  });

  it('accepts missing if', async () => {
    delete (entity as any).spec.steps[0].if;
    expect(validator(entity)).toBe(entity);
  });

  it('accepts boolean in if', async () => {
    (entity as any).spec.steps[0].if = true;
    expect(validator(entity)).toBe(entity);
  });

  it('accepts empty if', async () => {
    (entity as any).spec.steps[0].if = '';
    expect(validator(entity)).toBe(entity);
  });

  it('rejects wrong type if', async () => {
    (entity as any).spec.steps[0].if = 5;
    expect(() => validator(entity)).toThrow(/if/);
  });
});
