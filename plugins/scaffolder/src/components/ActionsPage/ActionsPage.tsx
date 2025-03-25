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
import React, { Fragment, useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  Action,
  ActionExample,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import classNames from 'classnames';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import LinkIcon from '@material-ui/icons/Link';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  CodeSnippet,
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Link,
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
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

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
  link: {
    paddingLeft: theme.spacing(1),
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

export const ActionPageContent = () => {
  const api = useApi(scaffolderApiRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const classes = useStyles();
  const {
    loading,
    value = [],
    error,
  } = useAsync(async () => {
    return api.listActions();
  }, [api]);

  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (value.length && window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, [value]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title={t('actionsPage.content.emptyState.title')}
          description={t('actionsPage.content.emptyState.description')}
        />
      </>
    );
  }

  const renderTable = (rows?: JSX.Element[]) => {
    if (!rows || rows.length < 1) {
      return (
        <Typography>{t('actionsPage.content.noRowsDescription')}</Typography>
      );
    }
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('actionsPage.content.tableCell.name')}</TableCell>
              <TableCell>{t('actionsPage.content.tableCell.title')}</TableCell>
              <TableCell>
                {t('actionsPage.content.tableCell.description')}
              </TableCell>
              <TableCell>{t('actionsPage.content.tableCell.type')}</TableCell>
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

  return (
    <>
      <Box pb={3}>
        <Autocomplete
          id="actions-autocomplete"
          options={value}
          loading={loading}
          getOptionLabel={option => option.id}
          renderInput={params => (
            <TextField
              {...params}
              aria-label={t('actionsPage.content.searchFieldPlaceholder')}
              placeholder={t('actionsPage.content.searchFieldPlaceholder')}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
          onChange={(_event, option) => {
            setSelectedAction(option);
          }}
          fullWidth
        />
      </Box>
      {(selectedAction ? [selectedAction] : value).map(action => {
        if (action.id.startsWith('legacy:')) {
          return undefined;
        }

        const oneOfInput = renderTables(
          'oneOf',
          `${action.id}.input`,
          action.schema?.input?.oneOf,
        );
        const oneOfOutput = renderTables(
          'oneOf',
          `${action.id}.output`,
          action.schema?.output?.oneOf,
        );
        return (
          <Box pb={3} key={action.id}>
            <Box display="flex" alignItems="center">
              <Typography
                id={action.id.replaceAll(':', '-')}
                variant="h5"
                component="h2"
                className={classes.code}
              >
                {action.id}
              </Typography>
              <Link
                className={classes.link}
                to={`#${action.id.replaceAll(':', '-')}`}
              >
                <LinkIcon />
              </Link>
            </Box>
            {action.description && (
              <MarkdownContent content={action.description} />
            )}
            {action.schema?.input && (
              <Box pb={2}>
                <Typography variant="h6" component="h3">
                  {t('actionsPage.action.input')}
                </Typography>
                {renderTable(
                  formatRows(`${action.id}.input`, action?.schema?.input),
                )}
                {oneOfInput}
              </Box>
            )}
            {action.schema?.output && (
              <Box pb={2}>
                <Typography variant="h5" component="h3">
                  {t('actionsPage.action.output')}
                </Typography>
                {renderTable(
                  formatRows(`${action.id}.output`, action?.schema?.output),
                )}
                {oneOfOutput}
              </Box>
            )}
            {action.examples && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" component="h3">
                    {t('actionsPage.action.examples')}
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
      })}
    </>
  );
};

export type ActionsPageProps = {
  contextMenu?: {
    editor?: boolean;
    tasks?: boolean;
    create?: boolean;
  };
};

export const ActionsPage = (props: ActionsPageProps) => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked: undefined,
    onTasksClicked:
      props?.contextMenu?.tasks !== false
        ? () => navigate(tasksLink())
        : undefined,
    onCreateClicked:
      props?.contextMenu?.create !== false
        ? () => navigate(createLink())
        : undefined,
  };

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('actionsPage.pageTitle')}
        title={t('actionsPage.title')}
        subtitle={t('actionsPage.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <ActionPageContent />
      </Content>
    </Page>
  );
};
