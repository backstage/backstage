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
import { MarkdownContent } from '@backstage/core-components';
import {
  ListTemplateExtensionsResponse,
  TemplateFilter,
} from '@backstage/plugin-scaffolder-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { Expanded, SchemaRenderContext } from '../RenderSchema';
import { RenderSchema } from '../RenderSchema/RenderSchema';
import { StyleClasses, Xlate } from './types';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';
import { isEmpty } from 'lodash';

const FilterDetailContent = ({
  t,
  classes,
  filterName,
  filter,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
  classes: ClassNameMap;
  filterName: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(filter).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        {t('templateExtensions.filters.metadataAbsent')}
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
          {t('templateExtensions.filters.schema.input')}
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
            {t('templateExtensions.filters.schema.arguments')}
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
          {t('templateExtensions.filters.schema.output')}
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
              {t('templateExtensions.filters.examples')}
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

export const TemplateFilters = ({
  t,
  classes,
  filters,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
  classes: StyleClasses;
  filters: ListTemplateExtensionsResponse['filters'];
}) => {
  return isEmpty(filters) ? (
    <Box data-testid="no-filters" sx={{ display: 'none' }} />
  ) : (
    <div data-testid="filters">
      <Typography variant="h3" component="h1" className={classes.code}>
        {t('templateExtensions.filters.title')}
      </Typography>
      {Object.entries(filters).map(([filterName, filter]) => (
        <Box pb={4} key={filterName} id={filterName} data-testid={filterName}>
          <Typography variant="h4" component="h2" className={classes.code}>
            {filterName}
          </Typography>
          <FilterDetailContent {...{ t, classes, filterName, filter }} />
        </Box>
      ))}
    </div>
  );
};
