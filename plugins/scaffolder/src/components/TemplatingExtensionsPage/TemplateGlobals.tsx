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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  cn,
  CodeSnippet,
  Link,
  MarkdownContent,
} from '@backstage/core-components';
import {
  ListTemplatingExtensionsResponse,
  TemplateGlobalFunction,
} from '@backstage/plugin-scaffolder-react';
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
  classes: Record<string, string>;
  name: string;
  fn: TemplateGlobalFunction;
  t: TranslationMessages<typeof scaffolderTranslationRef>;
}) => {
  const expanded = useState<Expanded>({});
  if (!Object.keys(fn).length) {
    return (
      // eslint-disable-next-line react/forbid-elements
      <p
        className="italic text-muted-foreground"
        data-testid={`${name}.metadataAbsent`}
      >
        {t('templatingExtensions.content.functions.metadataAbsent')}
      </p>
    );
  }
  const schema = fn.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    // Heading templates are cloned with content by RenderSchema via cloneElement
    // eslint-disable-next-line jsx-a11y/heading-has-content
    headings: [<h4 className="text-base font-semibold" />],
  };
  return (
    <Fragment key={`${name}.detail`}>
      {fn.description && <MarkdownContent content={fn.description} />}
      {schema?.arguments?.length && (
        <div key={`${name}.args`} className="pb-4">
          <h3 className="text-lg font-semibold">
            {t('templatingExtensions.content.functions.schema.arguments')}
          </h3>
          {schema.arguments.map((arg, i) => {
            const [argSchema, required] = inspectFunctionArgSchema(arg);

            return (
              <Fragment key={i}>
                <div className={cn({ [classes.argRequired]: required })}>
                  <h4 className="text-base font-semibold">{`[${i}]`}</h4>
                </div>
                <RenderSchema
                  strategy="root"
                  context={{
                    parentId: `${name}.arg${i}`,
                    ...partialSchemaRenderContext,
                    // Heading template cloned with content by RenderSchema
                    // eslint-disable-next-line jsx-a11y/heading-has-content
                    headings: [<h5 className="text-sm font-semibold" />],
                  }}
                  schema={argSchema}
                />
              </Fragment>
            );
          })}
        </div>
      )}
      <div className="pb-4">
        <h3 className="text-lg font-semibold">
          {t('templatingExtensions.content.functions.schema.output')}
        </h3>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${name}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </div>
      {fn.examples && (
        <Accordion type="single" collapsible>
          <AccordionItem value="examples">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">
                {t('templatingExtensions.content.functions.examples')}
              </h3>
            </AccordionTrigger>
            <AccordionContent forceMount>
              <div className="pb-4">
                <ScaffolderUsageExamplesTable examples={fn.examples} />
              </div>
            </AccordionContent>
          </AccordionItem>
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
  classes: Record<string, string>;
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
          <div className="pb-8" key={name} data-testid={name}>
            <h2 id={fragment} className={cn('text-xl font-bold', classes.code)}>
              {name}
            </h2>
            {cloneElement(baseLink, {
              to: `${baseLink.props.to}#${fragment}`,
            })}
            <FunctionDetailContent {...{ classes, name, fn, t }} />
          </div>
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
  classes: Record<string, string>;
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
          <div className="pb-8" key={name} data-testid={name}>
            <h2 id={fragment} className={cn('text-xl font-bold', classes.code)}>
              {name}
            </h2>
            {cloneElement(baseLink, {
              to: `${baseLink.props.to}#${fragment}`,
            })}
            {gv.description && <MarkdownContent content={gv.description} />}
            <div className="p-2" data-testid={`${name}.value`}>
              <CodeSnippet
                text={JSON.stringify(gv.value, null, 2)}
                showCopyCodeButton
                language="json"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
