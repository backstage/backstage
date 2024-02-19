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
import React, { Fragment, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import {
  ActionExample,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Collapse,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import classNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CodeSnippet,
  Content,
  ErrorPage,
  Header,
  MarkdownContent,
  Page,
  Progress,
} from '@backstage/core-components';
import Chip from '@material-ui/core/Chip';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import {
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
} from '../../routes';

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

const ExamplesTable = (props: { examples: ActionExample[] }) => {
  return (
    <Grid container>
      {props.examples.map((example, index) => {
        return (
          <Fragment key={`example-${index}`}>
            <Grid item lg={3}>
              <Box padding={4}>
                <Typography>{example.description}</Typography>
              </Box>
            </Grid>
            <Grid item lg={9}>
              <Box padding={1}>
                <CodeSnippet
                  text={example.example}
                  showLineNumbers
                  showCopyCodeButton
                  language="yaml"
                />
              </Box>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
};

export const ActionsPage = () => {
  const api = useApi(scaffolderApiRef);
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: undefined,
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
  };
  const classes = useStyles();
  const { loading, value, error } = useAsync(async () => {
    return api.listActions();
  });
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <ErrorPage
        statusMessage="Failed to load installed actions"
        status="500"
        stack={error.stack}
      />
    );
  }

  const renderTable = (rows?: JSX.Element[]) => {
    if (!rows || rows.length < 1) {
      return <Typography>No schema defined</Typography>;
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
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getTypes = (properties: JSONSchema7) => {
    if (!properties.type) {
      return ['unknown'];
    }

    if (properties.type !== 'array') {
      return [properties.type].flat();
    }

    return [
      `${properties.type}(${
        (properties.items as JSONSchema7 | undefined)?.type ?? 'unknown'
      })`,
    ];
  };

  const formatRows = (parentId: string, input?: JSONSchema7) => {
    const properties = input?.properties;
    if (!properties) {
      return undefined;
    }

    return Object.entries(properties).map(entry => {
      const [key] = entry;
      const id = `${parentId}.${key}`;
      const props = entry[1] as unknown as JSONSchema7;
      const codeClassname = classNames(classes.code, {
        [classes.codeRequired]: input.required?.includes(key),
      });
      const types = getTypes(props);

      return (
        <React.Fragment key={id}>
          <TableRow key={id}>
            <TableCell>
              <div className={codeClassname}>{key}</div>
            </TableCell>
            <TableCell>{props.title}</TableCell>
            <TableCell>{props.description}</TableCell>
            <TableCell>
              {types.map(type =>
                type.includes('object') ? (
                  <Chip
                    label={type}
                    key={type}
                    icon={
                      isExpanded[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    variant="outlined"
                    onClick={() =>
                      setIsExpanded(prevState => {
                        const state = { ...prevState };
                        state[id] = !prevState[id];
                        return state;
                      })
                    }
                  />
                ) : (
                  <Chip label={type} key={type} variant="outlined" />
                ),
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={isExpanded[id]} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" component="div">
                    {key}
                  </Typography>
                  {renderTable(
                    formatRows(
                      id,
                      props.type === 'array'
                        ? ({
                            properties:
                              (props.items as JSONSchema7 | undefined)
                                ?.properties ?? {},
                          } as unknown as JSONSchema7 | undefined)
                        : props,
                    ),
                  )}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
  };

  const renderTables = (
    name: string,
    id: string,
    input?: JSONSchema7Definition[],
  ) => {
    if (!input) {
      return undefined;
    }

    return (
      <>
        <Typography variant="h6" component="h4">
          {name}
        </Typography>
        {input.map((i, index) => (
          <div key={index}>
            {renderTable(
              formatRows(`${id}.${index}`, i as unknown as JSONSchema7),
            )}
          </div>
        ))}
      </>
    );
  };

  const items = value?.map(action => {
    if (action.id.startsWith('legacy:')) {
      return undefined;
    }

    const oneOf = renderTables(
      'oneOf',
      `${action.id}.input`,
      action.schema?.input?.oneOf,
    );
    return (
      <Box pb={4} key={action.id}>
        <Typography variant="h4" component="h2" className={classes.code}>
          {action.id}
        </Typography>
        {action.description && <MarkdownContent content={action.description} />}
        {action.schema?.input && (
          <Box pb={2}>
            <Typography variant="h5" component="h3">
              Input
            </Typography>
            {renderTable(
              formatRows(`${action.id}.input`, action?.schema?.input),
            )}
            {oneOf}
          </Box>
        )}
        {action.schema?.output && (
          <Box pb={2}>
            <Typography variant="h5" component="h3">
              Output
            </Typography>
            {renderTable(
              formatRows(`${action.id}.output`, action?.schema?.output),
            )}
          </Box>
        )}
        {action.examples && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5" component="h3">
                Examples
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box pb={2}>
                <ExamplesTable examples={action.examples} />
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  });

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title="Installed actions"
        subtitle="This is the collection of all installed actions"
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>{items}</Content>
    </Page>
  );
};
