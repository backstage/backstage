/*
 * Copyright 2022 The Backstage Authors
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
import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Box, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

type Props = {
  onRefresh: () => void;
};

const InfoCardHeader: FunctionComponent<Props> = (
  props: PropsWithChildren<Props>,
) => {
  const { children, onRefresh } = props;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="h5">Open pull requests</Typography>
        <IconButton color="secondary" onClick={onRefresh}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {children}
    </Box>
  );
};

export default InfoCardHeader;
