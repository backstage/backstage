/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import {
  SidebarItem,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import {
  IconComponent,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';

export const MySquads = ({
  singularTitle,
  pluralTitle,
  icon,
}: {
  singularTitle: string;
  pluralTitle: string;
  icon: IconComponent;
}) => {
  const identityApi = useApi(identityApiRef);
  const catalogApi: CatalogApi = useApi(catalogApiRef);

  const { value: groups } = useAsync(async () => {
    const profile = await identityApi.getBackstageIdentity();

    const response = await catalogApi.getEntities({
      filter: [{ kind: 'group', 'relations.hasMember': profile.userEntityRef }],
      fields: ['metadata', 'kind'],
    });
    return response.items;
  }, []);

  if (groups && groups.length === 1) {
    // Only member of one group
    const group = groups[0];
    return (
      <SidebarItem
        text={singularTitle}
        to={`/catalog/${group.metadata.namespace}/${group.kind}/${group.metadata.name}`}
        icon={icon}
      />
    );
  }

  // Member of more than one group
  // or not a member of any groups
  return groups && groups.length > 1 ? (
    <SidebarItem icon={icon} to="catalog" text={pluralTitle}>
      <SidebarSubmenu title={pluralTitle}>
        {groups?.map(function groupsMap(group) {
          return (
            <SidebarSubmenuItem
              title={group.metadata.title || group.metadata.name}
              to={`/catalog/${group.metadata.namespace}/${group.kind}/${group.metadata.name}`}
              icon={icon}
              key={group.metadata.name}
            />
          );
        })}
      </SidebarSubmenu>
    </SidebarItem>
  ) : (
    <></>
  );
};
