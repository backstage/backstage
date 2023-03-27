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
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.textContrast,
  },
  tabTitle: {
    border: '1px solid',
    paddingLeft: 3,
    lineHeight: 1.6,
    borderRadius: 5,
    paddingRight: 3,
    marginLeft: 3,
  },
  activeTab: {
    backgroundColor: theme.palette.infoText,
    color: '#fff',
  },
  tab: {
    height: '70px',
  },
}));

type TabLabelProps = {
  label: string;
  completed?: number;
  total?: number;
  classes: string;
};
const TabLabel = ({ label, completed, total, classes }: TabLabelProps) => {
  return (
    <div>
      {label}
      {completed && total && (
        <Typography className={classes}>
          {completed}/{total}
        </Typography>
      )}
    </div>
  );
};

type TabBarProps = {
  tabs: string[];
  selectedTab: string;
  handleChange: (_event: React.ChangeEvent<{}>, value: string) => void;
};
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  selectedTab,
  handleChange,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={selectedTab}
          variant="fullWidth"
          onChange={handleChange}
          id="tabs"
          style={{
            height: '5em',
          }}
        >
          {tabs?.map((item: string, index: number) => {
            return (
              <Tab
                key={index}
                value={item}
                className={classes.tab}
                label={
                  <TabLabel
                    label={item?.toLocaleUpperCase('en-US')}
                    completed={0}
                    total={0}
                    classes={`${classes.tabTitle} ${
                      selectedTab === item ? classes.activeTab : null
                    }`}
                  />
                }
              />
            );
          })}
        </Tabs>
      </AppBar>
    </div>
  );
};
