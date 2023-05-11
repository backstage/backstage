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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

export type MetadataTableTitleCellClassKey = 'root';

const tableTitleCellStyles = (theme: Theme) =>
  createStyles({
    root: {
      fontWeight: theme.typography.fontWeightBold,
      whiteSpace: 'nowrap',
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

const listStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0, 0, -1, 0),
    },
  });

export type MetadataTableListItemClassKey = 'root' | 'random';

const listItemStyles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 0, 1, 0),
    },
    random: {},
  });

const TitleCell = withStyles(tableTitleCellStyles, {
  name: 'BackstageMetadataTableTitleCell',
})(TableCell);
const ContentCell = withStyles(tableContentCellStyles, {
  name: 'BackstageMetadataTableCell',
})(TableCell);

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

interface StyleProps extends WithStyles {
  children?: React.ReactNode;
}

export const MetadataList = withStyles(listStyles, {
  name: 'BackstageMetadataTableList',
})(({ classes, children }: StyleProps) => (
  <List disablePadding className={classes.root}>
    {children}
  </List>
));

export const MetadataListItem = withStyles(listItemStyles, {
  name: 'BackstageMetadataTableListItem',
})(({ classes, children }: StyleProps) => (
  <ListItem className={classes.root}>{children}</ListItem>
));
