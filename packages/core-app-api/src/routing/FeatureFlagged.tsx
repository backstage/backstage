/*
 * Copyright 2021 Spotify AB
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

import {
  featureFlagsApiRef,
  useApi,
  attachComponentData,
} from '@backstage/core-plugin-api';

export type FeatureFlaggedProps = {
  flag: string;
  children: JSX.Element | null;
};

export const FeatureFlagged = ({ children, flag }: FeatureFlaggedProps) => {
  const featureFlagApi = useApi(featureFlagsApiRef);
  const isEnabled = featureFlagApi.isActive(flag);
  return isEnabled ? children : null;
};

attachComponentData(FeatureFlagged, 'core.featureFlagged', true);
