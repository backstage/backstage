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

import { ApiItem, ApiItemKind } from '@microsoft/api-extractor-model';
import { disambiguateFilename } from './buildDocs';

type FakeItem = {
  kind: ApiItemKind;
  displayName: string;
  parent?: FakeItem;
  members: FakeItem[];
  getHierarchy(): FakeItem[];
};

function item(kind: ApiItemKind, displayName: string, parent?: FakeItem) {
  const created: FakeItem = {
    kind,
    displayName,
    parent,
    members: [],
    getHierarchy: () =>
      parent ? [...parent.getHierarchy(), created] : [created],
  };
  parent?.members.push(created);
  return created;
}

describe('disambiguateFilename', () => {
  it('should give colliding declarations separate filenames', () => {
    const pkg = item(ApiItemKind.Package, '@backstage/backend-test-utils');
    const entryPoint = item(ApiItemKind.EntryPoint, '', pkg);
    const variable = item(ApiItemKind.Variable, 'mockServices', entryPoint);
    const iface = item(ApiItemKind.Interface, 'MockServices', entryPoint);
    const namespace = item(ApiItemKind.Namespace, 'mockServices', entryPoint);
    const ifaceMember = item(
      ApiItemKind.PropertySignature,
      'rootConfig',
      iface,
    );
    const namespaceMember = item(
      ApiItemKind.Namespace,
      'rootConfig',
      namespace,
    );
    const other = item(ApiItemKind.Function, 'mockErrorHandler', entryPoint);

    const disambiguate = (filename: string, apiItem: FakeItem) =>
      disambiguateFilename(filename, apiItem as unknown as ApiItem);

    expect(disambiguate('backend-test-utils.mockservices.md', variable)).toBe(
      'backend-test-utils.mockservices.md',
    );
    expect(disambiguate('backend-test-utils.mockservices.md', iface)).toBe(
      'backend-test-utils.mockservices-interface.md',
    );
    expect(disambiguate('backend-test-utils.mockservices.md', namespace)).toBe(
      'backend-test-utils.mockservices-namespace.md',
    );
    expect(
      disambiguate(
        'backend-test-utils.mockservices.rootconfig.md',
        ifaceMember,
      ),
    ).toBe('backend-test-utils.mockservices-interface.rootconfig.md');
    expect(
      disambiguate(
        'backend-test-utils.mockservices.rootconfig.md',
        namespaceMember,
      ),
    ).toBe('backend-test-utils.mockservices-namespace.rootconfig.md');
    expect(disambiguate('backend-test-utils.mockerrorhandler.md', other)).toBe(
      'backend-test-utils.mockerrorhandler.md',
    );
  });
});
