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

import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { FeatureFlagState, featureFlagsApiRef, useApi } from '@backstage/core';

const ToggleFeatureFlagButton: FC<{}> = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const flags = featureFlagsApi.getFlags();
  const flagState = flags.get('enable-welcome-box');

  const handleClick = () => {
    const newValue = flagState
      ? FeatureFlagState.NotEnabled
      : FeatureFlagState.Enabled;
    flags.set('enable-welcome-box', newValue);
    window.location.reload();
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleClick}
      data-testid="button-switch-feature-flag-state"
    >
      {flagState === FeatureFlagState.NotEnabled
        ? 'Disable "enable-welcome-box" feature flag'
        : 'Enable "enable-welcome-box" feature flag'}
    </Button>
  );
};

export default ToggleFeatureFlagButton;
