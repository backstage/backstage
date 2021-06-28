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

import React from 'react';
import {
  Typography,
  List,
  ListItem,
  makeStyles,
  Theme,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles<Theme>(theme => ({
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

export const TemplateTypePicker = () => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  // TODO(timbonicus): Use new setTypes returned from the hook
  const { error, types, selectedType } = useEntityTypeFilter();

  if (!types) return null;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types`,
      severity: 'error',
    });
    return null;
  }

  return (
    <>
      <Typography variant="button">Categories</Typography>
      <List disablePadding dense>
        {types.map(type => {
          const labelId = `checkbox-list-label-${type}`;
          return (
            <ListItem
              key={type}
              dense
              button
              onClick={() => {}}
              // TODO(timbonicus): Update to use setTypes
              // setSelectedCategories(
              //   selectedCategories.includes(type)
              //     ? selectedCategories.filter(
              //         selectedCategory => selectedCategory !== type,
              //       )
              //     : [...selectedCategories, type],
              // )
              // }
            >
              <Checkbox
                edge="start"
                color="primary"
                // TODO: Fix me
                // checked={selectedTypes.includes(type)}
                checked={type === selectedType}
                tabIndex={-1}
                disableRipple
                className={classes.checkbox}
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText
                id={labelId}
                primary={
                  type.charAt(0).toLocaleUpperCase('en-US') + type.slice(1)
                }
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
