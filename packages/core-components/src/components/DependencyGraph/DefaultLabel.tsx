/*
 * Copyright 2020 The Backstage Authors
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
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DependencyGraphTypes as Types } from './types';

/** @public */
export type DependencyGraphDefaultLabelClassKey = 'text';

const useStyles = makeStyles(
  theme => ({
    text: {
      fill: theme.palette.textContrast,
    },
  }),
  { name: 'BackstageDependencyGraphDefaultLabel' },
);

/** @public */
export function DefaultLabel({ edge: { label } }: Types.RenderLabelProps) {
  const classes = useStyles();
  return (
    <text className={classes.text} textAnchor="middle">
      {label}
    </text>
  );
}
