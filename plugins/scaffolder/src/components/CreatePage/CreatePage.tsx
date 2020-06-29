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
import React, { useState } from 'react';
import useStaleWhileRevalidate from 'swr';
import { useParams } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import {
  useApi,
  Page,
  Content,
  Header,
  Lifecycle,
  InfoCard,
} from '@backstage/core';
import {
  TemplateEntityV1alpha1,
  ComponentEntityV1alpha1,
} from '@backstage/catalog-model';
import { IChangeEvent } from '@rjsf/core';
import { JobStatusModal } from '../JobStatusModal';
import { scaffolderApiRef } from '../../api';
import { MultistepJsonForm } from '../MultistepJsonForm';
import { Job } from '../JobStatusModal/types';
export const CreatePage = () => {
  const catalogApi = useApi(catalogApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const {
    data: [template] = [] as TemplateEntityV1alpha1[],
    isValidating,
  } = useStaleWhileRevalidate(
    `templates/${templateName}`,
    async () =>
      (catalogApi.getEntities({
        kind: 'Template',
        'metadata.name': templateName,
      }) as any) as Promise<TemplateEntityV1alpha1[]>,
  );
  const [formState, setFormState] = useState({});

  const handleFormReset = () => setFormState({});
  const handleChange = (e: IChangeEvent) =>
    setFormState({ ...formState, ...e.formData });

  const [jobId, setJobId] = useState<string | null>(null);
  const handleClose = () => setJobId(null);

  if (!template && isValidating) return <LinearProgress />;
  if (!template || !template?.spec?.schema) return null;

  const handleCreate = async () => {
    const job = await scaffolderApi.scaffold(template, formState);
    setJobId(job);
  };

  const [entity, setEntity] = React.useState<ComponentEntityV1alpha1 | null>(
    null,
  );
  const handleCreateComplete = async (job: Job) => {
    console.log('DEBUG:', { job });
    const {
      entities: [createdEntity],
    } = await catalogApi.addLocation(
      'github',
      job.metadata.remoteUrl.replace(
        /\.git$/,
        '/blob/master/component-info.yaml',
      ),
    );
    setEntity(createdEntity);
  };
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
        {jobId && (
          <JobStatusModal
            onComplete={handleCreateComplete}
            jobId={jobId}
            onClose={handleClose}
            entity={entity}
          />
        )}
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
                schema: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  required: ['repo', 'owner'],
                  properties: {
                    owner: {
                      type: 'string',
                      title: 'Owner',
                      description: 'Who is going to own this component',
                    },
                    repo: {
                      type: 'string',
                      title: 'GitHub repository',
                      description: 'Repo where to upload created component',
                    },
                  },
                },
              },
            ]}
          />
        </InfoCard>
      </Content>
    </Page>
  );
};
