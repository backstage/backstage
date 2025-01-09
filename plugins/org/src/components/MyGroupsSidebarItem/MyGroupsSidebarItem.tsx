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
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  SidebarItem,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import {
  IconComponent,
  identityApiRef,
  useApi,
  useRouteRef,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import {
  catalogApiRef,
  CatalogApi,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { getCompoundEntityRef } from '@backstage/catalog-model';

import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';

/**
 * MyGroupsSidebarItem can be added to your sidebar providing quick access to groups the logged in user is a member of
 *
 * @public
 */
export const MyGroupsSidebarItem = (props: {
  singularTitle: string;
  pluralTitle: string;
  icon: IconComponent;
  filter?: Record<string, string | symbol | (string | symbol)[]>;
}) => {
  const { singularTitle, pluralTitle, icon, filter } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi: CatalogApi = useApi(catalogApiRef);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);

  const { value: groups } = useAsync(async () => {
    const profile = await identityApi.getBackstageIdentity();

    const response = await catalogApi.getEntities({
      filter: [
        {
          kind: 'group',
          'relations.hasMember': profile.userEntityRef,
          ...(filter ?? {}),
        },
      ],
      fields: ['metadata', 'kind'],
    });
    return response.items;
  }, []);

  if (!groups?.length) {
    return null;
  }

  // Only member of one group
  if (groups.length === 1) {
    const group = groups[0];
    return (
      <SidebarItem
        text={singularTitle}
        to={catalogEntityRoute(getCompoundEntityRef(group))}
        icon={icon}
      />
    );
  }

  // Member of more than one group
  return (
    <SidebarItem icon={icon} text={pluralTitle}>
      <SidebarSubmenu title={pluralTitle}>
        {groups?.map(group => {
          const entityDisplayName = entityPresentationApi.forEntity(group);
          return (
            <SidebarSubmenuItem
              title={entityDisplayName.snapshot.primaryTitle}
              subtitle={
                group.metadata.namespace !== DEFAULT_NAMESPACE
                  ? group.metadata.namespace
                  : undefined
              }
              to={catalogEntityRoute(getCompoundEntityRef(group))}
              icon={icon}
              key={stringifyEntityRef(group)}
            />
          );
        })}
      </SidebarSubmenu>
    </SidebarItem>
  );
};
