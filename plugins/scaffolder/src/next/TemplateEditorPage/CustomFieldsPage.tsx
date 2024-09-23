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

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page, Header, Content } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { editRouteRef } from '../../routes';
import { scaffolderTranslationRef } from '../../translation';

import { CustomFieldExplorer } from './CustomFieldExplorer';

interface CustomFieldsPageProps {
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}

export function CustomFieldsPage(props: CustomFieldsPageProps) {
  const navigate = useNavigate();
  const editLink = useRouteRef(editRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const handleClose = useCallback(() => {
    navigate(editLink());
  }, [navigate, editLink]);

  return (
    <Page themeId="home">
      <Header
        title={t('templateEditorPage.title')}
        subtitle={t('templateEditorPage.subtitle')}
      />
      <Content>
        <CustomFieldExplorer
          customFieldExtensions={props.fieldExtensions}
          onClose={handleClose}
        />
      </Content>
    </Page>
  );
}
