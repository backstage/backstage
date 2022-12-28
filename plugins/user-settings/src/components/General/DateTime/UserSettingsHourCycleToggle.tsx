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
import { Tooltip } from '@material-ui/core';
import {
  HourCycle,
  hourCycleConfigs,
  useHourCycleState,
} from './userSettingsDateTimeState';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { UserSettingItem } from '../Common/UserSettingItem';

export function UserSettingsHourCycleToggle() {
  const { hourCycle: selectedHourCycle, setHourCycle } = useHourCycleState();
  const hourCycleOptions = [...Object.values(HourCycle), undefined];
  const date = new Date();

  return (
    <UserSettingItem
      primaryText="Hour Format"
      secondaryText="Change hour format"
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={selectedHourCycle}
        onChange={(_, value) => setHourCycle(value)}
      >
        {hourCycleOptions.map(hourCycle => {
          const display = hourCycle
            ? hourCycleConfigs[hourCycle].title
            : 'Auto';

          const title = date.toLocaleTimeString(window.navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle,
          });

          return (
            <Tooltip placement="top" arrow title={title}>
              <ToggleButton
                key={hourCycle}
                value={hourCycle}
                selected={selectedHourCycle === hourCycle}
              >
                {display}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    </UserSettingItem>
  );
}
