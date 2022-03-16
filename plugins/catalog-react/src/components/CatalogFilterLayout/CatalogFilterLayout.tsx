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
import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { BackstageTheme } from '@backstage/theme';

/** @public */
export const Filters = (props: { children: React.ReactNode }) => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme<BackstageTheme>();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  return isMidSizeScreen ? (
    <>
      <Button
        style={{ marginTop: theme.spacing(1), marginLeft: theme.spacing(1) }}
        onClick={() => setFilterDrawerOpen(true)}
        startIcon={<FilterListIcon />}
      >
        Filters
      </Button>
      <Drawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        anchor="left"
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
            Filters
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
