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
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

import { Page, Header, Content, Progress } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  FormProps,
  FieldExtensionOptions,
  type LayoutOptions,
} from '@backstage/plugin-scaffolder-react';

import { scaffolderTranslationRef } from '../../../translation';
import {
  WebFileSystemAccess,
  WebFileSystemStore,
} from '../../../lib/filesystem';
import { TemplateEditor } from './TemplateEditor';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  {
    content: {
      padding: 0,
    },
  },
  { name: 'ScaffolderTemplateEditorToolbar' },
);

interface TemplatePageProps {
  defaultPreviewTemplate?: string;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  layouts?: LayoutOptions[];
  formProps?: FormProps;
}

export function TemplatePage(props: TemplatePageProps) {
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { value, loading, retry } = useAsyncRetry(async () => {
    const directory = await WebFileSystemStore.getDirectory();
    if (!directory) return undefined;
    return WebFileSystemAccess.fromHandle(directory);
  }, []);

  const handleLoadDirectory = useCallback(() => {
    WebFileSystemAccess.requestDirectoryAccess()
      .then(WebFileSystemStore.setDirectory)
      .then(retry);
  }, [retry]);

  const handleCloseDirectory = useCallback(() => {
    WebFileSystemStore.setDirectory(undefined).then(retry);
  }, [retry]);

  return (
    <Page themeId="home">
      <Header
        title={t('templateEditorPage.title')}
        subtitle={t('templateEditorPage.subtitle')}
      />
      <Content className={classes.content}>
        {loading ? (
          <Progress />
        ) : (
          <TemplateEditor
            directory={value}
            layouts={props.layouts}
            formProps={props.formProps}
            fieldExtensions={props.fieldExtensions}
            onClose={handleCloseDirectory}
            onLoad={handleLoadDirectory}
          />
        )}
      </Content>
    </Page>
  );
}
