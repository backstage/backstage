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
import { DependencyGraphTypes } from '@backstage/core-components';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { EntityEdgeData } from './types';
import classNames from 'classnames';

/** @public */
export type CustomLabelClassKey = 'text' | 'secondary';

const useStyles = makeStyles(
  theme => ({
    text: {
      fill: theme.palette.textContrast,
    },
    secondary: {
      fill: theme.palette.textSubtle,
    },
  }),
  { name: 'PluginCatalogGraphCustomLabel' },
);

export function DefaultRenderLabel({
  edge: { relations },
}: DependencyGraphTypes.RenderLabelProps<EntityEdgeData>) {
  const classes = useStyles();
  return (
    <text className={classes.text} textAnchor="middle">
      {relations.map((r, i) => (
        <tspan key={r} className={classNames(i % 2 !== 0 && classes.secondary)}>
          {i > 0 && <tspan> / </tspan>}
          {r}
        </tspan>
      ))}
    </text>
  );
}
