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

import { ContentHeader, ContentHeaderTitle } from '@backstage/core-components';
import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import { Box, IconButton, useMediaQuery } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import React from 'react';

const CatalogPageHeaderAction = () => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const { showFiltersDrawer, toggleFiltersDrawer } = useEntityListProvider();

  return isMidSizeScreen ? (
    <Box display="flex" alignItems="center">
      <ContentHeaderTitle title="Components" />
      <IconButton onClick={() => toggleFiltersDrawer(!showFiltersDrawer)}>
        <FilterListIcon />
      </IconButton>
    </Box>
  ) : (
    <ContentHeaderTitle title="Components" />
  );
};

export const CatalogPageHeader = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return (
    <ContentHeader titleComponent={() => <CatalogPageHeaderAction />}>
      {children}
    </ContentHeader>
  );
};
