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
import { EditorIntro } from './EditorIntro';
import { TemplateEditor } from './TemplateEditor';
import { TemplateFormEditor } from './TemplateFormEditor';
import { FieldExtensionOptions } from '../../extensions';
import { MockFileSystemAccess } from '../../lib/filesystem/MockFileSystemAccess';

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
  const [selection, setSelection] = useState<Selection>({
    type: 'local',
    directory: MockFileSystemAccess.createMockDirectory({
      'template.yaml': `
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: bitbucket-demo
spec:
  type: service

  parameters:
    - title: Choose a name and location
      required:
        - name
        - repoUrl
      properties:
        name:
          title: Name
          type: string
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com

  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./template
        values:
          name: \${{ parameters.name }}
    - id: publish
      name: Publish
      action: publish:bitbucket
      input:
        description: This is \${{ parameters.name }}
        repoUrl: \${{ parameters.repoUrl }}

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: \${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  output:
    links:
      - title: Repository
        url: \${{ steps.publish.output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: \${{ steps.register.output.entityRef }}
`,
      'template/catalog-info.yaml': `
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: \${{values.name | dump}}
spec:
  type: website
  lifecycle: experimental
  owner: \${{values.owner | dump}}
`,
    }),
  });

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
      <TemplateFormEditor
        defaultPreviewTemplate={props.defaultPreviewTemplate}
        customFieldExtensions={props.customFieldExtensions}
        onClose={() => setSelection(undefined)}
      />
    );
  } else {
    content = (
      <Content>
        <EditorIntro
          onSelect={option => {
            if (option === 'local') {
              WebFileSystemAccess.get()
                .requestDirectoryAccess()
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
