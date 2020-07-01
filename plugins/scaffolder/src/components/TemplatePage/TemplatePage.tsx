/*
 * Copyright 2020 Spotify AB
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
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
  Content,
  errorApiRef,
  Header,
  InfoCard,
  Lifecycle,
  Page,
  useApi,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { LinearProgress } from '@material-ui/core';
import { IChangeEvent } from '@rjsf/core';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useStaleWhileRevalidate from 'swr';
import { scaffolderApiRef } from '../../api';
import { JobStatusModal } from '../JobStatusModal';
import { Job } from '../../types';
import { MultistepJsonForm } from '../MultistepJsonForm';
import { Navigate } from 'react-router';
import { rootRoute } from '../../routes';

const useTemplate = (
  templateName: string,
  catalogApi: typeof catalogApiRef.T,
) => {
  const { data, error } = useStaleWhileRevalidate(
    `templates/${templateName}`,
    async () =>
      catalogApi.getEntities({
        kind: 'Template',
        'metadata.name': templateName,
      }) as Promise<TemplateEntityV1alpha1[]>,
  );
  return { template: data?.[0], loading: !error && !data, error };
};

const OWNER_REPO_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#' as const,
  required: ['storePath', 'owner'],
  properties: {
    owner: {
      type: 'string' as const,
      title: 'Owner',
      description: 'Who is going to own this component',
    },
    storePath: {
      format: 'GitHub user or org / Repo name',
      type: 'string' as const,
      title: 'Store path',
      description: 'GitHub store path in org/repo format',
    },
  },
};

const REPO_FORMAT = {
  'GitHub user or org / Repo name': /[^\/]*\/[^\/]*/,
};

export const TemplatePage = () => {
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const { template, loading } = useTemplate(templateName, catalogApi);

  const [formState, setFormState] = useState({});

  const handleFormReset = () => setFormState({});
  const handleChange = (e: IChangeEvent) =>
    setFormState({ ...formState, ...e.formData });

  const [jobId, setJobId] = useState<string | null>(null);
  const handleClose = () => setJobId(null);

  const handleCreate = async () => {
    const job = await scaffolderApi.scaffold(template!, formState);
    setJobId(job);
  };

  const [entity, setEntity] = React.useState<TemplateEntityV1alpha1 | null>(
    null,
  );

  const handleCreateComplete = async (job: Job) => {
    const componentYaml = job.metadata.remoteUrl?.replace(
      /\.git$/,
      '/blob/master/component-info.yaml',
    );

    if (!componentYaml) {
      errorApi.post(
        new Error(
          `Failed to find component-info.yaml file in ${job.metadata.remoteUrl}.`,
        ),
      );
      return;
    }

    const {
      entities: [createdEntity],
    } = await catalogApi.addLocation('github', componentYaml);

    setEntity((createdEntity as any) as TemplateEntityV1alpha1);
  };

  if (!loading && !template) {
    errorApi.post(new Error('Template was not found.'));
    return <Navigate to={rootRoute.path} />;
  }

  if (template && !template?.spec?.schema) {
    errorApi.post(
      new Error(
        'Template schema is corrupted, please check the template.yaml file.',
      ),
    );
    return <Navigate to={rootRoute.path} />;
  }

  return (
    <Page>
      <Header
        pageTitleOverride="Create a new component"
        title={
          <>
            Create a new component <Lifecycle alpha shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        {loading && <LinearProgress data-testid="loading-progress" />}
        {jobId && (
          <JobStatusModal
            onComplete={handleCreateComplete}
            jobId={jobId}
            onClose={handleClose}
            entity={entity}
          />
        )}
        {template && (
          <InfoCard title={template.metadata.title as string} noPadding>
            <MultistepJsonForm
              formData={formState}
              onChange={handleChange}
              onReset={handleFormReset}
              onFinish={handleCreate}
              steps={[
                {
                  label: 'Fill in template parameters',
                  schema: template.spec.schema,
                },
                {
                  label: 'Choose owner and repo',
                  schema: OWNER_REPO_SCHEMA,
                  customFormats: REPO_FORMAT,
                },
              ]}
            />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
