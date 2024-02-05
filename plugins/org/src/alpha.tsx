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

import {
  compatWrapper,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { createPlugin } from '@backstage/frontend-plugin-api';
import React from 'react';
import { catalogIndexRouteRef } from './routes';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';

/** @alpha */
const EntityGroupProfileCard = createEntityCardExtension({
  name: 'group-profile',
  filter: 'kind:group',
  loader: async () =>
    import('./components/Cards/Group/GroupProfile/GroupProfileCard').then(m =>
      compatWrapper(<m.GroupProfileCard />),
    ),
});

/** @alpha */
const EntityMembersListCard = createEntityCardExtension({
  name: 'members-list',
  filter: 'kind:group',
  loader: async () =>
    import('./components/Cards/Group/MembersList/MembersListCard').then(m =>
      compatWrapper(<m.MembersListCard />),
    ),
});

/** @alpha */
const EntityOwnershipCard = createEntityCardExtension({
  name: 'ownership',
  filter: 'kind:group,user',
  loader: async () =>
    import('./components/Cards/OwnershipCard/OwnershipCard').then(m =>
      compatWrapper(<m.OwnershipCard />),
    ),
});

/** @alpha */
const EntityUserProfileCard = createEntityCardExtension({
  name: 'user-profile',
  filter: 'kind:user',
  loader: async () =>
    import('./components/Cards/User/UserProfileCard/UserProfileCard').then(m =>
      compatWrapper(<m.UserProfileCard />),
    ),
});

/** @alpha */
export default createPlugin({
  id: 'org',
  extensions: [
    EntityGroupProfileCard,
    EntityMembersListCard,
    EntityOwnershipCard,
    EntityUserProfileCard,
  ],
  externalRoutes: convertLegacyRouteRefs({
    catalogIndex: catalogIndexRouteRef,
  }),
});
