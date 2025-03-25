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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import { EntityTabsGroup } from './EntityTabsGroup';

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
  group: string;
};

type TabItem = {
  group: string;
  id: string;
  index: number;
  label: string;
  path: string;
};

type EntityTabsListProps = {
  tabs: Tab[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
};

export function EntityTabsList(props: EntityTabsListProps) {
  const styles = useStyles();

  const { tabs: items, onChange, selectedIndex: selectedItem = 0 } = props;

  const groups = useMemo(
    () => [...new Set(items.map(item => item.group))],
    [items],
  );

  const [selectedGroup, setSelectedGroup] = useState<number>(
    selectedItem && items[selectedItem]
      ? groups.indexOf(items[selectedItem].group)
      : 0,
  );

  const handleChange = useCallback(
    (index: number) => {
      if (selectedItem !== index) onChange?.(index);
    },
    [selectedItem, onChange],
  );

  useEffect(() => {
    if (selectedItem === undefined || !items[selectedItem]) return;
    setSelectedGroup(groups.indexOf(items[selectedItem].group));
  }, [items, selectedItem, groups, setSelectedGroup]);

  return (
    <Box className={styles.tabsWrapper}>
      <Tabs
        selectionFollowsFocus
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="tabs"
        value={selectedGroup}
      >
        {groups.map((group, groupIndex) => {
          const groupItems: TabItem[] = [];
          items.forEach((item, itemIndex) => {
            if (item.group === group) {
              groupItems.push({
                ...item,
                index: itemIndex,
              });
            }
          });
          return (
            <EntityTabsGroup
              data-testid={`header-tab-${groupIndex}`}
              className={styles.defaultTab}
              classes={{ selected: styles.selected, root: styles.tabRoot }}
              key={group}
              label={group}
              value={groupIndex}
              items={groupItems}
              highlightedButton={selectedItem}
              onSelectTab={() => handleChange(groupIndex)}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
