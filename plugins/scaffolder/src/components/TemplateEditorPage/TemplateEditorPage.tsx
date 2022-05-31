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
import React, { useState } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import {
  TemplateDirectoryAccess,
  WebFileSystemAccess,
} from '../../lib/filesystem';
import { TemplateEditorIntro } from './TemplateEditorIntro';
import { TemplateEditor } from './TemplateEditor';
import { TemplateFormPreviewer } from './TemplateFormPreviewer';
import { FieldExtensionOptions } from '../../extensions';

type Selection =
  | {
      type: 'local';
      directory: TemplateDirectoryAccess;
    }
  | {
      type: 'form';
    };

interface TemplateEditorPageProps {
  defaultPreviewTemplate?: string;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}

export function TemplateEditorPage(props: TemplateEditorPageProps) {
  const [selection, setSelection] = useState<Selection>();

  let content: JSX.Element | null = null;
  if (selection?.type === 'local') {
    content = (
      <TemplateEditor
        directory={selection.directory}
        fieldExtensions={props.customFieldExtensions}
        onClose={() => setSelection(undefined)}
      />
    );
  } else if (selection?.type === 'form') {
    content = (
      <TemplateFormPreviewer
        defaultPreviewTemplate={props.defaultPreviewTemplate}
        customFieldExtensions={props.customFieldExtensions}
        onClose={() => setSelection(undefined)}
      />
    );
  } else {
    content = (
      <Content>
        <TemplateEditorIntro
          onSelect={option => {
            if (option === 'local') {
              WebFileSystemAccess.requestDirectoryAccess()
                .then(directory => setSelection({ type: 'local', directory }))
                .catch(() => {});
            } else if (option === 'form') {
              setSelection({ type: 'form' });
            }
          }}
        />
      </Content>
    );
  }

  return (
    <Page themeId="home">
      <Header
        title="Template Editor"
        subtitle="Edit, preview, and try out templates and template forms"
      />
      {content}
    </Page>
  );
}
