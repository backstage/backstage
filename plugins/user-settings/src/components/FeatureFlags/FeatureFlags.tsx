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

import React, { useCallback, useState } from 'react';
import {
  FeatureFlagName,
  featureFlagsApiRef,
  FeatureFlagsRegistryItem,
  FeatureFlagState,
  InfoCard,
  useApi,
} from '@backstage/core';
import { List } from '@material-ui/core';
import { EmptyFlags } from './EmptyFlags';
import { FlagItem } from './FeatureFlagsItem';

export const FeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();
  const initialFlagState = featureFlags.reduce(
    (result, featureFlag: FeatureFlagsRegistryItem) => {
      const state = featureFlagsApi.getFlags().get(featureFlag.name);

      result[featureFlag.name] = state;
      return result;
    },
    {} as Record<FeatureFlagName, FeatureFlagState>,
  );

  const [state, setState] = useState<Record<FeatureFlagName, FeatureFlagState>>(
    initialFlagState,
  );

  const toggleFlag = useCallback(
    (flagName: FeatureFlagName) => {
      const newState = featureFlagsApi.getFlags().toggle(flagName);

      setState(prevState => ({
        ...prevState,
        [flagName]: newState,
      }));
      featureFlagsApi.getFlags().save();
    },
    [featureFlagsApi],
  );

  if (!featureFlags.length) {
    return <EmptyFlags />;
  }

  return (
    <InfoCard title="Feature Flags">
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
    </InfoCard>
  );
};
