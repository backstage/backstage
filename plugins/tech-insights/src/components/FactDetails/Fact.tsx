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

import * as React from 'react';
import { FC } from 'react';
import {
  List,
  Box,
  Typography,
  CircularProgress,
  CircularProgressProps,
} from '@material-ui/core';

function CircularProgressWithLabel(
  props: CircularProgressProps & {
    value: number;
    denominator: number;
    numerator: number;
  },
) {
  const { value, denominator, numerator } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={70} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="subtitle1">{`${Math.round(value)}%`}</Typography>

        <Typography variant="caption">
          {`${numerator}/${denominator}`}
        </Typography>
      </Box>
    </Box>
  );
}

interface Props {
  numerator: number;
  denominator: number;
  title: string;
}

const Fact: FC<Props> = ({ numerator, denominator, title }: Props) => (
  <List>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%',
      }}
    >
      <Typography>{title}</Typography>
      <CircularProgressWithLabel
        value={(numerator / denominator) * 100}
        numerator={numerator}
        denominator={denominator}
      />
    </Box>
  </List>
);

export default Fact;
