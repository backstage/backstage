/*
 * Copyright 2024 The Backstage Authors
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

import { RootConfigService } from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';

const TOKEN_EXP_DEFAULT_S = 3600;
const TOKEN_EXP_MIN_S = 600;
const TOKEN_EXP_MAX_S = 86400;

export function readBackstageTokenExpiration(config: RootConfigService) {
  const processingIntervalKey = 'auth.backstageTokenExpiration';

  if (!config.has(processingIntervalKey)) {
    return TOKEN_EXP_DEFAULT_S;
  }

  const duration = readDurationFromConfig(config, {
    key: processingIntervalKey,
  });

  const durationS = Math.round(durationToMilliseconds(duration) / 1000);

  if (durationS < TOKEN_EXP_MIN_S) {
    return TOKEN_EXP_MIN_S;
  } else if (durationS > TOKEN_EXP_MAX_S) {
    return TOKEN_EXP_MAX_S;
  }
  return durationS;
}
