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

import { Box, Drawer, Grid, useMediaQuery } from '@material-ui/core';
import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import React from 'react';

export const FilterContainer = ({ children }: React.PropsWithChildren<{}>) => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const { showFiltersDrawer, toggleFiltersDrawer } = useEntityListProvider();

  return isMidSizeScreen ? (
    <Drawer
      data-testid="entity-filters-drawer"
      open={showFiltersDrawer}
      onClose={() => {
        toggleFiltersDrawer(false);
      }}
      PaperProps={{
        style: { width: '300px' },
      }}
      elevation={0}
      anchor="left"
      disableAutoFocus
      keepMounted
      variant="temporary"
    >
      <Box m={2}>{children}</Box>
    </Drawer>
  ) : (
    <Grid data-testid="entity-filters-grid" item lg={2}>
      {children}
    </Grid>
  );
};
