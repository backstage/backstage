/*
 * Copyright 2021 Spotify AB
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

import React, { useMemo } from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import {
  EntityTagFilter,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';

const useStyles = makeStyles<Theme>(theme => ({
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

export const EntityTagPicker = () => {
  const classes = useStyles();
  const { updateFilters, backendEntities, filters } = useEntityListProvider();
  const availableTags = useMemo(
    () => [
      ...new Set(
        backendEntities
          .flatMap((e: Entity) => e.metadata.tags)
          .filter(Boolean) as string[],
      ),
    ],
    [backendEntities],
  );

  if (!availableTags.length) return null;

  const onClick = (tag: string) => {
    const tags = filters.tags?.values ?? [];
    const newTags = tags.includes(tag)
      ? [...tags.filter((t: string) => t !== tag)]
      : [...tags, tag];
    updateFilters({
      tags: newTags.length ? new EntityTagFilter(newTags) : undefined,
    });
  };

  return (
    <>
      <Typography variant="subtitle2" className={classes.title}>
        Tags
      </Typography>
      <List disablePadding dense>
        {availableTags.map(tag => {
          const labelId = `checkbox-list-label-${tag}`;
          return (
            <ListItem key={tag} dense button onClick={() => onClick(tag)}>
              <Checkbox
                edge="start"
                color="primary"
                checked={(filters.tags?.values ?? []).includes(tag)}
                tabIndex={-1}
                disableRipple
                className={classes.checkbox}
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText id={labelId} primary={tag} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
