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
import React from 'react';

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Tooltip,
} from '@material-ui/core';

import { use24HourTimeState } from './userSettingsDateTimeState';

export function UserSettingsHourCycleSwitch() {
  const [is24HourTime, select24HourTime] = use24HourTimeState();

  return (
    <ListItem>
      <ListItemText
        primary="24-Hour Time"
        secondary="Display time in 24-Hour format"
      />
      <ListItemSecondaryAction>
        <Tooltip
          placement="top"
          arrow
          title={`Switch to ${is24HourTime ? '12' : '24'}-Hour`}
        >
          <Switch
            color="primary"
            checked={is24HourTime}
            onChange={() => select24HourTime(!is24HourTime)}
            name="24hour"
            inputProps={{ 'aria-label': '24-Hour Time Switch' }}
          />
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
