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
import { createTranslationRef } from '@backstage/frontend-plugin-api';

/**
 * @alpha
 */
export const orgTranslationRef = createTranslationRef({
  id: 'org',
  messages: {
    groupProfileCard: {
      groupNotFound: 'Group not found',
      editIconButtonTitle: 'Edit Metadata',
      refreshIconButtonTitle: 'Schedule entity refresh',
      refreshIconButtonAriaLabel: 'Refresh',
      listItemTitle: {
        entityRef: 'Entity Ref',
        email: 'Email',
        parentGroup: 'Parent Group',
        childGroups: 'Child Groups',
      },
    },
    membersListCard: {
      title: 'Members',
      subtitle: 'of {{groupName}}',
      paginationLabel: ', page {{page}} of {{nbPages}}',
      noMembersDescription: 'This group has no members.',
      aggregateMembersToggle: {
        directMembers: 'Direct Members',
        aggregatedMembers: 'Aggregated Members',
        ariaLabel: 'Users Type Switch',
      },
    },
    ownershipCard: {
      title: 'Ownership',
      aggregateRelationsToggle: {
        directRelations: 'Direct Relations',
        aggregatedRelations: 'Aggregated Relations',
        ariaLabel: 'Ownership Type Switch',
      },
    },
    userProfileCard: {
      userNotFound: 'User not found',
      editIconButtonTitle: 'Edit Metadata',
      listItemTitle: {
        email: 'Email',
        memberOf: 'Member of',
      },
      moreGroupButtonTitle: '...More ({{number}})',
      allGroupDialog: {
        title: "All {{name}}'s groups:",
        closeButtonTitle: 'Close',
      },
    },
  },
});
