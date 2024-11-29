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
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TabUI, { TabProps } from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useCallback, useEffect, useState } from 'react';

// TODO(blam): Remove this implementation when the Tabs are ready
// This is just a temporary solution to implementing tabs for now

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

export type Tab = {
  id: string;
  label: string;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

type HeaderTabsProps = {
  tabs: Tab[];
  onChange?: (index: number) => void;
  selectedIndex?: number;
};

/**
 * Horizontal Tabs component
 *
 * @public
 *
 */
export function HeaderTabs(props: HeaderTabsProps) {
  const { tabs, onChange, selectedIndex } = props;
  const [selectedTab, setSelectedTab] = useState<number>(selectedIndex ?? 0);
  const styles = useStyles();

  const handleChange = useCallback(
    (_: React.ChangeEvent<{}>, index: number) => {
      if (selectedIndex === undefined) {
        setSelectedTab(index);
      }
      if (onChange) onChange(index);
    },
    [selectedIndex, onChange],
  );

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelectedTab(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <Box className={styles.tabsWrapper}>
      <Tabs
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="tabs"
        onChange={handleChange}
        value={selectedTab}
      >
        {tabs.map((tab, index) => (
          <TabUI
            data-testid={`header-tab-${index}`}
            label={tab.label}
            key={tab.id}
            value={index}
            className={styles.defaultTab}
            classes={{ selected: styles.selected, root: styles.tabRoot }}
            {...tab.tabProps}
          />
        ))}
      </Tabs>
    </Box>
  );
}
