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
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(
  theme => ({
    tabsWrapper: {
      gridArea: 'pageSubheader',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: theme.spacing(3),
      minWidth: 0,
    },
    defaultTab: {
      ...theme.typography.caption,
      padding: theme.spacing(3, 3),
      textTransform: 'uppercase',
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.secondary,
    },
    selected: {
      color: theme.palette.text.primary,
    },
    tabRoot: {
      '&:hover': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    },
  }),
  { name: 'BackstageHeaderTabs' },
);

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
  defaultContentOrder?: 'title' | 'natural';
  showIcons?: boolean;
  selectedIndex?: number;
};

function resolveGroupId(
  tabGroup: string | undefined,
  groupDefinitions: EntityContentGroupDefinitions,
  aliasToGroup: Record<string, string>,
): string | undefined {
  if (!tabGroup) {
    return undefined;
  }
  if (groupDefinitions[tabGroup]) {
    return tabGroup;
  }
  return aliasToGroup[tabGroup];
}

export function EntityTabsList(props: EntityTabsListProps) {
  const styles = useStyles();
  const { t } = useTranslationRef(catalogTranslationRef);

  const {
    tabs: items,
    selectedIndex = 0,
    showIcons,
    groupDefinitions,
    defaultContentOrder = 'title',
  } = props;

  const aliasToGroup = useMemo(
    () =>
      Object.entries(groupDefinitions).reduce((map, [groupId, def]) => {
        for (const alias of def.aliases ?? []) {
          map[alias] = groupId;
        }
        return map;
      }, {} as Record<string, string>),
    [groupDefinitions],
  );

  const groups = useMemo(() => {
    const byKey = items.reduce((result, tab) => {
      const resolvedGroupId = resolveGroupId(
        tab.group,
        groupDefinitions,
        aliasToGroup,
      );
      const group = resolvedGroupId
        ? groupDefinitions[resolvedGroupId]
        : undefined;
      const groupOrId = group && resolvedGroupId ? resolvedGroupId : tab.id;
      result[groupOrId] = result[groupOrId] ?? {
        group,
        items: [],
      };
      result[groupOrId].items.push(tab);
      return result;
    }, {} as Record<string, TabGroup>);

    const groupOrder = Object.keys(groupDefinitions);
    const sorted = Object.entries(byKey).sort(([a], [b]) => {
      const ai = groupOrder.indexOf(a);
      const bi = groupOrder.indexOf(b);
      if (ai !== -1 && bi !== -1) {
        return ai - bi;
      }
      if (ai !== -1) {
        return -1;
      }
      if (bi !== -1) {
        return 1;
      }
      return 0;
    });

    for (const [id, tabGroup] of sorted) {
      const groupDef = groupDefinitions[id];
      if (groupDef) {
        const order = groupDef.contentOrder ?? defaultContentOrder;
        if (order === 'title') {
          tabGroup.items.sort((a, b) =>
            a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
          );
        }
      }
    }

    return sorted;
  }, [items, groupDefinitions, aliasToGroup, defaultContentOrder]);

  const selectedItem = items[selectedIndex];
  const selectedGroup = resolveGroupId(
    selectedItem?.group,
    groupDefinitions,
    aliasToGroup,
  );
  return (
    <Box className={styles.tabsWrapper}>
      <Tabs
        selectionFollowsFocus
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label={t('entityTabs.tabsAriaLabel')}
        value={selectedGroup ?? selectedItem?.id}
      >
        {groups.map(([id, tabGroup]) => (
          <EntityTabsGroup
            data-testid={`header-tab-${id}`}
            className={styles.defaultTab}
            classes={{ selected: styles.selected, root: styles.tabRoot }}
            key={id}
            label={tabGroup.group?.title}
            icon={tabGroup.group?.icon}
            value={id}
            items={tabGroup.items}
            highlightedButton={selectedItem?.id}
            showIcons={showIcons}
          />
        ))}
      </Tabs>
    </Box>
  );
}
