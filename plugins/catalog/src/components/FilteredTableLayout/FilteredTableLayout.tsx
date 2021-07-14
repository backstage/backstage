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

import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import { Box, Button, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { Fragment } from 'react';

interface IProps {}

export const FilteredTableLayout = ({
  children,
}: React.PropsWithChildren<IProps>) => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const { showFiltersDrawer, toggleFiltersDrawer } = useEntityListProvider();
  const theme = useTheme<BackstageTheme>();

  return (
    <Fragment>
      {isMidSizeScreen && (
        <Button
          style={{ paddingLeft: 0, marginBottom: theme.spacing(1) }}
          onClick={() => toggleFiltersDrawer(!showFiltersDrawer)}
        >
          <Box display="flex" alignItems="center">
            <FilterListIcon style={{ marginRight: theme.spacing(1) }} />
            Filters
          </Box>
        </Button>
      )}
      <Grid container style={{ position: 'relative' }}>
        {children}
      </Grid>
    </Fragment>
  );
};
