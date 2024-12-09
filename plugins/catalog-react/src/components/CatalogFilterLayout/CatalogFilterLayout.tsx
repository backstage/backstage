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

import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme, useTheme } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export const Filters = (props: {
  children: React.ReactNode;
  options?: {
    drawerBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    drawerAnchor?: 'left' | 'right' | 'top' | 'bottom';
  };
}) => {
  const isScreenSmallerThanBreakpoint = useMediaQuery(
    (theme: Theme) =>
      theme.breakpoints.down(props.options?.drawerBreakpoint ?? 'md'),
    { noSsr: true },
  );
  const theme = useTheme();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return isScreenSmallerThanBreakpoint ? (
    <>
      <Button
        style={{ marginTop: theme.spacing(1), marginLeft: theme.spacing(1) }}
        onClick={() => setFilterDrawerOpen(true)}
        startIcon={<FilterListIcon />}
      >
        {t('catalogFilter.buttonTitle')}
      </Button>
      <Drawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        anchor={props.options?.drawerAnchor ?? 'left'}
        disableAutoFocus
        keepMounted
        variant="temporary"
      >
        <Box m={2}>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginBottom: theme.spacing(1) }}
          >
            {t('catalogFilter.title')}
          </Typography>
          {props.children}
        </Box>
      </Drawer>
    </>
  ) : (
    <Grid item lg={2}>
      {props.children}
    </Grid>
  );
};

/** @public */
export const Content = (props: { children: React.ReactNode }) => {
  return (
    <Grid item xs={12} lg={10}>
      {props.children}
    </Grid>
  );
};

/** @public */
export const CatalogFilterLayout = (props: { children: React.ReactNode }) => {
  return (
    <Grid container style={{ position: 'relative' }}>
      {props.children}
    </Grid>
  );
};

CatalogFilterLayout.Filters = Filters;
CatalogFilterLayout.Content = Content;
