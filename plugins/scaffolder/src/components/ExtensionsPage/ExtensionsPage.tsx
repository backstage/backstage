/*
 * Copyright 2021 Spotify AB
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
import { useAsync } from 'react-use';
import {
  useApi,
  Progress,
  Content,
  Header,
  Page,
  ErrorPage,
} from '@backstage/core';
import { scaffolderApiRef } from '../../api';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { JSONSchema } from '@backstage/catalog-model';
import { JSONSchema7Definition } from 'json-schema';
import classNames from 'classnames';
import { FieldExtensionOptions } from '../../extensions';

const useStyles = makeStyles(theme => ({
  code: {
    fontFamily: 'Menlo, monospace',
    padding: theme.spacing(1),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    display: 'inline-block',
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: 'relative',
  },

  codeRequired: {
    '&::after': {
      position: 'absolute',
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: 'bolder',
      color: theme.palette.error.light,
    },
  },
}));

export const ExtensionsPage = ({
  fieldExtensions,
}: {
  fieldExtensions: FieldExtensionOptions[];
}) => {
  const classes = useStyles();

  const formatRows = (input: JSONSchema) => {
    const properties = input.properties;
    if (!properties) {
      return undefined;
    }

    return Object.entries(properties).map(entry => {
      const [key] = entry;
      const props = (entry[1] as unknown) as JSONSchema;
      const codeClassname = classNames(classes.code, {
        [classes.codeRequired]: input.required?.includes(key),
      });

      return (
        <TableRow key={key}>
          <TableCell>
            <div className={codeClassname}>{key}</div>
          </TableCell>
          <TableCell>{props.title}</TableCell>
          <TableCell>{props.description}</TableCell>
          <TableCell>
            <span className={classes.code}>{props.type}</span>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderTable = (input: JSONSchema) => {
    if (!input.properties) {
      return undefined;
    }
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{formatRows(input)}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTables = (name: string, input?: JSONSchema7Definition[]) => {
    if (!input) {
      return undefined;
    }

    return (
      <>
        <Typography variant="h6">{name}</Typography>
        {input.map((i, index) => (
          <div key={index}>{renderTable((i as unknown) as JSONSchema)}</div>
        ))}
      </>
    );
  };

  const items = fieldExtensions?.map(fieldExtension => {});

  console.log(fieldExtensions);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title="Extensions"
        subtitle="This is a list of the registered extensions to the scaffolder"
      />
      <Content>{items}</Content>
    </Page>
  );
};
