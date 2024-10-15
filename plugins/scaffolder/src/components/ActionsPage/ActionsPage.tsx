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
import React, { useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { Action, scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Link,
  MarkdownContent,
  Page,
  Progress,
} from '@backstage/core-components';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import {
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
  templateExtensionsRouteRef,
} from '../../routes';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';
import { Expanded, RenderSchema, SchemaRenderContext } from '../RenderSchema';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';

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
  const expanded = useState<Expanded>({});

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
        const partialSchemaRenderContext: Omit<
          SchemaRenderContext,
          'parentId'
        > = {
          classes,
          expanded,
          headings: [<Typography variant="h6" component="h4" />],
        };
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
                <RenderSchema
                  strategy="properties"
                  context={{
                    parentId: `${action.id}.input`,
                    ...partialSchemaRenderContext,
                  }}
                  schema={action?.schema?.input}
                />
              </Box>
            )}
            {action.schema?.output && (
              <Box pb={2}>
                <Typography variant="h5" component="h3">
                  {t('actionsPage.action.output')}
                </Typography>
                <RenderSchema
                  strategy="properties"
                  context={{
                    parentId: `${action.id}.output`,
                    ...partialSchemaRenderContext,
                  }}
                  schema={action?.schema?.output}
                />
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
  const templateExtensionsLink = useRouteRef(templateExtensionsRouteRef);
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
    onTemplateExtensionsClicked: () => navigate(templateExtensionsLink()),
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
