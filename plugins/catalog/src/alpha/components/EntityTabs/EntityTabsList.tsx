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
  showIcons?: boolean;
  selectedIndex?: number;
};

export function EntityTabsList(props: EntityTabsListProps) {
  const styles = useStyles();
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
    <Box className={styles.tabsWrapper}>
      <Tabs
        selectionFollowsFocus
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label={t('entityTabs.tabsAriaLabel')}
        value={selectedItem?.group ?? selectedItem?.id}
      >
        {Object.entries(groups).map(([id, tabGroup]) => (
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
