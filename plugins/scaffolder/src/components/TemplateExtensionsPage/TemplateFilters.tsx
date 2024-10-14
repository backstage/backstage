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
import { Link, MarkdownContent } from '@backstage/core-components';
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
import LinkIcon from '@material-ui/icons/Link';
import { isEmpty, pick } from 'lodash';
import React, { useState } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';
import { Expanded, SchemaRenderContext } from '../RenderSchema';
import { RenderSchema } from '../RenderSchema/RenderSchema';
import { StyleClasses, Xlate } from './types';
import { Extension, renderLink } from './navigation';

const FilterDetailContent = ({
  t,
  classes,
  name,
  filter,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
  classes: ClassNameMap;
  name: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(filter).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        {t('templateExtensions.content.filters.metadataAbsent')}
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
    <React.Fragment key={`${name}.detail`}>
      {filter.description && <MarkdownContent content={filter.description} />}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          {t('templateExtensions.content.filters.schema.input')}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${name}.input`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.input ?? {}}
        />
      </Box>
      {schema?.arguments?.length && (
        <Box key={`${name}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {t('templateExtensions.content.filters.schema.arguments')}
          </Typography>
          {schema.arguments.map((arg, i) => (
            <React.Fragment key={i}>
              <Typography variant="h6" component="h4">{`[${i}]`}</Typography>
              <RenderSchema
                strategy="root"
                context={{
                  parentId: `${name}.arg${i}`,
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
          {t('templateExtensions.content.filters.schema.output')}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${name}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </Box>
      {filter.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              {t('templateExtensions.content.filters.examples')}
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
  linkPage,
  selectedItem,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
  classes: StyleClasses;
  filters: ListTemplateExtensionsResponse['filters'];
  linkPage: string;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'filter') {
    return <></>;
  }
  if (isEmpty(filters)) {
    return (
      <div data-testid="no-filters">
        {t('templateExtensions.content.filters.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="filters">
      {Object.entries(
        selectedItem ? pick(filters, selectedItem.name) : filters,
      ).map(([name, filter]) => {
        const link = renderLink({ kind: 'filter', name });
        return (
          <Box pb={4} key={name} data-testid={name}>
            <Typography
              id={link}
              variant="h4"
              component="h2"
              className={classes.code}
            >
              {name}
            </Typography>
            <Link
              className={classes.link}
              to={`${linkPage}#${link}`}
              {...(linkPage === ''
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <LinkIcon />
            </Link>
            <FilterDetailContent {...{ t, classes, name, filter }} />
          </Box>
        );
      })}
    </div>
  );
};
