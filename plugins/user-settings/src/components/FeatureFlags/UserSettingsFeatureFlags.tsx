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

import { useRef, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { EmptyFlags } from './EmptyFlags';
import { FlagItem } from './FeatureFlagsItem';
import {
  FeatureFlag,
  FeatureFlagsApi,
  featureFlagsApiRef,
  FeatureFlagState,
  useApi,
} from '@backstage/core-plugin-api';
import {
  InfoCard,
  Input,
  ShadcnButton as Button,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

export const sortFlags = (
  flags: FeatureFlag[],
  featureFlagsApi: FeatureFlagsApi,
): FeatureFlag[] => {
  const activeFlags = flags.filter(flag => featureFlagsApi.isActive(flag.name));
  const idleFlags = flags.filter(flag => !featureFlagsApi.isActive(flag.name));
  return [...activeFlags, ...idleFlags];
};

/** @public */
export const UserSettingsFeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialFeatureFlags = featureFlagsApi.getRegisteredFlags();
  const initialFeatureFlagsSorted = sortFlags(
    initialFeatureFlags,
    featureFlagsApi,
  );
  const [featureFlags] = useState(initialFeatureFlagsSorted);

  const initialFlagState = Object.fromEntries(
    featureFlags.map(({ name }) => [name, featureFlagsApi.isActive(name)]),
  );

  const [state, setState] = useState<Record<string, boolean>>(initialFlagState);
  const [filterInput, setFilterInput] = useState<string>('');
  const { t } = useTranslationRef(userSettingsTranslationRef);

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex-1">
        <h5 className="text-lg font-semibold tracking-tight text-foreground">
          {t('featureFlags.title')}
        </h5>
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to semantic HTML */}
        <p className="text-sm text-muted-foreground">
          {t('featureFlags.description')}
        </p>
      </div>
      {featureFlags.length >= 10 && (
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder={t('featureFlags.filterTitle')}
            ref={inputRef}
            value={filterInput}
            onChange={e => setFilterInput(e.target.value)}
            className="pr-9"
          />
          {filterInput.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              aria-label={t('featureFlags.clearFilter')}
              onClick={clearFilterInput}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <InfoCard title={<Header />}>
      <ul className="divide-y divide-border">
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
      </ul>
    </InfoCard>
  );
};
