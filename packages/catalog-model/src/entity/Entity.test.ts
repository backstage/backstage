/*
 * Copyright 2021 Spotify AB
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
import { AnyValidateFunction } from 'ajv/dist/core';
import entitySchema from '../schema/Entity.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';
import { Entity } from './Entity';

describe('Entity', () => {
  let entity: any;
  let validate: AnyValidateFunction;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        uid: 'e01199ab-08cc-44c2-8e19-5c29ded82521',
        etag: 'lsndfkjsndfkjnsdfkjnsd==',
        generation: 13,
        name: 'test',
        namespace: 'ns',
        labels: {
          'backstage.io/custom': 'ValueStuff',
        },
        annotations: {
          'example.com/bindings': 'are-secret',
        },
        tags: ['java', 'data'],
        links: [
          {
            url: 'https://example.com',
            title: 'Website',
            icon: 'website',
          },
        ],
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'me',
      },
      relations: [
        { type: 't', target: { kind: 'k', namespace: 'ns', name: 'n' } },
      ],
      status: {
        items: [
          {
            type: 't',
            level: 'error',
            message: 'm',
            error: { name: 'n', message: 'm', code: '1', stack: 's' },
          },
        ],
      },
    };

    const ajv = new Ajv({ allowUnionTypes: true });
    ajv.addSchema([entityMetaSchema, commonSchema], undefined, undefined, true);
    validate = ajv.compile(entitySchema);
  });

  function check(data: unknown): () => true {
    return () => {
      const result = validate(data);
      if (result === true) {
        return true;
      }

      const [error] = validate.errors || [];
      if (!error) {
        throw new TypeError('Unknown error');
      }

      throw new TypeError(
        `${error.dataPath || '<root>'} ${error.message}${
          error.params
            ? ` - ${Object.entries(error.params)
                .map(([key, val]) => `${key}: ${val}`)
                .join(', ')}`
            : ''
        }`,
      );
    };
  }

  it('happy path: accepts valid data', () => {
    expect(check(entity)).not.toThrow();
  });

  //
  // apiVersion and kind
  //

  it('rejects wrong root type', () => {
    expect(check((7 as unknown) as Entity)).toThrow(/object/);
  });

  it('rejects missing apiVersion', () => {
    delete entity.apiVersion;
    expect(check(entity)).toThrow(/apiVersion/);
  });

  it('rejects bad apiVersion type', () => {
    entity.apiVersion = 7;
    expect(check(entity)).toThrow(/apiVersion/);
  });

  it('rejects empty apiVersion', () => {
    entity.apiVersion = '';
    expect(check(entity)).toThrow(/apiVersion/);
  });

  it('rejects missing kind', () => {
    delete entity.kind;
    expect(check(entity)).toThrow(/kind/);
  });

  it('rejects bad kind type', () => {
    entity.kind = 7;
    expect(check(entity)).toThrow(/kind/);
  });

  it('rejects empty kind', () => {
    entity.kind = '';
    expect(check(entity)).toThrow(/kind/);
  });

  //
  // metadata
  //

  it('rejects missing metadata', () => {
    delete entity.metadata;
    expect(check(entity)).toThrow(/metadata/);
  });

  it('rejects bad metadata type', () => {
    entity.metadata = 7;
    expect(check(entity)).toThrow(/metadata/);
  });

  it('accepts missing uid', () => {
    delete entity.metadata.uid;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad uid type', () => {
    entity.metadata.uid = 7;
    expect(check(entity)).toThrow(/uid/);
  });

  it('rejects empty uid', () => {
    entity.metadata.uid = '';
    expect(check(entity)).toThrow(/uid/);
  });

  it('accepts missing etag', () => {
    delete entity.metadata.etag;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad etag type', () => {
    entity.metadata.etag = 7;
    expect(check(entity)).toThrow(/etag/);
  });

  it('rejects empty etag', () => {
    entity.metadata.etag = '';
    expect(check(entity)).toThrow(/etag/);
  });

  it('accepts missing generation', () => {
    delete entity.metadata.generation;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad generation type', () => {
    entity.metadata.generation = 'a';
    expect(check(entity)).toThrow(/generation/);
  });

  it('rejects zero generation', () => {
    entity.metadata.generation = 0;
    expect(check(entity)).toThrow(/generation/);
  });

  it('rejects non-integer generation', () => {
    entity.metadata.generation = 1.5;
    expect(check(entity)).toThrow(/generation/);
  });

  it('rejects missing name', () => {
    delete entity.metadata.name;
    expect(check(entity)).toThrow(/name/);
  });

  it('rejects bad name type', () => {
    entity.metadata.name = 7;
    expect(check(entity)).toThrow(/name/);
  });

  it('accepts missing namespace', () => {
    delete entity.metadata.namespace;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad namespace type', () => {
    entity.metadata.namespace = 7;
    expect(check(entity)).toThrow(/namespace/);
  });

  it('accepts missing description', () => {
    delete entity.metadata.description;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad description type', () => {
    entity.metadata.description = 7;
    expect(check(entity)).toThrow(/description/);
  });

  it('accepts missing labels', () => {
    delete entity.metadata.labels;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty labels', () => {
    entity.metadata.labels = {};
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad labels type', () => {
    entity.metadata.labels = 7;
    expect(check(entity)).toThrow(/labels/);
  });

  it('accepts missing annotations', () => {
    delete entity.metadata.annotations;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty annotations object', () => {
    entity.metadata.annotations = {};
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad annotations type', () => {
    entity.metadata.annotations = 7;
    expect(check(entity)).toThrow(/annotations/);
  });

  it('rejects bad tags type', () => {
    entity.metadata.tags = 7;
    expect(check(entity)).toThrow(/tags/);
  });

  it('accepts empty tags', () => {
    entity.metadata.tags = [];
    expect(check(entity)).not.toThrow();
  });

  it('rejects empty tag', () => {
    entity.metadata.tags[0] = '';
    expect(check(entity)).toThrow(/tags/);
  });

  it('rejects bad tag type', () => {
    entity.metadata.tags[0] = 7;
    expect(check(entity)).toThrow(/tags/);
  });

  it('accepts missing links', () => {
    delete entity.metadata.links;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty links', () => {
    entity.metadata.links = [];
    expect(check(entity)).not.toThrow();
  });

  it('rejects empty links.url', () => {
    entity.metadata.links[0].url = '';
    expect(check(entity)).toThrow(/links/);
  });

  it('rejects missing links.url', () => {
    delete entity.metadata.links[0].url;
    expect(check(entity)).toThrow(/links/);
  });

  it('rejects bad links.url type', () => {
    entity.metadata.links[0].url = 7;
    expect(check(entity)).toThrow(/links/);
  });

  it('rejects empty links.title', () => {
    entity.metadata.links[0].title = '';
    expect(check(entity)).toThrow(/links/);
  });

  it('accepts missing links.title', () => {
    delete entity.metadata.links[0].title;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad links.title type', () => {
    entity.metadata.links[0].title = 7;
    expect(check(entity)).toThrow(/links/);
  });

  it('rejects empty links.icon', () => {
    entity.metadata.links[0].icon = '';
    expect(check(entity)).toThrow(/links/);
  });

  it('accepts missing links.icon', () => {
    delete entity.metadata.links[0].icon;
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad links.icon type', () => {
    entity.metadata.links[0].icon = 7;
    expect(check(entity)).toThrow(/links/);
  });

  it('accepts unknown metadata field', () => {
    entity.metadata.unknown = 7;
    expect(check(entity)).not.toThrow();
  });

  //
  // spec
  //

  it('accepts missing spec', () => {
    delete entity.spec;
    expect(check(entity)).not.toThrow();
  });

  it('rejects non-object spec', () => {
    entity.spec = 7;
    expect(check(entity)).toThrow(/spec/);
  });

  it('accepts unknown spec field', () => {
    entity.spec.unknown = 7;
    expect(check(entity)).not.toThrow();
  });

  //
  // Relations
  //

  it('accepts missing relations', () => {
    delete entity.relations;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty relations', () => {
    entity.relations = [];
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad relations type', () => {
    entity.relations = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects missing relations.type', () => {
    delete entity.relations[0].type;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects empty relations.type', () => {
    entity.relations[0].type = '';
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects wrong relations.type type', () => {
    entity.relations[0].type = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects missing relations.target', () => {
    delete entity.relations[0].target;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects empty relations.target', () => {
    entity.relations[0].target = '';
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects wrong relations.target type', () => {
    entity.relations[0].target = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects missing relations.target.kind', () => {
    delete entity.relations[0].target.kind;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects empty relations.target.kind', () => {
    entity.relations[0].target.kind = '';
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects wrong relations.target.kind type', () => {
    entity.relations[0].target.kind = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects missing relations.target.namespace', () => {
    delete entity.relations[0].target.namespace;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects empty relations.target.namespace', () => {
    entity.relations[0].target.namespace = '';
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects wrong relations.target.namespace type', () => {
    entity.relations[0].target.namespace = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects missing relations.target.name', () => {
    delete entity.relations[0].target.name;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects empty relations.target.name', () => {
    entity.relations[0].target.name = '';
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects wrong relations.target.name type', () => {
    entity.relations[0].target.name = 7;
    expect(check(entity)).toThrow(/relations/);
  });

  it('rejects unknown relation field', () => {
    entity.relations[0].unknown = 7;
    expect(check(entity)).toThrow(/unknown/);
  });

  //
  // Status
  //

  it('accepts missing status', () => {
    delete entity.status;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty status', () => {
    entity.status = {};
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status type', () => {
    entity.status = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('accepts missing status.items', () => {
    delete entity.status.items;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty status.items', () => {
    entity.status.items = [];
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status.items type', () => {
    entity.status.items = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects bad status.items item type', () => {
    entity.status.items[0] = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects missing status.items.type', () => {
    delete entity.status.items[0].type;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects empty status.items.type', () => {
    entity.status.items[0].type = '';
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects bad status.items.type type', () => {
    entity.status.items[0].type = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects missing status.items.level', () => {
    delete entity.status.items[0].level;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects empty status.items.level', () => {
    entity.status.items[0].level = '';
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects bad status.items.level type', () => {
    entity.status.items[0].level = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects bad status.items.level enum', () => {
    entity.status.items[0].level = 'unknown';
    expect(check(entity)).toThrow(/status/);
  });

  it('rejects missing status.items.message', () => {
    delete entity.status.items[0].message;
    expect(check(entity)).toThrow(/status/);
  });

  it('accepts empty status.items.message', () => {
    entity.status.items[0].message = '';
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status.items.message type', () => {
    entity.status.items[0].message = 7;
    expect(check(entity)).toThrow(/status/);
  });

  it('accepts missing status.items.error', () => {
    delete entity.status.items[0].error;
    expect(check(entity)).not.toThrow();
  });

  it('rejects missing status.items.error.name', () => {
    delete entity.status.items[0].error.name;
    expect(check(entity)).toThrow(/name/);
  });

  it('rejects empty status.items.error.name', () => {
    entity.status.items[0].error.name = '';
    expect(check(entity)).toThrow(/name/);
  });

  it('rejects bad status.items.error.name type', () => {
    entity.status.items[0].error.name = 7;
    expect(check(entity)).toThrow(/name/);
  });

  it('rejects missing status.items.error.message', () => {
    delete entity.status.items[0].error.message;
    expect(check(entity)).toThrow(/message/);
  });

  it('accepts empty status.items.error.message', () => {
    entity.status.items[0].error.message = '';
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status.items.error.message type', () => {
    entity.status.items[0].error.message = 7;
    expect(check(entity)).toThrow(/message/);
  });

  it('accepts missing status.items.error.code', () => {
    delete entity.status.items[0].error.code;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty status.items.error.code', () => {
    entity.status.items[0].error.code = '';
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status.items.error.code type', () => {
    entity.status.items[0].error.code = 7;
    expect(check(entity)).toThrow(/code/);
  });

  it('accepts missing status.items.error.stack', () => {
    delete entity.status.items[0].error.stack;
    expect(check(entity)).not.toThrow();
  });

  it('accepts empty status.items.error.stack', () => {
    entity.status.items[0].error.stack = '';
    expect(check(entity)).not.toThrow();
  });

  it('rejects bad status.items.error.stack type', () => {
    entity.status.items[0].error.stack = 7;
    expect(check(entity)).toThrow(/stack/);
  });

  it('accepts unknown status.items field', () => {
    entity.status.items[0].unknown = 7;
    expect(check(entity)).not.toThrow();
  });

  it('accepts unknown status.items.error field', () => {
    entity.status.items[0].error.unknown = 7;
    expect(check(entity)).not.toThrow();
  });
});
