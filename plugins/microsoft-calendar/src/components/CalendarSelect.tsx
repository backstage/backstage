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

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { MicrosoftCalendar } from '../api';

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
    name: 'MicrosoftCalendarSelect',
  },
);

type CalendarSelectProps = {
  disabled: boolean;
  selectedCalendarId?: string;
  setSelectedCalendarId: (value: string) => void;
  calendars: MicrosoftCalendar[];
};

export const CalendarSelect = ({
  disabled,
  selectedCalendarId,
  setSelectedCalendarId,
  calendars,
}: CalendarSelectProps) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="calendars-label"
        disabled={disabled || calendars.length === 0}
        value={selectedCalendarId || ''}
        onChange={async e => setSelectedCalendarId(e.target.value as string)}
        input={<Input />}
        renderValue={selected => {
          return (
            <Typography className={classes.selectedCalendars} variant="body2">
              {calendars.find(c => c.id === selected)?.name}
            </Typography>
          );
        }}
        MenuProps={{
          PaperProps: {
            style: {
              width: 350,
            },
          },
        }}
      >
        {sortBy(calendars, 'name').map(c => (
          <MenuItem key={c.id} value={c.id}>
            <Checkbox checked={c.id === selectedCalendarId} />
            <ListItemText primary={c.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
