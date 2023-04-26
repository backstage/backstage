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

import React, { useCallback, useState } from 'react';
import {
  List,
  TextField,
  IconButton,
  Grid,
  Typography,
} from '@material-ui/core';
import { EmptyFlags } from './EmptyFlags';
import { FlagItem } from './FeatureFlagsItem';
import {
  FeatureFlag,
  featureFlagsApiRef,
  FeatureFlagState,
  useApi,
} from '@backstage/core-plugin-api';
import { InfoCard } from '@backstage/core-components';
import ClearIcon from '@material-ui/icons/Clear';

let registered = false;
const f1: FeatureFlag = { name: 'f111', pluginId: 'f111' };
const f2: FeatureFlag = { name: 'f222', pluginId: 'f222' };
const f3: FeatureFlag = { name: 'f333', pluginId: 'f333' };
const f4: FeatureFlag = { name: 'f444', pluginId: 'f444' };
const f5: FeatureFlag = { name: 'f555', pluginId: 'f555' };
/** @public */
export const UserSettingsFeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);

  if (!registered) {
    featureFlagsApi.registerFlag(f1);
    featureFlagsApi.registerFlag(f2);
    featureFlagsApi.registerFlag(f3);
    featureFlagsApi.registerFlag(f4);
    featureFlagsApi.registerFlag(f5);
    registered = true;
  }

  // featureFlagsApi.sortFlags();
  const featureFlags = featureFlagsApi.getSortedFlags();
  const initialFlagState = Object.fromEntries(
    featureFlags.map(({ name }) => [name, featureFlagsApi.isActive(name)]),
  );

  const [state, setState] = useState<Record<string, boolean>>(initialFlagState);
  const [filterInput, setFilterInput] = useState<string>('');
  const inputRef = React.useRef<HTMLElement>();

  const toggleFlag = useCallback(
    (flagName: string) => {
      const newState = featureFlagsApi.isActive(flagName)
        ? FeatureFlagState.None
        : FeatureFlagState.Active;

      featureFlagsApi.save({
        states: { [flagName]: newState },
        merge: true,
      });

      setState(prevState => ({
        ...prevState,
        [flagName]: newState === FeatureFlagState.Active,
      }));
    },
    [featureFlagsApi],
  );

  if (!featureFlags.length) {
    return <EmptyFlags />;
  }

  const clearFilterInput = () => {
    setFilterInput('');
    inputRef?.current?.focus();
  };

  const filteredFeatureFlags = featureFlags.filter(featureFlag => {
    const featureFlagName = featureFlag.name.toLocaleLowerCase('en-US');
    return featureFlagName.includes(filterInput.toLocaleLowerCase('en-US'));
  });

  const Header = () => (
    <Grid container style={{ justifyContent: 'space-between' }}>
      <Grid item xs={6} md={8}>
        <Typography variant="h5">Feature Flags</Typography>
        <Typography variant="subtitle1">
          Please refresh the page when toggling feature flags
        </Typography>
      </Grid>
      {featureFlags.length >= 10 && (
        <Grid item xs={6} md={4}>
          <TextField
            label="Filter"
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            inputRef={ref => ref && ref.focus()}
            InputProps={{
              ...(filterInput.length && {
                endAdornment: (
                  <IconButton
                    aria-label="Clear filter"
                    onClick={clearFilterInput}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                ),
              }),
            }}
            onChange={e => setFilterInput(e.target.value)}
            value={filterInput}
          />
        </Grid>
      )}
    </Grid>
  );

  return (
    <InfoCard title={<Header />}>
      <List dense>
        {filteredFeatureFlags.map(featureFlag => {
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

export default React.memo(UserSettingsFeatureFlags);
