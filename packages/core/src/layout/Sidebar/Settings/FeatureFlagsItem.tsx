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
  FeatureFlagName,
  useApi,
  featureFlagsApiRef,
} from '@backstage/core-api';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { ToggleButton } from '@material-ui/lab';

export type Item = {
  name: FeatureFlagName;
  pluginId: string;
};

type Props = {
  featureFlag: Item;
};

export const FlagItem = ({ featureFlag }: Props) => {
  const api = useApi(featureFlagsApiRef);

  const [enabled, setEnabled] = React.useState(
    Boolean(api.getFlags().get(featureFlag.name)),
  );

  const toggleFlag = () => {
    const newState = api.getFlags().toggle(featureFlag.name);
    setEnabled(Boolean(newState));
  };

  return (
    <ListItem>
      <ListItemText
        primary={featureFlag.name}
        secondary={`Registered in ${featureFlag.pluginId} plugin`}
      />
      <ListItemSecondaryAction>
        <ToggleButton
          size="small"
          value="flag"
          selected={enabled}
          onChange={toggleFlag}
        >
          <Tooltip placement="top" arrow title={enabled ? 'Disable' : 'Enable'}>
            <CheckIcon />
          </Tooltip>
        </ToggleButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
