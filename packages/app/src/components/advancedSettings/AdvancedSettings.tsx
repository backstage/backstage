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

import { ChangeEvent } from 'react';
import { InfoCard } from '@backstage/core-components';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import useLocalStorage from 'react-use/esm/useLocalStorage';

export function AdvancedSettings() {
  const [value, setValue] = useLocalStorage<'on' | 'off'>(
    'advanced-option',
    'off',
  );

  const toggleValue = (ev: ChangeEvent<HTMLInputElement>) => {
    setValue(ev.currentTarget.checked ? 'on' : 'off');
  };

  return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} md={6}>
        <InfoCard title="Advanced settings" variant="gridItem">
          <List>
            <ListItem
              divider
              button
              onClick={() => setValue(value === 'on' ? 'off' : 'on')}
            >
              <ListItemText
                primary="Advanced user option"
                secondary="An extra settings tab to further customize the experience"
              />
              <ListItemSecondaryAction>
                <Tooltip
                  placement="top"
                  arrow
                  title={value === 'on' ? 'Disable' : 'Enable'}
                >
                  <Switch
                    color="primary"
                    checked={value === 'on'}
                    onChange={toggleValue}
                    name="advanced"
                  />
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </InfoCard>
      </Grid>
    </Grid>
  );
}
