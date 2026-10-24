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

import { compileCatalogModel } from './compileCatalogModel';
import { createCatalogModelLayer } from './createCatalogModelLayer';

describe('compileCatalogModel relations', () => {
  it.each(['Maintains', ''])(
    'updates the existing reverse relation title to %j without repeating its type',
    title => {
      const layer = createCatalogModelLayer({
        layerId: 'example.com/ownership',
        builder: model => {
          model.addRelationPair({
            fromKind: 'Component',
            toKind: 'Group',
            forward: { type: 'ownedBy', title: 'Owned by' },
            reverse: { type: 'ownerOf', title: 'Owner of' },
            description: 'Ownership',
          });
          model.updateRelationPair({
            fromKind: 'Component',
            toKind: 'Group',
            forward: { type: 'ownedBy' },
            reverse: { title },
          });
        },
      });

      expect(compileCatalogModel([layer]).listRelations()).toEqual([
        {
          fromKind: ['Component'],
          toKind: ['Group'],
          forward: { type: 'ownedBy', title: 'Owned by' },
          reverse: { type: 'ownerOf', title },
          description: 'Ownership',
        },
        {
          fromKind: ['Group'],
          toKind: ['Component'],
          forward: { type: 'ownerOf', title },
          reverse: { type: 'ownedBy', title: 'Owned by' },
          description: 'Ownership',
        },
      ]);
    },
  );
});
