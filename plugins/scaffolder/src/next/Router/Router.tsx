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
import React, { PropsWithChildren } from 'react';
import { Routes, Route, useOutlet } from 'react-router';
import { TemplateListPage } from '../TemplateListPage';
import { TemplateWizardPage } from '../TemplateWizardPage';
import {
  FieldExtensionOptions,
  FIELD_EXTENSION_WRAPPER_KEY,
  FIELD_EXTENSION_KEY,
  DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS,
} from '../../extensions';

import { useElementFilter } from '@backstage/core-plugin-api';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '../TemplateListPage/TemplateGroups';
import { nextSelectedTemplateRouteRef } from '../../routes';
import { SecretsContextProvider } from '../../components/secrets/SecretsContext';
import {
  DEFAULT_SCAFFOLDER_LAYOUT,
  LayoutOptions,
  LAYOUTS_KEY,
  LAYOUTS_WRAPPER_KEY,
} from '../../layouts';

/**
 * The Props for the Scaffolder Router
 *
 * @alpha
 */
export type NextRouterProps = {
  components?: {
    TemplateCardComponent?: React.ComponentType<{
      template: TemplateEntityV1beta3;
    }>;
    TaskPageComponent?: React.ComponentType<{}>;
  };
  groups?: TemplateGroupFilter[];
};

/**
 * The Scaffolder Router
 *
 * @alpha
 */
export const Router = (props: PropsWithChildren<NextRouterProps>) => {
  const { components: { TemplateCardComponent } = {} } = props;

  const outlet = useOutlet() || props.children;

  const customFieldExtensions = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: FIELD_EXTENSION_WRAPPER_KEY,
      })
      .findComponentData<FieldExtensionOptions>({
        key: FIELD_EXTENSION_KEY,
      }),
  );

  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          customFieldExtension => customFieldExtension.name === name,
        ),
    ),
  ];

  const customLayouts = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: LAYOUTS_WRAPPER_KEY,
      })
      .findComponentData<LayoutOptions>({
        key: LAYOUTS_KEY,
      }),
  );

  if (
    !customLayouts.find(
      layout => layout.name === DEFAULT_SCAFFOLDER_LAYOUT.name,
    )
  ) {
    customLayouts.push(DEFAULT_SCAFFOLDER_LAYOUT);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TemplateListPage
            TemplateCardComponent={TemplateCardComponent}
            groups={props.groups}
          />
        }
      />

      <Route
        path={nextSelectedTemplateRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateWizardPage
              customFieldExtensions={fieldExtensions}
              layouts={customLayouts}
            />
          </SecretsContextProvider>
        }
      />
    </Routes>
  );
};
