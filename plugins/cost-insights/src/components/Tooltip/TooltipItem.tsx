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
import LensIcon from '@material-ui/icons/Lens';
import { useTooltipStyles as useStyles } from '../../utils/styles';

export type TooltipItemProps = {
  value: string;
  label: string;
  fill: string;
};

const TooltipItem = ({ fill, label, value }: TooltipItemProps) => {
  const classes = useStyles();
  const style = { fill: fill };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      minHeight={25}
    >
      <Box display="flex" alignContent="center" marginRight=".5em">
        <Box display="flex" alignItems="center" marginRight=".5em">
          <LensIcon className={classes.lensIcon} style={style} />
        </Box>
        <Typography>{label}</Typography>
      </Box>
      <Typography display="block">{value}</Typography>
    </Box>
  );
};

export default TooltipItem;
