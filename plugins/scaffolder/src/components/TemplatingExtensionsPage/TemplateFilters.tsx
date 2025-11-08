/*
 * Copyright 2025 The Backstage Authors
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
  ListTemplatingExtensionsResponse,
  TemplateFilter,
} from '@backstage/plugin-scaffolder-react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { cloneElement, Fragment, ReactElement, useState } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { Expanded, RenderSchema, SchemaRenderContext } from '../RenderSchema';
import { ScaffolderUsageExamplesTable } from '../ScaffolderUsageExamplesTable';
import { inspectFunctionArgSchema } from './functionArgs';
import { Extension, renderFragment } from './navigation';
import { StyleClasses, TranslationMessages } from './types';

const FilterDetailContent = ({
  t,
  classes,
  name,
  filter,
}: {
  t: TranslationMessages<typeof scaffolderTranslationRef>;
  classes: ClassNameMap;
  name: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (!Object.keys(filter).length) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        {t('templatingExtensions.content.filters.metadataAbsent')}
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
    <Fragment key={`${name}.detail`}>
      {filter.description && <MarkdownContent content={filter.description} />}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          {t('templatingExtensions.content.filters.schema.input')}
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
            {t('templatingExtensions.content.filters.schema.arguments')}
          </Typography>
          {schema.arguments.map((arg, i) => {
            const [argSchema, required] = inspectFunctionArgSchema(arg);

            return (
              <Fragment key={i}>
                <div
                  className={classNames({ [classes.argRequired]: required })}
                >
                  <Typography variant="h6" component="h4">
                    {`[${i}]`}
                  </Typography>
                </div>
                <RenderSchema
                  strategy="root"
                  context={{
                    parentId: `${name}.arg${i}`,
                    ...partialSchemaRenderContext,
                    headings: [<Typography variant="h6" component="h5" />],
                  }}
                  schema={argSchema}
                />
              </Fragment>
            );
          })}
        </Box>
      )}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          {t('templatingExtensions.content.filters.schema.output')}
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
              {t('templatingExtensions.content.filters.examples')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ScaffolderUsageExamplesTable examples={filter.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Fragment>
  );
};

export const TemplateFilters = ({
  t,
  classes,
  filters,
  baseLink,
  selectedItem,
}: {
  t: TranslationMessages<typeof scaffolderTranslationRef>;
  classes: StyleClasses;
  filters: ListTemplatingExtensionsResponse['filters'];
  baseLink: ReactElement<Parameters<typeof Link>[0]>;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'filter') {
    return <></>;
  }
  if (!Object.keys(filters).length) {
    return (
      <div data-testid="no-filters">
        {t('templatingExtensions.content.filters.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="filters">
      {Object.entries(
        selectedItem
          ? { [selectedItem.name]: filters[selectedItem.name] }
          : filters,
      ).map(([name, filter]) => {
        const fragment = renderFragment({ kind: 'filter', name });
        return (
          <Box pb={4} key={name} data-testid={name}>
            <Typography
              id={fragment}
              variant="h4"
              component="h2"
              className={classes.code}
            >
              {name}
            </Typography>
            {cloneElement(baseLink, {
              to: `${baseLink.props.to}#${fragment}`,
            })}
            <FilterDetailContent {...{ t, classes, name, filter }} />
          </Box>
        );
      })}
    </div>
  );
};
