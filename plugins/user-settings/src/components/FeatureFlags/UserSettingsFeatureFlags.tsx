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
  featureFlagsApiRef,
  FeatureFlagState,
  useApi,
} from '@backstage/core-plugin-api';
import { InfoCard } from '@backstage/core-components';
import ClearIcon from '@material-ui/icons/Clear';

export const UserSettingsFeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();

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

  let filteredFeatureFlags = Array.from(featureFlags);

  const filterInputParts = filterInput
    .split(/\s/)
    .map(part => part.trim().toLowerCase());

  filterInputParts.forEach(
    part =>
      (filteredFeatureFlags = filteredFeatureFlags.filter(featureFlag =>
        featureFlag.name.toLowerCase().includes(part),
      )),
  );

  const Header = () => (
    <Grid container style={{ justifyContent: 'space-between' }}>
      <Grid item xs={6} md={8}>
        <Typography variant="h5">Feature Flags</Typography>
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
