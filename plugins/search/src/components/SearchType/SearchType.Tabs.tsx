/*
 * Copyright 2021 The Backstage Authors
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

import React, { useEffect } from 'react';
import { useSearch } from '@backstage/plugin-search-react';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, Tab, Tabs } from '@material-ui/core';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
    padding: theme.spacing(0, 4),
  },
  tab: {
    height: '50px',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.text.primary,
    minWidth: '130px',
  },
}));

/**
 * @public
 */
export type SearchTypeTabsProps = {
  types: Array<{
    value: string;
    name: string;
  }>;
  defaultValue?: string;
};

export const SearchTypeTabs = (props: SearchTypeTabsProps) => {
  const classes = useStyles();
  const { setPageCursor, setTypes, types } = useSearch();
  const { defaultValue, types: givenTypes } = props;

  const changeTab = (_: React.ChangeEvent<{}>, newType: string) => {
    setTypes(newType !== '' ? [newType] : []);
    setPageCursor(undefined);
  };

  // Handle any provided defaultValue
  useEffect(() => {
    if (defaultValue) {
      setTypes([defaultValue]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const definedTypes = [
    {
      value: '',
      name: 'All',
    },
    ...givenTypes,
  ];

  return (
    <Tabs
      className={classes.tabs}
      indicatorColor="primary"
      value={types.length === 0 ? '' : types[0]}
      onChange={changeTab}
    >
      {definedTypes.map((type, idx) => (
        <Tab
          key={idx}
          className={classes.tab}
          disableRipple
          label={type.name}
          value={type.value}
        />
      ))}
    </Tabs>
  );
};
