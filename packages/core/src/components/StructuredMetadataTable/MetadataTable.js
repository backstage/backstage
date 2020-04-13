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

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles,
} from '@material-ui/core';

const tableTitleCellStyles = theme => ({
  root: {
    fontWeight: 'bolder',
    whiteSpace: 'nowrap',
    paddingRight: theme.spacing(4),
    border: '0',
    verticalAlign: 'top',
  },
});

const tableContentCellStyles = {
  root: {
    color: 'rgba(0, 0, 0, 0.6)',
    border: '0',
    verticalAlign: 'top',
  },
};

const listStyles = theme => ({
  root: {
    listStyle: 'none',
    margin: theme.spacing(0, 0, -1, 0),
    padding: '0',
  },
});

const listItemStyles = theme => ({
  root: {
    padding: theme.spacing(0, 0, 1, 0),
  },
});

const TitleCell = withStyles(tableTitleCellStyles)(TableCell);
const ContentCell = withStyles(tableContentCellStyles)(TableCell);

export const MetadataTable = ({ dense, children }) => (
  <Table>
    {!dense && (
      <colgroup>
        <col style={{ width: 'auto' }} />
        <col style={{ width: '100%' }} />
      </colgroup>
    )}
    <TableBody>{children}</TableBody>
  </Table>
);

export const MetadataTableItem = ({ title, children, ...rest }) => (
  <TableRow>
    {title && <TitleCell>{title}</TitleCell>}
    <ContentCell colSpan={title ? 1 : 2} {...rest}>
      {children}
    </ContentCell>
  </TableRow>
);

export const MetadataList = withStyles(listStyles)(({ classes, children }) => (
  <ul className={classes.root}>{children}</ul>
));

export const MetadataListItem = withStyles(
  listItemStyles,
)(({ classes, children }) => <li className={classes.root}>{children}</li>);
