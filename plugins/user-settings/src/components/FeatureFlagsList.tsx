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

import React, { useState, useEffect } from 'react';
import { List } from '@material-ui/core';
import {
  useApi,
  featureFlagsApiRef,
  FeatureFlagName,
  FeatureFlagState,
  FeatureFlagsRegistryItem,
} from '@backstage/core';
import { FlagItem } from './FeatureFlagsItem';

type Props = {
  featureFlags: FeatureFlagsRegistryItem[];
};

export const FeatureFlagsList = ({ featureFlags }: Props) => {
  const featureFlagApi = useApi(featureFlagsApiRef);
  const [state, setState] = useState<Record<FeatureFlagName, FeatureFlagState>>(
    {},
  );

  useEffect(() => {
    featureFlags.map(featureFlag => {
      setState({
        [featureFlag.name]: featureFlagApi.getFlags().get(featureFlag.name),
      });
    });
  }, [featureFlagApi, featureFlags]);

  const toggleFlag = (flagName: FeatureFlagName) => {
    const newState = featureFlagApi.getFlags().toggle(flagName);

    setState(prevState => ({
      ...prevState,
      [flagName]: newState,
    }));
    featureFlagApi.getFlags().save();
  };

  return (
    <List dense>
      {featureFlags.map(featureFlag => {
        const enabled = Boolean(state[featureFlag.name]);

        return (
          <FlagItem
            key={featureFlag.name}
            flag={featureFlag}
            enabled={enabled}
            toggleHandler={toggleFlag}
          />
        );
      })}
    </List>
  );
};
