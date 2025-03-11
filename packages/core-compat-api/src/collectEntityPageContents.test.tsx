/*
 * Copyright 2025 The Backstage Authors
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

import { ExtensionAttachToSpec } from '@backstage/frontend-plugin-api';
import { EntityLayout, EntitySwitch, isKind } from '@backstage/plugin-catalog';
import React from 'react';
import { collectEntityPageContents } from './collectEntityPageContents';
import {
  createComponentExtension,
  createPlugin,
} from '@backstage/core-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  resolveExtensionDefinition,
  toInternalExtension,
} from '../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';

const fooPlugin = createPlugin({
  id: 'foo',
});

const FooContent = fooPlugin.provide(
  createComponentExtension({
    name: 'FooContent',
    component: { sync: () => <div>foo content</div> },
  }),
);
const OtherFooContent = fooPlugin.provide(
  createComponentExtension({
    name: 'OtherFooContent',
    component: { sync: () => <div>other foo content</div> },
  }),
);

const simpleTestContent = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <div>overview content</div>
    </EntityLayout.Route>
    <EntityLayout.Route path="/foo" title="Foo">
      <FooContent />
    </EntityLayout.Route>
    <EntityLayout.Route path="/bar" title="Bar">
      <div>bar content</div>
    </EntityLayout.Route>
  </EntityLayout>
);

const otherTestContent = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <div>other overview content</div>
    </EntityLayout.Route>
    <EntityLayout.Route path="/foo" title="Foo">
      <OtherFooContent />
    </EntityLayout.Route>
  </EntityLayout>
);

function collect(element: React.JSX.Element) {
  const result = new Array<{
    id: string;
    attachTo: ExtensionAttachToSpec;
  }>();

  collectEntityPageContents(element, {
    discoverExtension(extension, plugin) {
      const ext = toInternalExtension(
        resolveExtensionDefinition(extension, {
          namespace: plugin?.getId() ?? 'test',
        }),
      );
      result.push({ id: ext.id, attachTo: ext.attachTo });
    },
  });
  return result;
}

describe('collectEntityPageContents', () => {
  it('should collect contents from a simple entity page', () => {
    expect(collect(simpleTestContent)).toMatchInlineSnapshot(`
      [
        {
          "attachTo": {
            "id": "entity-content:catalog/overview",
            "input": "cards",
          },
          "id": "entity-card:test/discovered-1",
        },
        {
          "attachTo": {
            "id": "page:catalog/entity",
            "input": "contents",
          },
          "id": "entity-content:foo/discovered-1",
        },
        {
          "attachTo": {
            "id": "page:catalog/entity",
            "input": "contents",
          },
          "id": "entity-content:test/discovered-2",
        },
      ]
    `);
  });

  it('should collect contents from an entity page with an entity switch', () => {
    expect(
      collect(
        <EntitySwitch>
          <EntitySwitch.Case if={isKind('test')}>
            {simpleTestContent}
          </EntitySwitch.Case>
          <EntitySwitch.Case>{otherTestContent}</EntitySwitch.Case>
        </EntitySwitch>,
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "attachTo": {
            "id": "entity-content:catalog/overview",
            "input": "cards",
          },
          "id": "entity-card:test/discovered-1",
        },
        {
          "attachTo": {
            "id": "page:catalog/entity",
            "input": "contents",
          },
          "id": "entity-content:foo/discovered-1",
        },
        {
          "attachTo": {
            "id": "page:catalog/entity",
            "input": "contents",
          },
          "id": "entity-content:test/discovered-2",
        },
        {
          "attachTo": {
            "id": "entity-content:catalog/overview",
            "input": "cards",
          },
          "id": "entity-card:test/discovered-2",
        },
        {
          "attachTo": {
            "id": "page:catalog/entity",
            "input": "contents",
          },
          "id": "entity-content:foo/discovered-3",
        },
      ]
    `);
  });
});
