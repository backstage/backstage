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

import { useRef, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import {
  FeatureFlag,
  featureFlagsApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ErrorPanel, InfoCard, Progress } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

import { EmptyFlags } from './EmptyFlags';
import { FlagItem } from './FeatureFlagsItem';
import { userSettingsTranslationRef } from '../../translation';

/** @public */
export const UserSettingsFeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);

  // This outer component (asynchronously) fetches the current state of all
  // flags, to have them initially ordered as active first, before rendering the
  // inner component.

  const {
    value: initiallyEnabledFlags,
    loading,
    error,
  } = useAsync(async () => {
    const featureFlags = featureFlagsApi.getRegisteredFlags();
    const flags = await Promise.all(
      featureFlags.map(async flag => ({
        name: flag.name,
        initialValue: await featureFlagsApi.getFlag(flag.name),
      })),
    );
    return flags.filter(flag => flag.initialValue).map(flag => flag.name);
  }, []);

  if (error) {
    return <ErrorPanel defaultExpanded error={error} />;
  } else if (loading || initiallyEnabledFlags === undefined) {
    return <Progress />;
  }

  return (
    <UserSettingsFeatureFlagsInner
      initiallyEnabledFlags={initiallyEnabledFlags}
    />
  );
};

const alphaNumSortFlags = (flags: FeatureFlag[]): FeatureFlag[] => {
  return flags.sort((a, b) => a.name.localeCompare(b.name));
};

const sortFlags = (flags: FeatureFlag[], enabled: string[]): FeatureFlag[] => {
  const activeFlags = flags.filter(flag => enabled.includes(flag.name));
  const idleFlags = flags.filter(flag => !enabled.includes(flag.name));
  return [...alphaNumSortFlags(activeFlags), ...alphaNumSortFlags(idleFlags)];
};

function UserSettingsFeatureFlagsInner({
  initiallyEnabledFlags,
}: {
  initiallyEnabledFlags: string[];
}) {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const inputRef = useRef<HTMLElement>();

  const initialFeatureFlags = featureFlagsApi.getRegisteredFlags();
  const initialFeatureFlagsSorted = sortFlags(
    initialFeatureFlags,
    initiallyEnabledFlags,
  );
  const [featureFlags] = useState(initialFeatureFlagsSorted);

  const [filterInput, setFilterInput] = useState<string>('');
  const { t } = useTranslationRef(userSettingsTranslationRef);

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
        <Typography variant="h5">{t('featureFlags.title')}</Typography>
        <Typography variant="subtitle1">
          {t('featureFlags.description')}
        </Typography>
      </Grid>
      {featureFlags.length >= 10 && (
        <Grid item xs={6} md={4}>
          <TextField
            label={t('featureFlags.filterTitle')}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            inputRef={ref => ref && ref.focus()}
            InputProps={{
              ...(filterInput.length && {
                endAdornment: (
                  <IconButton
                    aria-label={t('featureFlags.clearFilter')}
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
        {filteredFeatureFlags.map(featureFlag => (
          <FlagItem
            key={featureFlag.name}
            flag={featureFlag}
            initiallyEnabled={initiallyEnabledFlags.includes(featureFlag.name)}
          />
        ))}
      </List>
    </InfoCard>
  );
}
