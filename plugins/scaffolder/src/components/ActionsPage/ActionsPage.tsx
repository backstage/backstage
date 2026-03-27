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
import { useEffect, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { Action, scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { Search, Link as LinkIcon, X } from 'lucide-react';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Input,
  Link,
  MarkdownContent,
  Page,
  Progress,
  ShadcnButton,
} from '@backstage/core-components';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import {
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
  templatingExtensionsRouteRef,
} from '../../routes';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';
import { Expanded, RenderSchema, SchemaRenderContext } from '../RenderSchema';
import { ScaffolderUsageExamplesTable } from '../ScaffolderUsageExamplesTable';

/** Tailwind utility class constants for code styling */
const codeClasses =
  'font-mono px-2 py-1 bg-muted inline-block rounded border border-border relative';
const codeRequiredClasses =
  "after:absolute after:content-['*'] after:top-0 after:right-1 after:font-bold after:text-destructive";
const linkClasses = 'pl-2';

export const ActionPageContent = () => {
  const api = useApi(scaffolderApiRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const {
    loading,
    value = [],
    error,
  } = useAsync(async () => {
    return api.listActions();
  }, [api]);

  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const expanded = useState<Expanded>({});

  useEffect(() => {
    if (value.length && window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, [value]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title={t('actionsPage.content.emptyState.title')}
          description={t('actionsPage.content.emptyState.description')}
        />
      </>
    );
  }

  const filteredActions = selectedAction
    ? [selectedAction]
    : value.filter(
        action =>
          !searchQuery ||
          action.id.toLowerCase().includes(searchQuery.toLowerCase()),
      );

  return (
    <>
      <div className="pb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="actions-autocomplete"
            aria-label={t('actionsPage.content.searchFieldPlaceholder')}
            placeholder={t('actionsPage.content.searchFieldPlaceholder')}
            className="pl-9"
            value={selectedAction?.id ?? searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSelectedAction(null);
            }}
          />
          {(selectedAction || searchQuery) && (
            <ShadcnButton
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectedAction(null);
                setSearchQuery('');
              }}
              title="Clear"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </ShadcnButton>
          )}
        </div>
      </div>
      {filteredActions.map(action => {
        if (action.id.startsWith('legacy:')) {
          return undefined;
        }
        const partialSchemaRenderContext: Omit<
          SchemaRenderContext,
          'parentId'
        > = {
          classes: {
            code: codeClasses,
            codeRequired: codeRequiredClasses,
          },
          expanded,
          headings: [
            // eslint-disable-next-line jsx-a11y/heading-has-content -- heading template: content is injected via React.cloneElement in RenderSchema
            <h4 className="text-base font-semibold" />,
          ],
        };
        return (
          <div className="pb-6" key={action.id}>
            <div className="flex items-center">
              <h2
                id={action.id.replaceAll(':', '-')}
                className={cn(codeClasses, 'text-xl font-semibold')}
              >
                {action.id}
              </h2>
              <Link
                className={linkClasses}
                to={`#${action.id.replaceAll(':', '-')}`}
              >
                <LinkIcon className="h-4 w-4" />
              </Link>
            </div>
            {action.description && (
              <MarkdownContent content={action.description} />
            )}
            {action.schema?.input && (
              <div className="pb-4">
                <h3 className="text-lg font-semibold">
                  {t('actionsPage.action.input')}
                </h3>
                <RenderSchema
                  strategy="properties"
                  context={{
                    parentId: `${action.id}.input`,
                    ...partialSchemaRenderContext,
                  }}
                  schema={action?.schema?.input}
                />
              </div>
            )}
            {action.schema?.output && (
              <div className="pb-4">
                <h3 className="text-xl font-semibold">
                  {t('actionsPage.action.output')}
                </h3>
                <RenderSchema
                  strategy="properties"
                  context={{
                    parentId: `${action.id}.output`,
                    ...partialSchemaRenderContext,
                  }}
                  schema={action?.schema?.output}
                />
              </div>
            )}
            {action.examples && (
              <Accordion type="single" collapsible>
                <AccordionItem value={`${action.id}-examples`}>
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">
                      {t('actionsPage.action.examples')}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-4">
                      <ScaffolderUsageExamplesTable
                        examples={action.examples}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        );
      })}
    </>
  );
};

export type ActionsPageProps = {
  contextMenu?: {
    editor?: boolean;
    tasks?: boolean;
    create?: boolean;
    templatingExtensions?: boolean;
  };
};

export const ActionsPage = (props: ActionsPageProps) => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const templatingExtensionsLink = useRouteRef(templatingExtensionsRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked: undefined,
    onTasksClicked:
      props?.contextMenu?.tasks !== false
        ? () => navigate(tasksLink())
        : undefined,
    onCreateClicked:
      props?.contextMenu?.create !== false
        ? () => navigate(createLink())
        : undefined,
    onTemplatingExtensionsClicked:
      props?.contextMenu?.templatingExtensions !== false
        ? () => navigate(templatingExtensionsLink())
        : undefined,
  };

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('actionsPage.pageTitle')}
        title={t('actionsPage.title')}
        subtitle={t('actionsPage.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <ActionPageContent />
      </Content>
    </Page>
  );
};
