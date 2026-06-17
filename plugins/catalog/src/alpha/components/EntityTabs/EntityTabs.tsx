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
import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { NotFoundErrorPage } from '@backstage/frontend-plugin-api';
import { EntityTabsPanel } from './EntityTabsPanel';
import { EntityTabsList } from './EntityTabsList';
import {
  SubRoute,
  useSelectedSubRoute,
  EntityContentGroupDefinitions,
} from '@backstage/plugin-catalog-react/alpha';

type EntityTabsProps = {
  routes: SubRoute[];
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder?: 'title' | 'natural';
  showIcons?: boolean;
};

export function EntityTabs(props: EntityTabsProps) {
  const { routes, groupDefinitions, defaultContentOrder, showIcons } = props;

  const { index, route, element } = useSelectedSubRoute(routes);

  const tabs = useMemo(
    () =>
      routes.map(r => {
        const { path, title, group, icon } = r;
        let to = path;
        // Remove trailing /*
        to = to.replace(/\/\*$/, '');
        // And remove leading / for relative navigation
        to = to.replace(/^\//, '');
        return {
          group,
          id: path,
          path: to,
          label: title,
          icon,
        };
      }),
    [routes],
  );

  return (
    <>
      <EntityTabsList
        tabs={tabs}
        selectedIndex={index}
        showIcons={showIcons}
        groupDefinitions={groupDefinitions}
        defaultContentOrder={defaultContentOrder}
      />
      <EntityTabsPanel>
        <Helmet title={route?.title} />
        {element ?? <NotFoundErrorPage />}
      </EntityTabsPanel>
    </>
  );
}
