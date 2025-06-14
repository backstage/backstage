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

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Page, Header, Content } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import {
  FormProps,
  LayoutOptions,
  FieldExtensionOptions,
} from '@backstage/plugin-scaffolder-react';

import { editRouteRef } from '../../../routes';
import { scaffolderTranslationRef } from '../../../translation';

import { TemplateFormPreviewer } from './TemplateFormPreviewer';

const useStyles = makeStyles({
  root: {
    padding: 0,
  },
});

interface TemplateFormPageProps {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
  defaultPreviewTemplate?: string;
}

export function TemplateFormPage(props: TemplateFormPageProps) {
  const classes = useStyles();
  const navigate = useNavigate();
  const editLink = useRouteRef(editRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const handleClose = useCallback(() => {
    navigate(editLink());
  }, [navigate, editLink]);

  return (
    <Page themeId="home">
      <Header
        title={t('templateFormPage.title')}
        subtitle={t('templateFormPage.subtitle')}
        type={t('templateIntroPage.title')}
        typeLink={editLink()}
      />
      <Content className={classes.root}>
        <TemplateFormPreviewer
          layouts={props.layouts}
          formProps={props.formProps}
          customFieldExtensions={props.fieldExtensions}
          defaultPreviewTemplate={props.defaultPreviewTemplate}
          onClose={handleClose}
        />
      </Content>
    </Page>
  );
}
