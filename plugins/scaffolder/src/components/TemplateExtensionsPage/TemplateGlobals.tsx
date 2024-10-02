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
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';
import { Expanded, SchemaRenderContext } from '../RenderSchema';
import { RenderSchema } from '../RenderSchema/RenderSchema';
import { StyleClasses, Xlate } from './types';

const FunctionDetailContent = ({
  classes,
  fnName,
  fn,
  t,
}: {
  classes: ClassNameMap;
  fnName: string;
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
    <React.Fragment key={`${fnName}.detail`}>
      {fn.description && <MarkdownContent content={fn.description} />}
      {schema?.arguments?.length && (
        <Box key={`${fnName}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {t('templateExtensions.globals.functions.schema.arguments')}
          </Typography>
          {schema.arguments.map((arg, i) => (
            <React.Fragment key={i}>
              <Typography variant="h6" component="h4">{`[${i}]`}</Typography>
              <RenderSchema
                strategy="root"
                context={{
                  parentId: `${fnName}.arg${i}`,
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
          {t('templateExtensions.globals.functions.schema.output')}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${fnName}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </Box>
      {fn.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              {t('templateExtensions.globals.functions.examples')}
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

const TemplateGlobalFunctions = ({
  classes,
  functions,
  t,
  linkPage,
}: {
  classes: ClassNameMap;
  functions: ListTemplateExtensionsResponse['globals']['functions'];
  t: Xlate<typeof scaffolderTranslationRef>;
  linkPage: string;
}) => {
  return (
    <>
      {Object.entries(functions).map(([fnName, fn]) => (
        <Box pb={4} key={fnName} data-testid={fnName}>
          <Typography
            id={`global_${fnName}`}
            variant="h4"
            component="h2"
            className={classes.code}
          >
            {fnName}
          </Typography>
          <Link
            className={classes.link}
            to={`${linkPage}#global_${fnName}`}
            {...(linkPage === ''
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <LinkIcon />
          </Link>
          <FunctionDetailContent {...{ classes, fnName, fn, t }} />
        </Box>
      ))}
    </>
  );
};

const TemplateGlobalValues = ({
  classes,
  values,
  linkPage,
}: {
  classes: ClassNameMap;
  values: ListTemplateExtensionsResponse['globals']['values'];
  linkPage: string;
}) => {
  return (
    <>
      {Object.entries(values).map(([key, gv]) => (
        <Box pb={4} key={key} data-testid={key}>
          <Typography
            id={`global_${key}`}
            variant="h4"
            component="h2"
            className={classes.code}
          >
            {key}
          </Typography>
          <Link
            className={classes.link}
            to={`${linkPage}#global_${key}`}
            {...(linkPage === ''
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <LinkIcon />
          </Link>
          {gv.description && <MarkdownContent content={gv.description} />}
          <Box padding={1} data-testid={`${key}.value`}>
            <CodeSnippet
              text={JSON.stringify(gv.value, null, 2)}
              showCopyCodeButton
              language="json"
            />
          </Box>
        </Box>
      ))}
    </>
  );
};

export const TemplateGlobals = ({
  t,
  classes,
  globals,
  linkPage,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
  classes: StyleClasses;
  globals: ListTemplateExtensionsResponse['globals'];
  linkPage: string;
}) => {
  const { functions, values } = globals;
  return (
    <div data-testid="globals">
      {(isEmpty(functions) && (
        <Box data-testid="no-fun" sx={{ display: 'none' }} />
      )) || (
        <div data-testid="fun">
          <Typography variant="h3" component="h1" className={classes.code}>
            {t('templateExtensions.globals.functions.title')}
          </Typography>
          <TemplateGlobalFunctions {...{ t, classes, functions, linkPage }} />
        </div>
      )}
      {(isEmpty(values) && (
        <Box data-testid="no-values" sx={{ display: 'none' }} />
      )) || (
        <div data-testid="values">
          <Typography variant="h3" component="h1" className={classes.code}>
            {t('templateExtensions.globals.values.title')}
          </Typography>
          <TemplateGlobalValues {...{ classes, values, linkPage }} />
        </div>
      )}
    </div>
  );
};
