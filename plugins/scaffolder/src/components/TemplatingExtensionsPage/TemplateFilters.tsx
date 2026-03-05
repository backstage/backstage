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
  Link,
  MarkdownContent,
} from '@backstage/core-components';
import {
  ListTemplatingExtensionsResponse,
  TemplateFilter,
} from '@backstage/plugin-scaffolder-react';
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
  classes: Record<string, string>;
  name: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (!Object.keys(filter).length) {
    return (
      // eslint-disable-next-line react/forbid-elements -- migrating away from MUI Typography
      <p className="italic text-muted-foreground">
        {t('templatingExtensions.content.filters.metadataAbsent')}
      </p>
    );
  }
  const schema = filter.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    // eslint-disable-next-line jsx-a11y/heading-has-content -- template element; content injected via cloneElement in RenderSchema
    headings: [<h4 className="text-base font-semibold" />],
  };
  return (
    <Fragment key={`${name}.detail`}>
      {filter.description && <MarkdownContent content={filter.description} />}
      <div className="pb-4">
        <h3 className="text-lg font-semibold">
          {t('templatingExtensions.content.filters.schema.input')}
        </h3>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${name}.input`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.input ?? {}}
        />
      </div>
      {schema?.arguments?.length && (
        <div key={`${name}.args`} className="pb-4">
          <h3 className="text-lg font-semibold">
            {t('templatingExtensions.content.filters.schema.arguments')}
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
                    // eslint-disable-next-line jsx-a11y/heading-has-content -- template element; content injected via cloneElement in RenderSchema
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
          {t('templatingExtensions.content.filters.schema.output')}
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
      {filter.examples && (
        <Accordion type="single" collapsible>
          <AccordionItem value="examples">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">
                {t('templatingExtensions.content.filters.examples')}
              </h3>
            </AccordionTrigger>
            <AccordionContent forceMount>
              <div className="pb-4">
                <ScaffolderUsageExamplesTable examples={filter.examples} />
              </div>
            </AccordionContent>
          </AccordionItem>
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
          <div className="pb-8" key={name} data-testid={name}>
            <h2 id={fragment} className={cn('text-xl font-bold', classes.code)}>
              {name}
            </h2>
            {cloneElement(baseLink, {
              to: `${baseLink.props.to}#${fragment}`,
            })}
            <FilterDetailContent {...{ t, classes, name, filter }} />
          </div>
        );
      })}
    </div>
  );
};
