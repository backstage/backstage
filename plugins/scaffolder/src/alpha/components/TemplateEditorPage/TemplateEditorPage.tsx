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
import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';

import { WebFileSystemAccess } from '../../../lib/filesystem';

import { TemplateEditorIntro } from './TemplateEditorIntro';
import { useNavigate } from 'react-router-dom';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  editorRouteRef,
  customFieldsRouteRef,
  rootRouteRef,
  templateFormRouteRef,
} from '../../../routes';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { WebFileSystemStore } from '../../../lib/filesystem/WebFileSystemAccess';
import { createExampleTemplate } from '../../../lib/filesystem/createExampleTemplate';

export function TemplateEditorPage() {
  const navigate = useNavigate();
  const createLink = useRouteRef(rootRouteRef);
  const editorLink = useRouteRef(editorRouteRef);
  const customFieldsLink = useRouteRef(customFieldsRouteRef);
  const templateFormLink = useRouteRef(templateFormRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        title={t('templateEditorPage.title')}
        type="Scaffolder"
        typeLink={createLink()}
        subtitle={t('templateEditorPage.subtitle')}
      />
      <Content>
        <TemplateEditorIntro
          onSelect={option => {
            if (option === 'local') {
              WebFileSystemAccess.requestDirectoryAccess()
                .then(directory => WebFileSystemStore.setDirectory(directory))
                .then(() => navigate(editorLink()))
                .catch(() => {});
            } else if (option === 'create-template') {
              WebFileSystemAccess.requestDirectoryAccess()
                .then(directory => {
                  createExampleTemplate(directory).then(() => {
                    WebFileSystemStore.setDirectory(directory);
                    navigate(editorLink());
                  });
                })
                .catch(() => {});
            } else if (option === 'form') {
              navigate(templateFormLink());
            } else if (option === 'field-explorer') {
              navigate(customFieldsLink());
            }
          }}
        />
      </Content>
    </Page>
  );
}
