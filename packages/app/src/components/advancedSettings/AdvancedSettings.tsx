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
import { InfoCard } from '@backstage/core-components';
import {
  List,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core';
import useLocalStorage from 'react-use/lib/useLocalStorage';

export function AdvancedSettings() {
  const [value, setValue] = useLocalStorage<'on' | 'off'>(
    'advanced-option',
    'off',
  );

  const toggleValue = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setValue(ev.currentTarget.checked ? 'on' : 'off');
  };

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} md={6}>
        <InfoCard title="Advanced settings" variant="gridItem">
          <List>
            <ListItem>
              <ListItemText
                primary="Advanced user option"
                secondary="An extra settings tab to further customize the experience"
              />
              <ListItemSecondaryAction>
                <Switch
                  color="primary"
                  value={value}
                  onChange={toggleValue}
                  name="advanced"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </InfoCard>
      </Grid>
    </Grid>
  );
}
