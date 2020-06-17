/*
 * Copyright 2020 Spotify AB
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

// TODO(blam): Remove this implementation when the Tabs are ready
// This is just a temporary solution to implementing tabs for now

import React, { useState } from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tabsWrapper: {
    gridArea: 'pageSubheader',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
  },
  defaultTab: {
    padding: theme.spacing(3, 3),
    ...theme.typography.caption,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
  },
  selected: {
    color: theme.palette.text.primary,
  },
}));

export type Tab = {
  id: string;
  label: string;
};
export const HeaderTabs: React.FC<{
  tabs: Tab[];
  onChange?: (index: Number) => void;
}> = ({ tabs, onChange }) => {
  const [selectedTab, setSelectedTab] = useState<Number>(0);
  const styles = useStyles();

  const handleChange = (_: React.ChangeEvent<{}>, index: Number) => {
    setSelectedTab(index);
    if (onChange) onChange(index);
  };

  return (
    <div className={styles.tabsWrapper}>
      <Tabs
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        onChange={handleChange}
        value={selectedTab}
      >
        {tabs.map((tab, index) => (
          <Tab
            label={tab.label}
            key={tab.id}
            value={index}
            className={styles.defaultTab}
            classes={{ selected: styles.selected }}
          />
        ))}
      </Tabs>
    </div>
  );
};
