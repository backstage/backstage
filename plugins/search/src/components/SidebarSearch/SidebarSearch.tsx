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
import React, { useCallback } from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { SidebarSearchField } from '@backstage/core';

export const SidebarSearch = () => {
  const navigate = useNavigate();
  const handleSearch = useCallback(
    (query: string): void => {
      const queryString = qs.stringify({ query }, { addQueryPrefix: true });

      // TODO: Here the url to the search plugin is hardcoded. We need a way to query the route in the future.
      // Maybe an API that I can just call from other places?
      navigate(`/search${queryString}`);
    },
    [navigate],
  );

  return <SidebarSearchField onSearch={handleSearch} to="/search" />;
};
