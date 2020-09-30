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
import { Box, Typography } from '@material-ui/core';
import TooltipItem, { TooltipItemProps } from './TooltipItem';
import { useTooltipStyles } from '../../utils/styles';

export type TooltipProps = {
  label?: string;
  items?: Array<TooltipItemProps>;
};

const Tooltip = ({ label, items }: TooltipProps) => {
  const classes = useTooltipStyles();
  return (
    <Box
      className={`tooltip-content ${classes.tooltip}`}
      display="flex"
      flexDirection="column"
      minWidth={250}
    >
      {label && (
        <Typography display="block" gutterBottom>
          <b>{label}</b>
        </Typography>
      )}
      {items &&
        items.map((item, index) => (
          <TooltipItem
            key={`${item.label}-${index}`}
            fill={item.fill}
            label={item.label}
            value={item.value}
          />
        ))}
    </Box>
  );
};

export default Tooltip;
