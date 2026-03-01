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

import { readJsonSchema } from './readJsonSchema';

const v1alpha1beta1 = ['backstage.io/v1alpha1', 'backstage.io/v1beta1'];

describe('readJsonSchema', () => {
  it('can parse the API schema', () => {
    const schema = require('../../schema/kinds/API.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = { kind: 'API', apiVersion: { $in: v1alpha1beta1 } };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'API',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.owner',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
          outgoingType: 'ownedBy',
          incomingType: 'ownerOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.system',
        relation: {
          defaultKind: 'System',
          defaultNamespace: 'inherit',
          allowedKinds: ['System'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
    ]);
  });

  it('can parse the Component schema', () => {
    const schema = require('../../schema/kinds/Component.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = {
      kind: 'Component',
      apiVersion: { $in: v1alpha1beta1 },
    };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'Component',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.owner',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
          outgoingType: 'ownedBy',
          incomingType: 'ownerOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.system',
        relation: {
          defaultKind: 'System',
          defaultNamespace: 'inherit',
          allowedKinds: ['System'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.subcomponentOf',
        relation: {
          defaultKind: 'Component',
          defaultNamespace: 'inherit',
          allowedKinds: ['Component'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.providesApis',
        relation: {
          defaultKind: 'API',
          defaultNamespace: 'inherit',
          allowedKinds: ['API'],
          outgoingType: 'providesApi',
          incomingType: 'apiProvidedBy',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.consumesApis',
        relation: {
          defaultKind: 'API',
          defaultNamespace: 'inherit',
          allowedKinds: ['API'],
          outgoingType: 'consumesApi',
          incomingType: 'apiConsumedBy',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.dependsOn',
        relation: {
          defaultNamespace: 'inherit',
          allowedKinds: ['Component', 'Resource'],
          outgoingType: 'dependsOn',
          incomingType: 'dependencyOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.dependencyOf',
        relation: {
          defaultNamespace: 'inherit',
          allowedKinds: ['Component', 'Resource'],
          outgoingType: 'dependencyOf',
          incomingType: 'dependsOn',
        },
      },
    ]);
  });

  it('can parse the Domain schema', () => {
    const schema = require('../../schema/kinds/Domain.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = { kind: 'Domain', apiVersion: { $in: v1alpha1beta1 } };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'Domain',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.owner',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
          outgoingType: 'ownedBy',
          incomingType: 'ownerOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.subdomainOf',
        relation: {
          defaultKind: 'Domain',
          defaultNamespace: 'inherit',
          allowedKinds: ['Domain'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
    ]);
  });

  it('can parse the Group schema', () => {
    const schema = require('../../schema/kinds/Group.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = { kind: 'Group', apiVersion: { $in: v1alpha1beta1 } };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'Group',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.parent',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group'],
          outgoingType: 'childOf',
          incomingType: 'parentOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.children',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group'],
          outgoingType: 'parentOf',
          incomingType: 'childOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.members',
        relation: {
          defaultKind: 'User',
          defaultNamespace: 'inherit',
          allowedKinds: ['User'],
          outgoingType: 'hasMember',
          incomingType: 'memberOf',
        },
      },
    ]);
  });

  it('can parse the Location schema', () => {
    const schema = require('../../schema/kinds/Location.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = {
      kind: 'Location',
      apiVersion: { $in: v1alpha1beta1 },
    };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'Location',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
    ]);
  });

  it('can parse the Resource schema', () => {
    const schema = require('../../schema/kinds/Resource.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = {
      kind: 'Resource',
      apiVersion: { $in: v1alpha1beta1 },
    };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'Resource',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.owner',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
          outgoingType: 'ownedBy',
          incomingType: 'ownerOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.dependsOn',
        relation: {
          defaultNamespace: 'inherit',
          allowedKinds: ['Component', 'Resource'],
          outgoingType: 'dependsOn',
          incomingType: 'dependencyOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.dependencyOf',
        relation: {
          defaultNamespace: 'inherit',
          allowedKinds: ['Component', 'Resource'],
          outgoingType: 'dependencyOf',
          incomingType: 'dependsOn',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.system',
        relation: {
          defaultKind: 'System',
          defaultNamespace: 'inherit',
          allowedKinds: ['System'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
    ]);
  });

  it('can parse the System schema', () => {
    const schema = require('../../schema/kinds/System.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = { kind: 'System', apiVersion: { $in: v1alpha1beta1 } };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'System',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.owner',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
          outgoingType: 'ownedBy',
          incomingType: 'ownerOf',
        },
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.domain',
        relation: {
          defaultKind: 'Domain',
          defaultNamespace: 'inherit',
          allowedKinds: ['Domain'],
          outgoingType: 'partOf',
          incomingType: 'hasPart',
        },
      },
    ]);
  });

  it('can parse the User schema', () => {
    const schema = require('../../schema/kinds/User.v1alpha1.schema.json');
    const ops = readJsonSchema(schema);
    const expectedIf = { kind: 'User', apiVersion: { $in: v1alpha1beta1 } };

    expect(ops).toEqual([
      {
        type: 'kind.declare',
        kind: 'User',
        apiVersions: v1alpha1beta1,
        properties: {
          description: { markdown: schema.description },
          examples: schema.examples.map((json: unknown) => ({ json })),
        },
      },
      {
        type: 'entity.jsonschema',
        if: expectedIf,
        schema,
      },
      {
        type: 'field.relation',
        if: expectedIf,
        path: 'spec.memberOf',
        relation: {
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group'],
          outgoingType: 'memberOf',
          incomingType: 'hasMember',
        },
      },
    ]);
  });
});
