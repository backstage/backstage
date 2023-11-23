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
import { makeStyles, Theme as Mui4Theme } from '@material-ui/core/styles';
import { Theme as Mui5Theme } from '@mui/material/styles';
import { UnifiedThemeHolder, UnifiedThemeProvider } from '@backstage/theme';

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
  children?: React.ReactNode;
};

export function Page(props: Props) {
  const { themeId, children } = props;
  const classes = useStyles();
  return (
    <UnifiedThemeProvider
      theme={theme => {
        const v4Theme = theme.getTheme('v4') as Mui4Theme | undefined;
        const v5Theme = theme.getTheme('v5') as Mui5Theme | undefined;

        const newV4Theme = v4Theme
          ? {
              ...v4Theme,
              page: v4Theme.getPageTheme({ themeId }),
            }
          : undefined;

        const newV5Theme = v5Theme
          ? {
              ...v5Theme,
              page: v5Theme.getPageTheme({ themeId }),
            }
          : undefined;

        return new UnifiedThemeHolder(newV4Theme, newV5Theme);
      }}
    >
      <main className={classes.root}>{children}</main>
    </UnifiedThemeProvider>
  );
}
