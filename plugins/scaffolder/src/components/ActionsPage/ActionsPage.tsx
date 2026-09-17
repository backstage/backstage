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
import { useEffect, useMemo, useRef, useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { Action, scaffolderApiRef } from '@backstage/plugin-scaffolder-react';

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  MarkdownContent,
  Page,
} from '@backstage/core-components';
import { Flex, List, ListRow, SearchField, Text } from '@backstage/ui';
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

function ActionDetail({ action }: { action: Action }) {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const expanded = useState<Expanded>({});

  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    expanded,
  };

  const hasInput = !!action.schema?.input;
  const hasOutput = !!action.schema?.output;
  const hasExamples = !!action.examples;

  if (!hasInput && !hasOutput && !hasExamples) {
    return null;
  }

  return (
    <Flex direction="column" gap="6">
      {hasInput && (
        <Flex direction="column" gap="2">
          <Text as="h3" variant="title-small" weight="bold">
            {t('actionsPage.action.input')}
          </Text>
          <RenderSchema
            strategy="properties"
            context={{
              parentId: `${action.id}.input`,
              ...partialSchemaRenderContext,
            }}
            schema={action?.schema?.input}
          />
        </Flex>
      )}
      {hasOutput && (
        <Flex direction="column" gap="2">
          <Text as="h3" variant="title-small" weight="bold">
            {t('actionsPage.action.output')}
          </Text>
          <RenderSchema
            strategy="properties"
            context={{
              parentId: `${action.id}.output`,
              ...partialSchemaRenderContext,
            }}
            schema={action?.schema?.output}
          />
        </Flex>
      )}
      {hasExamples && (
        <Flex direction="column" gap="2">
          <Text as="h3" variant="title-small" weight="bold">
            {t('actionsPage.action.examples')}
          </Text>
          <ScaffolderUsageExamplesTable examples={action.examples!} />
        </Flex>
      )}
    </Flex>
  );
}

export const ActionPageContent = () => {
  const api = useApi(scaffolderApiRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const {
    loading,
    value: actions,
    error,
  } = useAsync(async () => {
    return api.listActions();
  }, [api]);

  const [selectedActionId, setSelectedActionId] = useState<
    string | undefined
  >();
  const [searchQuery, setSearchQuery] = useState('');
  const initialHashHandled = useRef(false);

  useEffect(() => {
    if (initialHashHandled.current || !actions) {
      return;
    }
    const hash = window.location.hash.slice(1);
    if (hash && actions.some(a => a.id === hash)) {
      initialHashHandled.current = true;
      setSelectedActionId(hash);
      requestAnimationFrame(() => {
        const row = document.querySelector(`[data-key="${CSS.escape(hash)}"]`);
        if (row && typeof row.scrollIntoView === 'function') {
          row.scrollIntoView({ block: 'nearest' });
        }
      });
    }
  }, [actions]);

  const filteredActions = useMemo(() => {
    const nonLegacy =
      actions?.filter(action => !action.id.startsWith('legacy:')) ?? [];
    if (!searchQuery) {
      return nonLegacy;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return nonLegacy.filter(
      action =>
        action.id.toLowerCase().includes(lowerQuery) ||
        action.description?.toLowerCase().includes(lowerQuery),
    );
  }, [actions, searchQuery]);

  const selectedAction = useMemo(
    () => filteredActions.find(a => a.id === selectedActionId),
    [filteredActions, selectedActionId],
  );

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

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: selectedAction ? '320px 1fr' : '1fr',
        gridTemplateRows: 'auto 1fr',
        gap: 24,
      }}
    >
      <SearchField
        aria-label={t('actionsPage.content.searchFieldPlaceholder')}
        placeholder={t('actionsPage.content.searchFieldPlaceholder')}
        value={searchQuery}
        onChange={setSearchQuery}
      />
      {!loading && !filteredActions.length ? (
        <EmptyState
          missing="info"
          title={t('actionsPage.content.emptyState.title')}
          description={t('actionsPage.content.emptyState.description')}
        />
      ) : (
        <List
          aria-label={t('actionsPage.title')}
          selectionMode="single"
          selectionBehavior="toggle"
          selectedKeys={selectedActionId ? [selectedActionId] : []}
          style={{ minWidth: 0, overflow: 'hidden' }}
          onSelectionChange={selection => {
            if (selection === 'all') {
              return;
            }
            const selected = [...selection][0] as string | undefined;
            setSelectedActionId(prev => {
              const next = prev === selected ? undefined : selected;
              const hash = next ? `#${next}` : '';
              window.history.replaceState(
                null,
                '',
                `${window.location.pathname}${window.location.search}${hash}`,
              );
              return next;
            });
          }}
        >
          {filteredActions.map(action => (
            <ListRow
              key={action.id}
              id={action.id}
              textValue={action.id}
              description={action.description ?? undefined}
            >
              {action.id}
            </ListRow>
          ))}
        </List>
      )}
      {selectedAction && (
        <Flex
          direction="column"
          gap="3"
          style={{ gridColumn: 2, gridRow: '1 / -1', minWidth: 0 }}
        >
          <Flex direction="column" gap="1">
            <Text as="h2" variant="title-medium" weight="bold">
              {selectedAction.id}
            </Text>
            {selectedAction.description && (
              <MarkdownContent content={selectedAction.description} />
            )}
          </Flex>
          <ActionDetail action={selectedAction} />
        </Flex>
      )}
    </div>
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
