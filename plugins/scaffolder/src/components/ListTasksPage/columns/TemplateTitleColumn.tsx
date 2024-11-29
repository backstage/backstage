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
import { useApi } from '@backstage/core-plugin-api';
import React from 'react';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import useAsync from 'react-use/esm/useAsync';
import { parseEntityRef } from '@backstage/catalog-model';
import { EntityRefLink } from '@backstage/plugin-catalog-react';

export const TemplateTitleColumn = ({ entityRef }: { entityRef?: string }) => {
  const scaffolder = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () => scaffolder.getTemplateParameterSchema(entityRef || ''),
    [scaffolder, entityRef],
  );

  if (loading || error || !entityRef) {
    return null;
  }

  return (
    <EntityRefLink entityRef={parseEntityRef(entityRef)} title={value?.title} />
  );
};
