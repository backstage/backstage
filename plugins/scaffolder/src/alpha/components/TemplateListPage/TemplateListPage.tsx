/*
 * Copyright 2022 The Backstage Authors
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

import { ComponentType, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';

import {
  Content,
  ContentHeader,
  DocsIcon,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTagPicker,
  CatalogFilterLayout,
  UserListPicker,
  EntityOwnerPicker,
} from '@backstage/plugin-catalog-react';
import {
  ScaffolderPageContextMenu,
  TemplateCategoryPicker,
  TemplateGroups,
} from '@backstage/plugin-scaffolder-react/alpha';

import { RegisterExistingButton } from './RegisterExistingButton';
import {
  actionsRouteRef,
  editRouteRef,
  registerComponentRouteRef,
  scaffolderListTaskRouteRef,
  selectedTemplateRouteRef,
  templatingExtensionsRouteRef,
  viewTechDocRouteRef,
} from '../../../routes';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateGroupFilter } from '@backstage/plugin-scaffolder-react';
import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { buildTechDocsURL } from '@backstage/plugin-techdocs-react';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';

/**
 * @alpha
 */
export type TemplateListPageProps = {
  TemplateCardComponent?: ComponentType<{
    template: TemplateEntityV1beta3;
  }>;
  groups?: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    tasks?: boolean;
    templatingExtensions?: boolean;
  };
  headerOptions?: {
    pageTitleOverride?: string;
    title?: string;
    subtitle?: string;
  };
};

const createGroupsWithOther = (
  groups: TemplateGroupFilter[],
  t: TranslationFunction<typeof scaffolderTranslationRef.T>,
): TemplateGroupFilter[] => [
  ...groups,
  {
    title: t('templateListPage.templateGroups.otherTitle'),
    filter: e => ![...groups].some(({ filter }) => filter(e)),
  },
];

/**
 * @alpha
 */
export const TemplateListPage = (props: TemplateListPageProps) => {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const {
    TemplateCardComponent,
    groups: givenGroups = [],
    templateFilter,
    headerOptions,
  } = props;
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const viewTechDocsLink = useRouteRef(viewTechDocRouteRef);
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const templatingExtensionsLink = useRouteRef(templatingExtensionsRouteRef);
  const app = useApp();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const groups = givenGroups.length
    ? createGroupsWithOther(givenGroups, t)
    : [
        {
          title: t('templateListPage.templateGroups.defaultTitle'),
          filter: () => true,
        },
      ];

  const scaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked:
      props?.contextMenu?.actions !== false
        ? () => navigate(actionsLink())
        : undefined,
    onTasksClicked:
      props?.contextMenu?.tasks !== false
        ? () => navigate(tasksLink())
        : undefined,
    onTemplatingExtensionsClicked:
      props?.contextMenu?.templatingExtensions !== false
        ? () => navigate(templatingExtensionsLink())
        : undefined,
  };

  const additionalLinksForEntity = useCallback(
    (template: TemplateEntityV1beta3) => {
      if (
        !(
          template.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
          template.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
        ) ||
        !viewTechDocsLink
      ) {
        return [];
      }

      const url = buildTechDocsURL(template, viewTechDocsLink);
      return url
        ? [
            {
              icon: app.getSystemIcon('docs') ?? DocsIcon,
              text: t(
                'templateListPage.additionalLinksForEntity.viewTechDocsTitle',
              ),
              url,
            },
          ]
        : [];
    },
    [app, viewTechDocsLink, t],
  );

  const onTemplateSelected = useCallback(
    (template: TemplateEntityV1beta3) => {
      const { namespace, name } = parseEntityRef(stringifyEntityRef(template));

      navigate(templateRoute({ namespace, templateName: name }));
    },
    [navigate, templateRoute],
  );

  return (
    <EntityListProvider>
      <Page themeId="home">
        <Header
          pageTitleOverride={t('templateListPage.pageTitle')}
          title={t('templateListPage.title')}
          subtitle={t('templateListPage.subtitle')}
          {...headerOptions}
        >
          <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
        </Header>
        <Content>
          <ContentHeader>
            <RegisterExistingButton
              title={t(
                'templateListPage.contentHeader.registerExistingButtonTitle',
              )}
              to={registerComponentLink && registerComponentLink()}
            />
            <SupportButton>
              {t('templateListPage.contentHeader.supportButtonTitle')}
            </SupportButton>
          </ContentHeader>

          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntitySearchBar />
              <EntityKindPicker initialFilter="template" hidden />
              <UserListPicker
                initialFilter="all"
                availableFilters={['all', 'starred']}
              />
              <TemplateCategoryPicker />
              <EntityTagPicker />
              <EntityOwnerPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <TemplateGroups
                groups={groups}
                templateFilter={templateFilter}
                TemplateCardComponent={TemplateCardComponent}
                onTemplateSelected={onTemplateSelected}
                additionalLinksForEntity={additionalLinksForEntity}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </Content>
      </Page>
    </EntityListProvider>
  );
};
