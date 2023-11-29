/*
 * Copyright 2023 The Backstage Authors
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
import React, { FC } from 'react';

import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const RadarTooltip: FC<RadarTooltipProps> = ({ title, children }) => {
  const StyledTooltip = withStyles(() => ({
    tooltipPlacementTop: {
      margin: '5px 0',
    },
  }))(Tooltip);

  return <StyledTooltip arrow interactive title={title} children={children} placement="top" />;
};

interface RadarTooltipProps {
  title: string;
  children: React.ReactElement<any, any>;
}

export default RadarTooltip;
