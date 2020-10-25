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
import {
  makeStyles,
  Typography,
  Divider,
  Card,
  CardHeader,
  Button,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles({
  filters: {
    background: 'transparent',
    boxShadow: '0px 0px 0px 0px',
  },
  dropdown: {
    width: '100%',
  },
});

type FiltersProps = {
  filters: any;
  updateSelectedFilters: (filter: string | Array<null>) => void;
};

export const Filters = ({ filters, updateSelectedFilters }: FiltersProps) => {
  const classes = useStyles();

  const filter1 = ['All', 'API', 'Component', 'Location', 'Template'];
  const filter2 = ['deprecated', 'recommended', 'experimental', 'production'];

  return (
    <Card className={classes.filters}>
      <CardHeader
        title={<Typography variant="h6">Filters</Typography>}
        action={
          <Button color="primary" onClick={() => updateSelectedFilters([])}>
            CLEAR ALL
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <Typography variant="subtitle2">Kind</Typography>
        <TextField
          id="outlined-select-entity-kind"
          select
          onChange={e =>
            updateSelectedFilters(
              filters.includes(e?.target?.value)
                ? filters.filter(f => f !== e?.target?.value)
                : e?.target?.value,
            )
          }
          variant="outlined"
          className={classes.dropdown}
        >
          {filter1.map(filter => (
            <MenuItem key={filter} value={filter}>
              {filter}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
      <CardContent>
        <Typography variant="subtitle2">Lifecycle</Typography>
        {filter2.map(filter => (
          <FormControlLabel
            key={filter}
            control={
              <Checkbox
                color="primary"
                checked={filters.includes(filter)}
                tabIndex={-1}
                value={filter}
                name={filter}
                onClick={() =>
                  updateSelectedFilters(
                    filters.includes(filter)
                      ? filters.filter(f => f !== filter)
                      : filter,
                  )
                }
              />
            }
            label={filter}
          />
        ))}
      </CardContent>
    </Card>
  );
};
