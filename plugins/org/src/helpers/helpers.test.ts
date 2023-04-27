/*
 * Copyright 2023 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import {
  getAllDesendantMembersForGroupEntity,
  getMembersFromGroups,
  getDescendantGroupsFromGroup,
  removeDuplicateEntitiesFrom,
} from './helpers';
import {
  groupA,
  groupARef,
  groupB,
  groupBRef,
  groupC,
  groupCRef,
  groupD,
  groupDRef,
  groupE,
  groupERef,
  groupAUserOne,
  groupBUserOne,
  groupDUserOne,
  groupEUserOne,
  duplicatedUser,
  mockedCatalogApiSupportingGroups,
} from '../test-helpers/catalogMocks';

describe('Helper functions', () => {
  it('getAllDesendantMembersForGroupEntity correctly recursively returns all descendant members', async () => {
    const catalogApi = mockedCatalogApiSupportingGroups as CatalogApi;

    const actualGroupADescendantMembers =
      await getAllDesendantMembersForGroupEntity(groupA, catalogApi);
    const actualGroupCDescendantMembers =
      await getAllDesendantMembersForGroupEntity(groupC, catalogApi);

    expect(actualGroupADescendantMembers).toStrictEqual([
      groupBUserOne,
      groupDUserOne,
      duplicatedUser,
      groupEUserOne,
      duplicatedUser,
    ]);
    expect(actualGroupCDescendantMembers).toStrictEqual([]);
  });

  it('getMembersFromGroups correctly returns all members of provided groups', async () => {
    const catalogApi = mockedCatalogApiSupportingGroups as CatalogApi;

    const actualNoGroupsMembers = await getMembersFromGroups([], catalogApi);
    const actualGroupAMembers = await getMembersFromGroups(
      [groupARef],
      catalogApi,
    );
    const actualGroupCMembers = await getMembersFromGroups(
      [groupCRef],
      catalogApi,
    );
    const actualMultipleGroupMembers = await getMembersFromGroups(
      [groupARef, groupBRef, groupCRef],
      catalogApi,
    );

    expect(actualNoGroupsMembers).toStrictEqual([]);
    expect(actualGroupAMembers).toStrictEqual([groupAUserOne, duplicatedUser]);
    expect(actualGroupCMembers).toStrictEqual([]);
    expect(actualMultipleGroupMembers).toStrictEqual([
      groupAUserOne,
      duplicatedUser,
      groupBUserOne,
    ]);
  });

  it('removeDuplicateEntitiesFrom correctly removes duplicate entities', () => {
    const actualNoDuplicatedEntitiesResult = removeDuplicateEntitiesFrom([
      groupA,
      groupB,
      groupC,
      groupD,
    ]);
    const actualDuplicatedEntitiesResult = removeDuplicateEntitiesFrom([
      groupA,
      groupB,
      groupB,
      groupC,
      groupC,
      groupD,
      groupE,
    ]);
    const actualNoEntitiesProvidedResult = removeDuplicateEntitiesFrom([]);

    expect(actualNoDuplicatedEntitiesResult).toStrictEqual([
      groupA,
      groupB,
      groupC,
      groupD,
    ]);
    expect(actualDuplicatedEntitiesResult).toStrictEqual([
      groupA,
      groupB,
      groupC,
      groupD,
      groupE,
    ]);
    expect(actualNoEntitiesProvidedResult).toStrictEqual([]);
  });

  it('getDescendantGroupsFromGroup correctly recursively returns descendant groups, ignoring duplicates', async () => {
    const actualDescendantGroups = await getDescendantGroupsFromGroup(
      groupA,
      mockedCatalogApiSupportingGroups as CatalogApi,
    );
    expect(actualDescendantGroups).toStrictEqual([
      groupBRef,
      groupCRef,
      groupDRef,
      groupERef,
    ]);
  });
});
