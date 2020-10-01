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
import React from 'react';
import { Box } from '@material-ui/core';

type CostOverviewFooterProps = {
  children?: React.ReactNode;
};

const CostOverviewFooter = ({ children }: CostOverviewFooterProps) => (
  <Box
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
  >
    {React.Children.map(children, child => (
      <Box marginY={1}>{child}</Box>
    ))}
  </Box>
);

export default CostOverviewFooter;
