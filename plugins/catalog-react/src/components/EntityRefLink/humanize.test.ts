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

import { Entity } from '@backstage/catalog-model';
import { humanizeEntity, humanizeEntityRef } from './humanize';

describe('humanizeEntityRef', () => {
  it('formats entity in default namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity);
    expect(title).toEqual('component:software');
  });

  it('formats entity in default namespace without skipping default namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity, { defaultNamespace: false });
    expect(title).toEqual('component:default/software');
  });

  it('formats entity in other namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity);
    expect(title).toEqual('component:test/software');
  });

  it('formats entity in other namespace and hides this namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity, { defaultNamespace: 'test' });
    expect(title).toEqual('component:software');
  });

  it('formats entity and hides default kind', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity, { defaultKind: 'Component' });
    expect(title).toEqual('test/software');
  });

  it('formats entity and hides default kind and hiding namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const title = humanizeEntityRef(entity, {
      defaultKind: 'Component',
      defaultNamespace: 'test',
    });
    expect(title).toEqual('software');
  });

  it('formats entity name in default namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    const title = humanizeEntityRef(entityName);
    expect(title).toEqual('component:software');
  });

  it('formats entity name in default namespace and does not skip default namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    const title = humanizeEntityRef(entityName, { defaultNamespace: false });
    expect(title).toEqual('component:default/software');
  });

  it('formats entity name in other namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = humanizeEntityRef(entityName);
    expect(title).toEqual('component:test/software');
  });

  it('formats entity name in other namespace with skipping this namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = humanizeEntityRef(entityName, {
      defaultNamespace: 'test',
    });
    expect(title).toEqual('component:software');
  });

  it('renders link for entity name and hides default kind', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = humanizeEntityRef(entityName, {
      defaultKind: 'component',
    });
    expect(title).toEqual('test/software');
  });

  it('renders link for entity name and hides default kind with skipping namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };

    const title = humanizeEntityRef(entityName, {
      defaultKind: 'component',
      defaultNamespace: 'test',
    });
    expect(title).toEqual('software');
  });

  it('formats entity name in default namespace without skip of default namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };

    const title = humanizeEntityRef(entityName, {
      defaultNamespace: false,
    });
    expect(title).toEqual('component:default/software');
  });
});

describe('humanizeEntity', () => {
  it('gives a readable name when one is provided at metadata.title', () => {
    expect(
      humanizeEntity(
        {
          metadata: { name: 'my-entity', title: 'My Title' },
        } as Entity,
        'default',
      ),
    ).toBe('My Title');
  });

  it.each([
    [
      'User',
      {
        apiVersion: '1',
        kind: 'User',
        metadata: {
          name: 'user-name',
        },
        spec: {
          profile: {
            displayName: 'User Name',
          },
        },
      },
      'User Name',
    ],
    [
      'Group',
      {
        apiVersion: '1',
        kind: 'User',
        metadata: {
          name: 'team-name',
        },
        spec: {
          profile: {
            displayName: 'Team Name',
          },
        },
      },
      'Team Name',
    ],
  ])(
    'gives a readable name for kind %s when one is provided at spec.profile.displayName',
    (_, entity: Entity, expected) => {
      expect(humanizeEntity(entity, 'default')).toBe(expected);
    },
  );

  it('should pass through to humanizeEntityRef when nothing matches', () => {
    expect(
      humanizeEntity(
        { kind: 'Group', metadata: { name: 'test' } } as Entity,
        'default',
      ),
    ).toBe('default');
  });
});
