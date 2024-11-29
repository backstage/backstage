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
import qs from 'qs';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { rootRouteRef } from '../../plugin';

import { useRouteRef, IconComponent } from '@backstage/core-plugin-api';
import { SidebarSearchField, useContent } from '@backstage/core-components';

/**
 * Props for {@link SidebarSearch}.
 *
 * @public
 */
export type SidebarSearchProps = {
  icon?: IconComponent;
};

/**
 * @public
 */
export const SidebarSearch = (props: SidebarSearchProps) => {
  const searchRoute = useRouteRef(rootRouteRef);
  const { focusContent } = useContent();
  const navigate = useNavigate();
  const handleSearch = useCallback(
    (query: string): void => {
      const queryString = qs.stringify({ query }, { addQueryPrefix: true });
      focusContent();
      navigate(`${searchRoute()}${queryString}`);
    },
    [focusContent, navigate, searchRoute],
  );

  return (
    <SidebarSearchField
      icon={props.icon}
      onSearch={handleSearch}
      to="/search"
    />
  );
};
