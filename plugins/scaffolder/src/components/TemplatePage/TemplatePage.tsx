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
import React, { useState, useCallback } from 'react';
import { Navigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { scaffolderApiRef } from '../../api';
import { rootRoute } from '../../routes';
import { Job } from '../../types';
import { JobStatusModal } from '../JobStatusModal';
import { MultistepJsonForm } from '../MultistepJsonForm';

const useTemplate = (
  templateName: string,
  catalogApi: typeof catalogApiRef.T,
) => {
  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: 'Template', 'metadata.name': templateName },
    });
    return response.items as TemplateEntityV1alpha1[];
  });
  return { template: value?.[0], loading, error };
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
    access: {
      type: 'string' as const,
      title: 'Access',
      description: 'Who should have access, in org/team or user format',
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
  const handleChange = useCallback(
    (e: IChangeEvent) => setFormState({ ...formState, ...e.formData }),
    [setFormState, formState],
  );

  const [jobId, setJobId] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      const job = await scaffolderApi.scaffold(templateName, formState);
      setJobId(job);
    } catch (e) {
      errorApi.post(e);
    }
  };

  const [entity, setEntity] = React.useState<TemplateEntityV1alpha1 | null>(
    null,
  );

  const handleCreateComplete = async (job: Job) => {
    if (!job.metadata.catalogInfoUrl) {
      errorApi.post(
        new Error(
          `Failed to find catalog-info.yaml file in ${job.metadata.remoteUrl}.`,
        ),
      );
      return;
    }

    const {
      entities: [createdEntity],
    } = await catalogApi.addLocation({ target: job.metadata.catalogInfoUrl });

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
    <Page themeId="home">
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
            entity={entity}
          />
        )}
        {template && (
          <InfoCard title={template.metadata.title} noPadding>
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
