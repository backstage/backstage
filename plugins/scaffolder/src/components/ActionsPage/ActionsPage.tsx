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
  Button,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core';
import { scaffolderApiRef } from '../../api';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { JSONSchema } from '@backstage/catalog-model';

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

export const ActionsPage = () => {
  const api = useApi(scaffolderApiRef);
  const classes = useStyles();
  const { loading, value, error } = useAsync(async () => {
    return api.listActions();
  });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <ErrorPage
        statusMessage="Failed to load installed actions"
        status="500"
      />
    );
  }

  const formatRows = (input: JSONSchema) => {
    const properties = input.properties;
    if (!properties) {
      return undefined;
    }
    const required = input.required ? input.required : [];

    return Object.entries(properties).map(entry => {
      const [key, props] = entry;
      const isRequired = required.includes(key);
      return (
        <TableRow key={key}>
          <TableCell>
            {key}
            {isRequired && <strong>*</strong>}
          </TableCell>
          <TableCell>{props.title}</TableCell>
          <TableCell>{props.description}</TableCell>
          <TableCell>{props.type}</TableCell>
        </TableRow>
      );
    });
  };

  const items = value?.map(action => {
    if (action.id.startsWith('legacy:')) {
      return undefined;
    }
    return (
      <>
        <Typography variant="h4">{action.id}</Typography>
        {action.schema?.input && (
          <>
            <Typography variant="h6">Input</Typography>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{formatRows(action.schema?.input)}</TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {action.schema?.output && (
          <>
            <Typography variant="h6">Output</Typography>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{formatRows(action.schema?.output)}</TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </>
    );
  });

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title="Installed actions"
        subtitle="This is the collection of all installed actions"
      />
      <Content>{items}</Content>
    </Page>
  );
};
