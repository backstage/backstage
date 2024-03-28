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
import { CustomFieldExplorer } from './CustomFieldExplorer';
import { TemplateEditor } from './TemplateEditor';
import { TemplateFormPreviewer } from './TemplateFormPreviewer';
import {
  FieldExtensionOptions,
  type LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { TemplateEditorIntro } from './TemplateEditorIntro';
import { ScaffolderPageContextMenu } from '@backstage/plugin-scaffolder-react/alpha';
import { useNavigate } from 'react-router-dom';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  actionsRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
} from '../../routes';

type Selection =
  | {
      type: 'local';
      directory: TemplateDirectoryAccess;
    }
  | {
      type: 'form';
    }
  | {
      type: 'field-explorer';
    };

interface TemplateEditorPageProps {
  defaultPreviewTemplate?: string;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
  layouts?: LayoutOptions[];
}

export function TemplateEditorPage(props: TemplateEditorPageProps) {
  const [selection, setSelection] = useState<Selection>();
  const navigate = useNavigate();
  const actionsLink = useRouteRef(actionsRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);

  const scaffolderPageContextMenuProps = {
    onEditorClicked: undefined,
    onActionsClicked: () => navigate(actionsLink()),
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
  };

  let content: JSX.Element | null = null;
  if (selection?.type === 'local') {
    content = (
      <TemplateEditor
        directory={selection.directory}
        fieldExtensions={props.customFieldExtensions}
        onClose={() => setSelection(undefined)}
        layouts={props.layouts}
      />
    );
  } else if (selection?.type === 'form') {
    content = (
      <TemplateFormPreviewer
        defaultPreviewTemplate={props.defaultPreviewTemplate}
        customFieldExtensions={props.customFieldExtensions}
        onClose={() => setSelection(undefined)}
        layouts={props.layouts}
      />
    );
  } else if (selection?.type === 'field-explorer') {
    content = (
      <CustomFieldExplorer
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
            } else if (option === 'field-explorer') {
              setSelection({ type: 'field-explorer' });
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
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      {content}
    </Page>
  );
}
