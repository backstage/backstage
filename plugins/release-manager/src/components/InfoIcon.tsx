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
import React, { FC } from 'react';
import { Tooltip, useTheme, TooltipProps } from '@material-ui/core';
import MInfoIcon from '@material-ui/icons/InfoOutlined';

type Props = { title: TooltipProps['title'] };

export const InfoIcon: FC<Props> = ({ title }) => {
  const theme = useTheme();

  return (
    <Tooltip title={title}>
      <MInfoIcon
        style={{
          color: theme.palette.info.main,
          position: 'relative',
          height: 20,
          width: 20,
          marginRight: theme.spacing(1),
          marginLeft: 'auto',
        }}
      />
    </Tooltip>
  );
};
