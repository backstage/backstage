/*
 * Copyright 2022 The Backstage Authors
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
import { sortBy } from 'lodash';
import React from 'react';

import {
  Checkbox,
  FormControl,
  Input,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { GCalendar } from '../../api';

const useStyles = makeStyles(
  {
    formControl: {
      width: 120,
    },
    selectedCalendars: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  {
    name: 'GCalendarSelect',
  },
);

type CalendarSelectProps = {
  disabled: boolean;
  selectedCalendars?: string[];
  setSelectedCalendars: (value: string[]) => void;
  calendars: GCalendar[];
};

export const CalendarSelect = ({
  disabled,
  selectedCalendars = [],
  setSelectedCalendars,
  calendars,
}: CalendarSelectProps) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="calendars-label"
        disabled={disabled || calendars.length === 0}
        multiple
        value={selectedCalendars}
        onChange={async e => setSelectedCalendars(e.target.value as string[])}
        input={<Input />}
        renderValue={selected => (
          <Typography className={classes.selectedCalendars} variant="body2">
            {calendars
              .filter(c => c.id && (selected as string[]).includes(c.id))
              .map(c => c.summary)
              .join(', ')}
          </Typography>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              width: 350,
            },
          },
        }}
      >
        {sortBy(calendars, 'summary').map(c => (
          <MenuItem key={c.id} value={c.id}>
            <Checkbox checked={selectedCalendars.includes(c.id!)} />
            <ListItemText primary={c.summary} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
