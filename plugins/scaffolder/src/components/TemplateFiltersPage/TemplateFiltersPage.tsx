/*
 * Copyright 2024 The Backstage Authors
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
import {
  ListTemplateFiltersResponse,
  TemplateFilter,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderPageContextMenu,
  ScaffolderPageContextMenuProps,
} from '@backstage/plugin-scaffolder-react/alpha';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync, { AsyncState } from 'react-use/esm/useAsync';
import {
  actionsRouteRef,
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
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

const FilterDetailContent = ({
  classes,
  filterName,
  filter,
}: {
  classes: ClassNameMap;
  filterName: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(filter).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        Filter metadata unavailable
      </Typography>
    );
  }
  const schema = filter.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    headings: [<Typography variant="h6" component="h4" />],
  };
  return (
    <React.Fragment key={`${filterName}.detail`}>
      {filter.description && <MarkdownContent content={filter.description} />}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          Input
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${filterName}.input`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.input ?? {}}
        />
      </Box>
      {schema?.arguments?.length && (
        <Box key={`${filterName}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            Arguments
          </Typography>
          {schema.arguments.map((arg, i) => (
            <React.Fragment key={i}>
              <Typography variant="h6" component="h4">{`[${i}]`}</Typography>
              <RenderSchema
                strategy="root"
                context={{
                  parentId: `${filterName}.arg${i}`,
                  ...partialSchemaRenderContext,
                  headings: [<Typography variant="h6" component="h5" />],
                }}
                schema={arg}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          Output
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${filterName}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </Box>
      {filter.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              Examples
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ExamplesTable examples={filter.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
};

const TemplateFiltersCategory = ({
  category,
  classes,
  state,
}: {
  category: string;
  classes: ClassNameMap;
  state: AsyncState<ListTemplateFiltersResponse>;
}) => {
  const { loading, value, error } = state;

  if (loading) {
    return <Progress />;
  }
  if (error || !value || Object.keys(value).length === 0) {
    return (
      <div data-testid={category}>
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There are no ${category} template filters available or there was an issue communicating with the backend.`}
        />
      </div>
    );
  }

  return (
    <>
      {Object.entries(value).map(([filterName, filter]) => (
        <Box pb={4} key={filterName} id={filterName} data-testid={filterName}>
          <Typography variant="h4" component="h2" className={classes.code}>
            {filterName}
          </Typography>
          <FilterDetailContent {...{ classes, filterName, filter }} />
        </Box>
      ))}
    </>
  );
};

const TemplateFiltersPageContent = () => {
  const api = useApi(scaffolderApiRef);

  const classes = useStyles();

  const builtIn = useAsync(async () => {
    return api.listBuiltInTemplateFilters();
  });

  const additional = useAsync(async () => {
    return api.listAdditionalTemplateFilters();
  });

  return (
    <>
      <Typography variant="h3" component="h1" className={classes.code}>
        Built-in
      </Typography>
      <TemplateFiltersCategory
        category="built-in"
        classes={classes}
        state={builtIn}
      />
      <Typography variant="h3" component="h1" className={classes.code}>
        Additional
      </Typography>
      <TemplateFiltersCategory
        category="additional"
        classes={classes}
        state={additional}
      />
    </>
  );
};

export const TemplateFiltersPage = () => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const templateGlobalsLink = useRouteRef(templateGlobalsRouteRef);

  const scaffolderPageContextMenuProps: ScaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: () => navigate(actionsLink()),
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
    onTemplateGlobalsClicked: () => navigate(templateGlobalsLink()),
  };

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Template filters"
        title="Template filters"
        subtitle="This is the collection of available template filters"
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <TemplateFiltersPageContent />
      </Content>
    </Page>
  );
};
