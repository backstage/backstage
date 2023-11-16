/*
 * Copyright 2023 The Backstage Authors
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
import { useConfig } from '../../hooks/useConfig';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useProject } from '../../hooks/useProject';
import { useReleases } from '../../hooks/useReleases';
import { getProjectReferenceAnnotationFromEntity } from '../../utils/getAnnotationFromEntity';
import React from 'react';
import { ReleaseTable } from '../ReleaseTable';

export const EntityPageOctopusDeploy = (props: { defaultLimit?: number }) => {
  const { entity } = useEntity();

  const projectReference = getProjectReferenceAnnotationFromEntity(entity);

  const { environments, releases, loading, error } = useReleases(
    projectReference.projectId,
    props.defaultLimit ?? 3,
    projectReference.spaceId,
  );

  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProject(projectReference.projectId, projectReference.spaceId);

  const { config, loading: configLoading, error: configError } = useConfig();

  return (
    <ReleaseTable
      environments={environments}
      releases={releases}
      project={project}
      config={config}
      loading={loading || projectLoading || configLoading}
      error={error || projectError || configError}
    />
  );
};
