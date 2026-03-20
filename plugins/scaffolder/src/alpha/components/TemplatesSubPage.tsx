/*
 * Copyright 2026 The Backstage Authors
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

import { useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Content,
  ContentHeader,
  DocsIcon,
  SupportButton,
} from '@backstage/core-components';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
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
  TemplateCategoryPicker,
  TemplateGroups,
} from '@backstage/plugin-scaffolder-react/alpha';
import {
  FieldExtensionOptions,
  SecretsContextProvider,
  useCustomFieldExtensions,
  useCustomLayouts,
} from '@backstage/plugin-scaffolder-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { FormField } from '@backstage/plugin-scaffolder-react/alpha';
import { OpaqueFormField } from '@internal/scaffolder';
import { RegisterExistingButton } from './TemplateListPage/RegisterExistingButton';
import { TemplateWizardPageContent } from './TemplateWizardPage';
import {
  registerComponentRouteRef,
  selectedTemplateRouteRef,
  viewTechDocRouteRef,
} from '../../routes';
import { scaffolderTranslationRef } from '../../translation';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../extensions/default';
import { buildTechDocsURL } from '@backstage/plugin-techdocs-react';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';

function TemplateListContent() {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const viewTechDocsLink = useRouteRef(viewTechDocRouteRef);
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const navigate = useNavigate();
  const app = useApp();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const groups = [
    {
      title: t('templateListPage.templateGroups.defaultTitle'),
      filter: () => true,
    },
  ];

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
              onTemplateSelected={onTemplateSelected}
              additionalLinksForEntity={additionalLinksForEntity}
            />
          </CatalogFilterLayout.Content>
        </CatalogFilterLayout>
      </Content>
    </EntityListProvider>
  );
}

/**
 * Sub-page for the templates tab. Renders the template list at the index route
 * and the template wizard at the parameterized route.
 *
 * @internal
 */
export function TemplatesSubPage(props: { formFields?: Array<FormField> }) {
  const customFieldExtensions = useCustomFieldExtensions(undefined);
  const customLayouts = useCustomLayouts(undefined);

  const fieldExtensions = [
    ...customFieldExtensions,
    ...(props.formFields?.map(OpaqueFormField.toInternal) ?? []),
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          (customFieldExtension: FieldExtensionOptions) =>
            customFieldExtension.name === name,
        ),
    ),
  ] as FieldExtensionOptions[];

  return (
    <Routes>
      <Route index element={<TemplateListContent />} />
      <Route
        path=":namespace/:templateName"
        element={
          <SecretsContextProvider>
            <TemplateWizardPageContent
              customFieldExtensions={fieldExtensions}
              layouts={customLayouts}
            />
          </SecretsContextProvider>
        }
      />
    </Routes>
  );
}
