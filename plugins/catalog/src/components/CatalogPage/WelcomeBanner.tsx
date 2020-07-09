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

import { DismissableBanner } from '@backstage/core';
import { Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'table'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  emoji: {
    fontSize: '125%',
    marginRight: theme.spacing(2),
  },
}));

export const WelcomeBanner = () => {
  const classes = useStyles();
  return (
    <DismissableBanner
      variant="info"
      message={
        <Typography>
          <span role="img" aria-label="tada" className={classes.emoji}>
            🎉
          </span>
          Welcome to Backstage! Take a look around and check out our{' '}
          <Link href="/welcome" color="textSecondary">
            getting started
          </Link>{' '}
          page.
        </Typography>
      }
      id="catalog_page_welcome_banner"
    />
  );
};
