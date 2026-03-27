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

import { ReactElement, useMemo } from 'react';
import { cn } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';

import { EntityTabsGroup } from './EntityTabsGroup';
import { catalogTranslationRef } from '../../translation';

/** @public */
export type HeaderTabsClassKey =
  | 'tabsWrapper'
  | 'defaultTab'
  | 'selected'
  | 'tabRoot';

type Tab = {
  id: string;
  label: string;
  path: string;
  group?: string;
  icon?: string | ReactElement;
};

type TabGroup = {
  group?: {
    title: string;
    icon?: string | ReactElement;
  };
  items: Array<Omit<Tab, 'group'>>;
};

type EntityTabsListProps = {
  tabs: Tab[];
  groupDefinitions: EntityContentGroupDefinitions;
  showIcons?: boolean;
  selectedIndex?: number;
};

export function EntityTabsList(props: EntityTabsListProps) {
  const { t } = useTranslationRef(catalogTranslationRef);

  const { tabs: items, selectedIndex = 0, showIcons, groupDefinitions } = props;

  const groups = useMemo(
    () =>
      items.reduce((result, tab) => {
        const group = tab.group ? groupDefinitions[tab.group] : undefined;
        const groupOrId = group && tab.group ? tab.group : tab.id;
        result[groupOrId] = result[groupOrId] ?? {
          group,
          items: [],
        };
        result[groupOrId].items.push(tab);
        return result;
      }, {} as Record<string, TabGroup>),
    [items, groupDefinitions],
  );

  const selectedItem = items[selectedIndex];
  return (
    <div className={cn('[grid-area:pageSubheader] bg-background pl-6 min-w-0')}>
      <div
        role="tablist"
        aria-label={t('entityTabs.tabsAriaLabel')}
        className="flex overflow-x-auto"
      >
        {Object.entries(groups).map(([id, tabGroup]) => (
          <EntityTabsGroup
            data-testid={`header-tab-${id}`}
            className="text-xs p-6 uppercase font-bold text-muted-foreground"
            classes={{
              selected: 'text-foreground',
              root: 'hover:bg-muted hover:text-foreground',
            }}
            key={id}
            label={tabGroup.group?.title}
            icon={tabGroup.group?.icon}
            value={id}
            items={tabGroup.items}
            highlightedButton={selectedItem?.id}
            showIcons={showIcons}
          />
        ))}
      </div>
    </div>
  );
}
