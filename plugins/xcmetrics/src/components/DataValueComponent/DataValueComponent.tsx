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
import { Grid, GridSize, Typography } from '@material-ui/core';
import React from 'react';

interface DataValueProps {
  field: string;
  value?: string | number | null | undefined;
}

export const DataValueComponent = ({ field, value }: DataValueProps) => {
  return (
    <div>
      <Typography variant="caption">{field}</Typography>
      <Typography variant="subtitle1">{value ?? '--'}</Typography>
    </div>
  );
};

interface GridProps {
  xs?: GridSize;
  md?: GridSize;
  lg?: GridSize;
}

export const DataValueGridItem = (props: DataValueProps & GridProps) => (
  <Grid item xs={props.xs ?? 6} md={props.md ?? 6} lg={props.lg ?? 4}>
    <DataValueComponent {...props} />
  </Grid>
);
