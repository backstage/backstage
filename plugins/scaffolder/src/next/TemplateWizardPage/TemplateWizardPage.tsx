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
import {
  Page,
  Header,
  Content,
  Progress,
  InfoCard,
  MarkdownContent,
} from '@backstage/core-components';
import { FieldExtensionOptions } from '../../extensions';
import { useParams } from 'react-router';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles } from '@material-ui/core';
import { Stepper } from './Stepper';
import { BackstageTheme } from '@backstage/theme';

export interface TemplateWizardPageProps {
  customFieldExtensions: FieldExtensionOptions<any, any>[];
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  markdown: {
    /** to make the styles for React Markdown not leak into the description */
    '& :first-child': {
      marginTop: 0,
    },
    '& :last-child': {
      marginBottom: 0,
    },
  },
}));

const useTemplateParameterSchema = (templateRef: string) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () => scaffolderApi.getTemplateParameterSchema(templateRef),
    [scaffolderApi, templateRef],
  );

  return { manifest: value, loading, error };
};

export const TemplateWizardPage = (_props: TemplateWizardPageProps) => {
  const styles = useStyles();
  const { templateName, namespace } = useParams();
  const { loading, manifest, error } = useTemplateParameterSchema(
    stringifyEntityRef({
      kind: 'Template',
      namespace,
      name: templateName,
    }),
  );

  return (
    <Page themeId="website">
      <Header
        pageTitleOverride="Create a new component"
        title="Create a new component"
        subtitle="Create new software components using standard templates in your organization"
      />
      <Content>
        {loading && <Progress />}
        {manifest && (
          <InfoCard
            title={manifest.title}
            subheader={
              <MarkdownContent
                className={styles.markdown}
                content={manifest.description ?? 'No description'}
              />
            }
            noPadding
            titleTypographyProps={{ component: 'h2' }}
          >
            <Stepper manifest={manifest} />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
