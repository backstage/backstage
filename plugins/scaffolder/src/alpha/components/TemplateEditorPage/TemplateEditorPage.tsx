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
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Content, Header, Page } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  FormProps,
  FieldExtensionOptions,
  type LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { scaffolderTranslationRef } from '../../../translation';
import { editRouteRef } from '../../../routes';
import { TemplateEditor } from './TemplateEditor';

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

export function TemplateEditorPage(props: TemplatePageProps) {
  const classes = useStyles();
  const editLink = useRouteRef(editRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        title={t('templateEditorPage.title')}
        subtitle={t('templateEditorPage.subtitle')}
        type={t('templateIntroPage.title')}
        typeLink={editLink()}
      />
      <Content className={classes.content}>
        <TemplateEditor
          layouts={props.layouts}
          formProps={props.formProps}
          fieldExtensions={props.fieldExtensions}
        />
      </Content>
    </Page>
  );
}
