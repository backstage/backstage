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

import { configApiRef, IconComponent, useApi } from '@backstage/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';

export type ButtonGroup = {
  name: string;
  items: {
    id: string;
    label: string;
    icon?: IconComponent;
  }[];
};

export const useFilterGroups = () => {
  const configApi = useApi(configApiRef);

  const filterGroups: ButtonGroup[] = [
    {
      name: 'Personal',
      items: [
        {
          id: 'owned',
          label: 'Owned',
          icon: SettingsIcon,
        },
        {
          id: 'starred',
          label: 'Starred',
          icon: StarIcon,
        },
      ],
    },
    {
      name: configApi.getString('organization.name'),
      items: [
        {
          id: 'all',
          label: 'All',
        },
      ],
    },
  ];

  return { filterId: 'filterGroups', filterGroups };
};
