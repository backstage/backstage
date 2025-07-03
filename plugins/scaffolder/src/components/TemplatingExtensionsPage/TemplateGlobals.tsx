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
import { CodeSnippet, Link, MarkdownContent } from '@backstage/core-components';
import {
  ListTemplatingExtensionsResponse,
  TemplateGlobalFunction,
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
import { TranslationMessages } from './types';

const FunctionDetailContent = ({
  classes,
  name,
  fn,
  t,
}: {
  classes: ClassNameMap;
  name: string;
  fn: TemplateGlobalFunction;
  t: TranslationMessages<typeof scaffolderTranslationRef>;
}) => {
  const expanded = useState<Expanded>({});
  if (!Object.keys(fn).length) {
    return (
      <Typography
        style={{ fontStyle: 'italic' }}
        data-testid={`${name}.metadataAbsent`}
      >
        {t('templatingExtensions.content.functions.metadataAbsent')}
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
    <Fragment key={`${name}.detail`}>
      {fn.description && <MarkdownContent content={fn.description} />}
      {schema?.arguments?.length && (
        <Box key={`${name}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {t('templatingExtensions.content.functions.schema.arguments')}
          </Typography>
          {schema.arguments.map((arg, i) => {
            const [argSchema, required] = inspectFunctionArgSchema(arg);

            return (
              <Fragment key={i}>
                <div
                  className={classNames({ [classes.argRequired]: required })}
                >
                  <Typography
                    variant="h6"
                    component="h4"
                  >{`[${i}]`}</Typography>
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
          {t('templatingExtensions.content.functions.schema.output')}
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
              {t('templatingExtensions.content.functions.examples')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ScaffolderUsageExamplesTable examples={fn.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Fragment>
  );
};

export const TemplateGlobalFunctions = ({
  classes,
  functions,
  t,
  baseLink,
  selectedItem,
}: {
  classes: ClassNameMap;
  functions: ListTemplatingExtensionsResponse['globals']['functions'];
  t: TranslationMessages<typeof scaffolderTranslationRef>;
  baseLink: ReactElement<Parameters<typeof Link>[0]>;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'function') {
    return <></>;
  }
  if (!Object.keys(functions).length) {
    return (
      <div data-testid="no-functions">
        {t('templatingExtensions.content.functions.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="functions">
      {Object.entries(
        selectedItem
          ? { [selectedItem.name]: functions[selectedItem.name] }
          : functions,
      ).map(([name, fn]) => {
        const fragment = renderFragment({ kind: 'function', name });
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
  baseLink,
  selectedItem,
}: {
  classes: ClassNameMap;
  t: TranslationMessages<typeof scaffolderTranslationRef>;
  values: ListTemplatingExtensionsResponse['globals']['values'];
  baseLink: ReactElement<Parameters<typeof Link>[0]>;
  selectedItem: Extension | null;
}) => {
  if (selectedItem && selectedItem.kind !== 'value') {
    return <></>;
  }
  if (!Object.keys(values).length) {
    return (
      <div data-testid="no-values">
        {t('templatingExtensions.content.values.notAvailable')}
      </div>
    );
  }
  return (
    <div data-testid="values">
      {Object.entries(
        selectedItem
          ? { [selectedItem.name]: values[selectedItem.name] }
          : values,
      ).map(([name, gv]) => {
        const fragment = renderFragment({ kind: 'value', name });
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
