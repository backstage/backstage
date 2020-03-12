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

import React, { FC } from 'react';
import { PageTheme, pageTheme } from './PageThemeProvider';
import { makeStyles } from '@material-ui/core';

export const Theme = React.createContext<PageTheme>(pageTheme.service);

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateAreas:
      "'pageHeader pageHeader pageHeader' 'pageSubheader pageSubheader pageSubheader' 'pageNav pageContent pageSidebar'",
    gridTemplateRows: 'auto auto 1fr',
    gridTemplateColumns: 'auto 1fr auto',
    minHeight: '100%',
  },
}));

type Props = {
  theme?: PageTheme;
};

const Page: FC<Props> = ({ theme = pageTheme.home, children }) => {
  const classes = useStyles();
  return (
    <Theme.Provider value={theme}>
      <div className={classes.root}>{children}</div>
    </Theme.Provider>
  );
};

export default Page;
