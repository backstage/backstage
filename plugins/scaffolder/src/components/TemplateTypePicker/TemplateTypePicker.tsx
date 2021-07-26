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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import capitalize from 'lodash/capitalize';
import { Progress } from '@backstage/core-components';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles<Theme>(theme => ({
  checkbox: {
    padding: theme.spacing(1, 1, 1, 2),
  },
}));

export const TemplateTypePicker = () => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const {
    error,
    loading,
    availableTypes,
    selectedTypes,
    setSelectedTypes,
  } = useEntityTypeFilter();

  if (loading) return <Progress />;

  if (!availableTypes) return null;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types`,
      severity: 'error',
    });
    return null;
  }

  function toggleSelection(type: string) {
    setSelectedTypes(
      selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type],
    );
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Categories</Typography>
      <FormGroup>
        {availableTypes.map(type => (
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={() => toggleSelection(type)}
                className={classes.checkbox}
              />
            }
            label={capitalize(type)}
            key={type}
          />
        ))}
      </FormGroup>
    </Box>
  );
};
