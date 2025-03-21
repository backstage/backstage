/*
 * Copyright 2020 The Backstage Authors
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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import { FeatureFlag } from '@backstage/core-plugin-api';

type Props = {
  flag: FeatureFlag;
  enabled: boolean;
  toggleHandler: Function;
};

const getSecondaryText = (flag: FeatureFlag) => {
  if (flag.description) {
    return flag.description;
  }
  return flag.pluginId
    ? `Registered in ${flag.pluginId} plugin`
    : 'Registered in the application';
};

export const FlagItem = ({ flag, enabled, toggleHandler }: Props) => (
  <ListItem divider button onClick={() => toggleHandler(flag.name)}>
    <ListItemIcon>
      <Tooltip placement="top" arrow title={enabled ? 'Disable' : 'Enable'}>
        <Switch color="primary" checked={enabled} name={flag.name} />
      </Tooltip>
    </ListItemIcon>
    <ListItemText primary={flag.name} secondary={getSecondaryText(flag)} />
  </ListItem>
);
