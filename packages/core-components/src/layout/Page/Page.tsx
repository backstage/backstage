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

import React from 'react';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import classNames from 'classnames';

export type PageClassKey = 'root';

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'grid',
      gridTemplateAreas:
        "'pageHeader pageHeader pageHeader' 'pageSubheader pageSubheader pageSubheader' 'pageNav pageContent pageSidebar'",
      gridTemplateRows: 'max-content auto 1fr',
      gridTemplateColumns: 'auto 1fr auto',
      overflowY: 'auto',
      height: '100vh',
      [theme.breakpoints.down('xs')]: {
        height: '100%',
      },
      '@media print': {
        display: 'block',
        height: 'auto',
        overflowY: 'inherit',
      },
    },
  }),
  { name: 'BackstagePage' },
);

type Props = {
  themeId: string;
  className?: string;
  children?: React.ReactNode;
};

export function Page(props: Props) {
  const { themeId, className, children } = props;
  const classes = useStyles();
  return (
    <ThemeProvider
      theme={(baseTheme: Theme) => ({
        ...baseTheme,
        page: baseTheme.getPageTheme({ themeId }),
      })}
    >
      <main className={classNames(classes.root, className)}>{children}</main>
    </ThemeProvider>
  );
}
