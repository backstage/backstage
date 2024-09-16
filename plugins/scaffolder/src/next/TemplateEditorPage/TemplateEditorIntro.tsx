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

import { ContentHeader } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { scaffolderTranslationRef } from '../../translation';
import { WebFileSystemAccess } from '../../lib/filesystem';
import { ListTaskPageContent } from '../../components/ListTasksPage/ListTasksPage';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

interface EditorIntroProps {
  style?: JSX.IntrinsicElements['div']['style'];
  onSelect?: (
    option: 'local' | 'form' | 'field-explorer' | 'create-template',
  ) => void;
}

export function TemplateEditorIntro(props: EditorIntroProps) {
  const supportsLoad = WebFileSystemAccess.isSupported();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <div style={props.style}>
      <ContentHeader>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="text primary button group"
        >
          <Button
            disabled={!supportsLoad}
            onClick={() => props.onSelect?.('local')}
          >
            {t('templateEditorPage.templateEditorIntro.loadLocal.title')}
          </Button>
          <Button
            disabled={!supportsLoad}
            onClick={() => props.onSelect?.('create-template')}
          >
            {t('templateEditorPage.templateEditorIntro.createTemplate.title')}
          </Button>
        </ButtonGroup>
      </ContentHeader>
      <ListTaskPageContent />
    </div>
  );
}
