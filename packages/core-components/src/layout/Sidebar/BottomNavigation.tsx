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

import {
  BottomNavigation as MUIBottomNavigation,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

/**
 * Filters for sidebar groups and reorders them to create a custom BottomNavigation
 */
export const BottomNavigation = ({ children }: React.PropsWithChildren<{}>) => {
  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <MUIBottomNavigation
      value={value}
      onChange={handleChange}
      className={classes.root}
    >
      {children}
    </MUIBottomNavigation>
  );
};
