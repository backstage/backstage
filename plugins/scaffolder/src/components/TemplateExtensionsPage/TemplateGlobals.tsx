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
import { CodeSnippet, Link, MarkdownContent } from '@backstage/core-components';
import {
  ListTemplateExtensionsResponse,
  TemplateGlobalFunction,
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
import { Expanded, RenderSchema, SchemaRenderContext } from '../RenderSchema';
import { Extension, renderLink } from './navigation';
import { Xlate } from './types';

const FunctionDetailContent = ({
  classes,
  name,
  fn,
  t,
}: {
  classes: ClassNameMap;
  name: string;
  fn: TemplateGlobalFunction;
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(fn).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        Function metadata unavailable
      </Typography>
    );
  }
  const schema = fn.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    headings: [<Typography variant="h6" component="h4" />],
  };
  return (
    <React.Fragment key={`${name}.detail`}>
      {fn.description && <MarkdownContent content={fn.description} />}
      {schema?.arguments?.length && (
        <Box key={`${name}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {t('templateExtensions.content.functions.schema.arguments')}
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
          {t('templateExtensions.content.functions.schema.output')}
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
      {fn.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              {t('templateExtensions.content.functions.examples')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ExamplesTable examples={fn.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
};

export const TemplateGlobalFunctions = ({
  classes,
  functions,
  t,
  linkPage,
  selectedItem,
}: {
  classes: ClassNameMap;
  functions: ListTemplateExtensionsResponse['globals']['functions'];
  t: Xlate<typeof scaffolderTranslationRef>;
  linkPage: string;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'function') {
    return <></>;
  }
  if (isEmpty(functions)) {
    return (
      <div data-testid="no-functions">
        {t('templateExtensions.content.functions.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="functions">
      {Object.entries(
        selectedItem ? pick(functions, selectedItem.name) : functions,
      ).map(([name, fn]) => {
        const link = renderLink({ kind: 'function', name });
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
            <FunctionDetailContent {...{ classes, name, fn, t }} />
          </Box>
        );
      })}
    </div>
  );
};

export const TemplateGlobalValues = ({
  classes,
  t,
  values,
  linkPage,
  selectedItem,
}: {
  classes: ClassNameMap;
  t: Xlate<typeof scaffolderTranslationRef>;
  values: ListTemplateExtensionsResponse['globals']['values'];
  linkPage: string;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'value') {
    return <></>;
  }
  if (isEmpty(values)) {
    return (
      <div data-testid="no-values">
        {t('templateExtensions.content.values.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="values">
      {Object.entries(
        selectedItem ? pick(values, selectedItem.name) : values,
      ).map(([name, gv]) => {
        const link = renderLink({ kind: 'value', name });
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
            {gv.description && <MarkdownContent content={gv.description} />}
            <Box padding={1} data-testid={`${name}.value`}>
              <CodeSnippet
                text={JSON.stringify(gv.value, null, 2)}
                showCopyCodeButton
                language="json"
              />
            </Box>
          </Box>
        );
      })}
    </div>
  );
};
