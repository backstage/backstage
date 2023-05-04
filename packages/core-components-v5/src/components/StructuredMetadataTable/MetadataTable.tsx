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
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Theme } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';

export type MetadataTableTitleCellClassKey = 'root';

const tableTitleCellStyles = (theme: Theme) => ({
  root: {
    fontWeight: theme.typography.fontWeightBold,
    // TODO: FIX
    // whiteSpace: 'nowrap',
    paddingRight: theme.spacing(4),
    border: '0',
    verticalAlign: 'top',
  },
});

export type MetadataTableCellClassKey = 'root';

const tableContentCellStyles = {
  root: {
    border: '0',
    verticalAlign: 'top',
  },
};

export type MetadataTableListClassKey = 'root';

export type MetadataTableListItemClassKey = 'root' | 'random';

const TitleCell = withStyles(TableCell, tableTitleCellStyles, {
  name: 'BackstageMetadataTableTitleCell',
});
const ContentCell = withStyles(TableCell, tableContentCellStyles, {
  name: 'BackstageMetadataTableCell',
});

export const MetadataTable = ({
  dense,
  children,
}: {
  dense?: boolean;
  children: React.ReactNode;
}) => (
  <Table size={dense ? 'small' : 'medium'}>
    <TableBody>{children}</TableBody>
  </Table>
);

export const MetadataTableItem = ({
  title,
  children,
  ...rest
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <TableRow>
    {title && <TitleCell>{title}</TitleCell>}
    <ContentCell colSpan={title ? 1 : 2} {...rest}>
      {children}
    </ContentCell>
  </TableRow>
);

export const MetadataList = withStyles(
  List,
  theme => ({
    root: {
      margin: theme.spacing(0, 0, -1, 0),
    },
  }),
  {
    name: 'BackstageMetadataTableList',
  },
);

export const MetadataListItem = withStyles(
  ListItem,
  theme => ({
    root: {
      padding: theme.spacing(0, 0, 1, 0),
    },
    random: {},
  }),
  {
    name: 'BackstageMetadataTableListItem',
  },
);
