/*
 * Copyright 2022 The Backstage Authors
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
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { Table, TableColumn } from '@backstage/core-components';

import { Box } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';

type SystemIcon = {
  key: string;
  icon: IconComponent;
};

const columns: TableColumn[] = [
  {
    title: 'Icon',
    field: 'icon',
    width: 'auto',
    render: (row: Partial<SystemIcon>) => (
      <Box display="flex" alignItems="center">
        {row.icon ? <row.icon /> : <LanguageIcon />}
      </Box>
    ),
  },
  {
    title: 'Key',
    field: 'key',
    width: 'auto',
    defaultSort: 'asc',
  },
];

export const UserSettingsAvailableIconsTable = () => {
  const app = useApp();
  const systemIcons = app.getSystemIcons();
  const systemIconList: SystemIcon[] = [];
  for (const icon in systemIcons) {
    if (Object.prototype.hasOwnProperty.call(systemIcons, icon)) {
      const sysIcon = {
        key: icon,
        icon: systemIcons[icon],
      };
      systemIconList.push(sysIcon);
    }
  }

  return (
    <Table
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 5,
      }}
      title="Available Icons"
      data={systemIconList}
    />
  );
};
