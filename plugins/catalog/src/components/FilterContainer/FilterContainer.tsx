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

import { Box, Drawer, Grid } from '@material-ui/core';
import React from 'react';

interface IProps {
  showFilter: boolean;
  toggleFilter: (showFilter: boolean) => void;
  isMidSizeScreen: boolean;
}

export const FilterContainer = ({
  children,
  showFilter,
  toggleFilter,
  isMidSizeScreen,
}: React.PropsWithChildren<IProps>) =>
  isMidSizeScreen ? (
    <Drawer
      open={showFilter}
      onClose={() => {
        toggleFilter(false);
      }}
      elevation={0}
      disableAutoFocus
      PaperProps={{
        style: { position: 'absolute', width: '250px' },
      }}
      BackdropProps={{ style: { position: 'absolute' } }}
      ModalProps={{
        container: document.getElementById('drawer-container'),
        disableEnforceFocus: true,
        style: { position: 'absolute' },
      }}
      variant="temporary"
    >
      <Box m={1}>{children}</Box>
    </Drawer>
  ) : (
    <Grid item lg={2}>
      {children}
    </Grid>
  );
