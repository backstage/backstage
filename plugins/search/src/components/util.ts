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
import qs from 'qs';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { rootRouteRef } from '../plugin';

import { useRouteRef } from '@backstage/core-plugin-api';

export const useNavigateToQuery = () => {
  const searchRoute = useRouteRef(rootRouteRef);
  const navigate = useNavigate();
  return useCallback(
    ({ query }: { query: string }): void => {
      const queryString = qs.stringify({ query }, { addQueryPrefix: true });

      navigate(`${searchRoute()}${queryString}`);
    },
    [navigate, searchRoute],
  );
};

export const isOpenNewTabOrWindow = (
  event: React.MouseEvent | React.KeyboardEvent,
): boolean =>
  // open new tab (linux or windows)
  event.ctrlKey === true ||
  // open new wab (macos)
  event.metaKey === true ||
  // open new window
  event.shiftKey === true ||
  // open new tab (middle/wheel click)
  ('button' in event ? event.button === 1 : false);
