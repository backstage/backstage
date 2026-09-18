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

import Ajv from 'ajv';
import { JsonObject } from '@backstage/types';
import { Entity } from '../entity';
import { compileCatalogModel } from './compileCatalogModel';
import { createCatalogModelLayer } from './createCatalogModelLayer';
import { defaultCatalogEntityModel } from './defaultCatalogEntityModel';

function updateComponent(jsonSchema: JsonObject) {
  return createCatalogModelLayer({
    layerId: 'example.com/component-update',
    builder: model =>
      model.updateKind({
        names: { kind: 'Component' },
        versions: [{ name: 'v1alpha1', schema: { jsonSchema } }],
      }),
  });
}

const component = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'example' },
  spec: { type: 'service', owner: 'team', lifecycle: 'production' },
};

describe('compiled catalog model schemas', () => {
  it('retains built-in field validation when restricting spec.type', () => {
    const model = compileCatalogModel([
      defaultCatalogEntityModel,
      updateComponent({
        properties: { spec: { properties: { type: { enum: ['service'] } } } },
      }),
    ]);
    const validate = new Ajv({ allowUnionTypes: true }).compile(
      model.getKind(component)!.jsonSchema,
    );

    expect(validate(component)).toBe(true);
    expect(
      validate({ ...component, spec: { ...component.spec, type: 'website' } }),
    ).toBe(false);
    expect(
      validate({ ...component, spec: { ...component.spec, owner: 7 } }),
    ).toBe(false);
    expect(
      validate({ ...component, spec: { ...component.spec, lifecycle: [] } }),
    ).toBe(false);
  });

  it('allows reusing schema fragments in a patch', () => {
    const shared = { minLength: 2 };
    const model = compileCatalogModel([
      defaultCatalogEntityModel,
      updateComponent({
        properties: {
          spec: { properties: { owner: shared, lifecycle: shared } },
        },
      }),
    ]);
    const validate = new Ajv({ allowUnionTypes: true }).compile(
      model.getKind(component)!.jsonSchema,
    );

    expect(validate(component)).toBe(true);
    expect(
      validate({ ...component, spec: { ...component.spec, owner: 'a' } }),
    ).toBe(false);
    expect(
      validate({ ...component, spec: { ...component.spec, lifecycle: 'a' } }),
    ).toBe(false);
  });

  it('allows patches to remove inherited properties and constraints', () => {
    const model = compileCatalogModel([
      defaultCatalogEntityModel,
      updateComponent({
        properties: {
          spec: {
            required: ['type', 'lifecycle'],
            properties: { owner: null, type: { minLength: null } },
          },
        },
      }),
    ]);
    const schema = model.getKind(component)!.jsonSchema;
    const validate = new Ajv({ allowUnionTypes: true }).compile(schema);
    expect(
      validate({ ...component, spec: { type: '', lifecycle: 'production' } }),
    ).toBe(true);
    expect(validate({ ...component, spec: { type: '', lifecycle: [] } })).toBe(
      false,
    );
    expect(schema).toMatchObject({
      properties: { spec: { properties: { lifecycle: { type: 'string' } } } },
    });
    expect((schema.properties as JsonObject).spec).not.toHaveProperty(
      'properties.owner',
    );
  });

  it('rejects invalid final schemas after applying a patch', () => {
    const update = updateComponent({
      properties: { spec: { required: 'owner' } },
    });
    expect(() =>
      compileCatalogModel([defaultCatalogEntityModel, update]),
    ).toThrow(/Invalid JSON schema/);
  });

  it('preserves the spec of a kind whose root type is omitted', () => {
    const layer = createCatalogModelLayer({
      layerId: 'example.com/widget',
      builder: model =>
        model.addKind({
          group: 'example.com',
          names: { kind: 'Widget', singular: 'widget', plural: 'widgets' },
          description: 'A widget',
          versions: [
            {
              name: 'v1',
              schema: {
                jsonSchema: {
                  required: ['spec'],
                  properties: {
                    spec: {
                      type: 'object',
                      required: ['size'],
                      properties: { size: { type: 'number' } },
                    },
                  },
                },
              },
            },
          ],
        }),
    });
    const entity: Entity = {
      apiVersion: 'example.com/v1',
      kind: 'Widget',
      metadata: { name: 'one' },
      spec: { size: 3 },
    };
    const schema = compileCatalogModel([layer]).getKind(entity)!.jsonSchema;
    const validate = new Ajv().compile(schema);
    expect(validate(entity)).toBe(true);
    expect(validate({ ...entity, spec: { size: 'large' } })).toBe(false);
    expect(validate({ ...entity, spec: undefined })).toBe(false);
  });

  it('rejects kind declarations and updates with non-object roots', () => {
    expect(() =>
      createCatalogModelLayer({
        layerId: 'example.com/invalid',
        builder: model =>
          model.addKind({
            group: 'example.com',
            names: { kind: 'Invalid', singular: 'invalid', plural: 'invalids' },
            description: 'Invalid',
            versions: [
              {
                name: 'v1',
                schema: { jsonSchema: { type: 'string', properties: {} } },
              },
            ],
          }),
      }),
    ).toThrow(/type.*object/);
    expect(() =>
      compileCatalogModel([
        defaultCatalogEntityModel,
        updateComponent({ type: 'string' }),
      ]),
    ).toThrow(/type.*object/);
  });
});
