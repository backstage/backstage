/*
 * Copyright 2021 The Backstage Authors
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
  alertApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { getTimeBasedGreeting } from './timeUtil';

export const WelcomeTitle = () => {
  const identityApi = useApi(identityApiRef);
  const alertApi = useApi(alertApiRef);
  const greeting = useMemo(() => getTimeBasedGreeting(), []);

  const { value: profile, error } = useAsync(() =>
    identityApi.getProfileInfo(),
  );

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load user identity: ${error}`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  return (
    <Tooltip title={greeting.language}>
      <Typography component="span">{`${greeting.greeting}${
        profile?.displayName ? `, ${profile?.displayName}` : ''
      }!`}</Typography>
    </Tooltip>
  );
};
