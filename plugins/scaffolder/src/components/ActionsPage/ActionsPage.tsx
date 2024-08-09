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
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import useAsync from 'react-use/esm/useAsync';

import {
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  MarkdownContent,
  Page,
  Progress,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import {
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
  templateFiltersRouteRef,
  templateGlobalsRouteRef,
} from '../../routes';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';
import { Expanded, SchemaRenderContext } from '../RenderSchema';
import { RenderSchema } from '../RenderSchema/RenderSchema';

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

const ActionPageContent = () => {
  const api = useApi(scaffolderApiRef);

  const classes = useStyles();
  const { loading, value, error } = useAsync(async () => {
    return api.listActions();
  });
  const expanded = useState<Expanded>({});

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title="No information to display"
          description="There are no actions installed or there was an issue communicating with backend."
        />
      </>
    );
  }

  return value?.map(action => {
    if (action.id.startsWith('legacy:')) {
      return undefined;
    }
    const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
      classes,
      expanded,
      headings: [<Typography variant="h6" component="h4" />],
    };
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
              Output
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
};
export const ActionsPage = () => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const templateFiltersLink = useRouteRef(templateFiltersRouteRef);
  const templateGlobalsLink = useRouteRef(templateGlobalsRouteRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: undefined,
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
    onTemplateFiltersClicked: () => navigate(templateFiltersLink()),
    onTemplateGlobalsClicked: () => navigate(templateGlobalsLink()),
  };

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title="Installed actions"
        subtitle="This is the collection of all installed actions"
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <ActionPageContent />
      </Content>
    </Page>
  );
};
