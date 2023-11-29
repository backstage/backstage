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
import React, { FC } from 'react';

import { Tabs, Tab, makeStyles, alpha } from '@material-ui/core';

import { Discipline } from '../../types';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
    justifyContent: 'center',
  },

  tabSelected: {
    color: `${theme.palette.getContrastText(theme.palette.text.secondary)} !important`,
    backgroundColor: `${theme.palette.text.secondary} !important`,
  },

  indicator: {
    display: 'none',
  },

  tab: {
    color: theme.palette.text.secondary,
    borderLeft: `0.5px solid ${theme.palette.text.secondary}`,
    borderRight: `0.5px solid ${theme.palette.text.secondary}`,
    borderTop: `1.5px solid ${theme.palette.text.secondary}`,
    borderBottom: `1.5px solid ${theme.palette.text.secondary}`,
    textTransform: 'uppercase',
    '&:hover': {
      color: alpha(theme.palette.text.secondary, 0.5),
      backgroundColor: alpha(theme.palette.text.secondary, 0.2),
    },
  },

  tabs: {
    gridArea: 'pageSubheader',
    '& a': {
      padding: theme.spacing(3.8, 3, 2.8, 3),
    },
    '& .Mui-disabled': {
      opacity: 0.3,
    },
  },

  tabsContainer: {
    '&:first-child': {
      borderLeft: `0.5px solid ${theme.palette.text.secondary}`,
      borderRight: `0.5px solid ${theme.palette.text.secondary}`,
    },
  },
}));

const DisciplineToLabel = new Map<Discipline, string>([
  [Discipline.Backend, 'backend'],
  [Discipline.Client, 'client'],
  [Discipline.Web, 'web'],
  [Discipline.Data, 'data'],
  [Discipline.DataScience, 'data science'],
]);

interface DisciplineFilterProps {
  value?: Discipline;
  onChange: (e?: Discipline) => void;
}

const DisciplineFilter: FC<DisciplineFilterProps> = ({ value, onChange }) => {
  const classes = useStyles();

  const handleTabChange = (e: React.ChangeEvent<{}>, curTab: string) => {
    e.preventDefault();
    onChange(curTab as Discipline);
  };

  const handleOnClick = (event: React.ChangeEvent<{ innerText: string }>) => {
    event.preventDefault();
    const mappedValue = event.target.innerText.toLowerCase();

    const current: Discipline = [...DisciplineToLabel.entries()]
      .filter(({ 1: v }) => v === mappedValue)
      .map(([k]) => k)[0];

    if (value && value === current) {
      onChange();
    }
  };

  return (
    <div className={classes.container}>
      <Tabs
        classes={{
          root: classes.tabs,
          indicator: classes.indicator,
          flexContainer: classes.tabsContainer,
        }}
        onChange={handleTabChange}
        value={value || false}
        TabIndicatorProps={{
          style: { transition: 'none' },
        }}
      >
        {Object.values(Discipline)
          .sort()
          .map(tab => {
            const label = DisciplineToLabel.get(tab);

            return (
              <Tab
                classes={{ root: classes.tab, selected: classes.tabSelected }}
                label={label}
                key={tab}
                value={tab}
                onClick={handleOnClick}
              />
            );
          })}
      </Tabs>
    </div>
  );
};

export default DisciplineFilter;
