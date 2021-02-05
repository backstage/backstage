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
import {
  catalogApiRef,
  entityRoute,
  entityRouteParams,
} from '@backstage/plugin-catalog-react';
import { LinearProgress } from '@material-ui/core';
import { IChangeEvent } from '@rjsf/core';
import parseGitUrl from 'git-url-parse';
import React, { useCallback, useState } from 'react';
import { generatePath, Navigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { scaffolderApiRef } from '../../api';
import { rootRoute } from '../../routes';
import { useJobPolling } from '../hooks/useJobPolling';
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
      type: 'string' as const,
      title: 'Store path',
      description:
        'A full URL to the repository that should be created. e.g https://github.com/backstage/new-repo',
    },
    access: {
      type: 'string' as const,
      title: 'Access',
      description: 'Who should have access, in org/team or user format',
    },
  },
};
export const TemplatePage = () => {
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const [catalogLink, setCatalogLink] = useState<string | undefined>();
  const { template, loading } = useTemplate(templateName, catalogApi);
  const [formState, setFormState] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const handleFormReset = () => setFormState({});
  const handleChange = useCallback(
    (e: IChangeEvent) => setFormState({ ...formState, ...e.formData }),
    [setFormState, formState],
  );

  const [jobId, setJobId] = useState<string | null>(null);
  const job = useJobPolling(jobId, async jobItem => {
    if (!jobItem.metadata.catalogInfoUrl) {
      errorApi.post(
        new Error(`No catalogInfoUrl returned from the scaffolder`),
      );
      return;
    }

    try {
      const {
        entities: [createdEntity],
      } = await catalogApi.addLocation({
        target: jobItem.metadata.catalogInfoUrl,
      });

      const resolvedPath = generatePath(
        `/catalog/${entityRoute.path}`,
        entityRouteParams(createdEntity),
      );

      setCatalogLink(resolvedPath);
    } catch (ex) {
      errorApi.post(
        new Error(
          `Something went wrong trying to add the new 'catalog-info.yaml' to the catalog`,
        ),
      );
    }
  });

  const handleCreate = async () => {
    try {
      const id = await scaffolderApi.scaffold(templateName, formState);
      setJobId(id);
      setModalOpen(true);
    } catch (e) {
      errorApi.post(e);
    }
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
        <JobStatusModal
          job={job}
          toCatalogLink={catalogLink}
          open={modalOpen}
          onModalClose={() => setModalOpen(false)}
        />
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
                  validate: (formData, errors) => {
                    const { storePath } = formData;
                    try {
                      const parsedUrl = parseGitUrl(storePath);

                      if (
                        !parsedUrl.resource ||
                        !parsedUrl.owner ||
                        !parsedUrl.name
                      ) {
                        if (parsedUrl.resource === 'dev.azure.com') {
                          errors.storePath.addError(
                            "The store path should be formatted like https://dev.azure.com/{org}/{project}/_git/{repo} for Azure URL's",
                          );
                        } else {
                          errors.storePath.addError(
                            'The store path should be a complete Git URL to the new repository location. For example: https://github.com/{owner}/{repo}',
                          );
                        }
                      }
                    } catch (ex) {
                      errors.storePath.addError(
                        `Failed validation of the store pathn with message ${ex.message}`,
                      );
                    }

                    return errors;
                  },
                },
              ]}
            />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
