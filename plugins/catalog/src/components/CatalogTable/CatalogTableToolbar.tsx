/*
 * Copyright 2024 The Backstage Authors
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
import {
  EntitySearchBar,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

/** @public */
export type CatalogTableToolbarClassKey = 'root' | 'text';

const useToolbarStyles = makeStyles(
  theme => ({
    root: {
      paddingTop: theme.spacing(1.25),
      paddingLeft: theme.spacing(2.5),
      paddingBottom: theme.spacing(0.75),
      display: 'flex',
      justifyContent: 'space-between',
    },
    text: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
  { name: 'PluginCatalogTableToolbar' },
);

export function CatalogTableToolbar() {
  const styles = useToolbarStyles();

  const { filters, totalItems } = useEntityList();

  const currentKind = filters.kind?.label || '';
  const currentType = filters.type?.value || '';
  const currentCount = typeof totalItems === 'number' ? `(${totalItems})` : '';
  const titlePreamble = capitalize(filters.user?.value ?? 'all');
  const title = [
    titlePreamble,
    currentType,
    pluralize(currentKind),
    currentCount,
  ]
    .filter(s => s)
    .join(' ');

  return (
    <Toolbar className={styles.root}>
      <Typography variant="h5" className={styles.text}>
        {title}
      </Typography>
      <EntitySearchBar />
    </Toolbar>
  );
}
