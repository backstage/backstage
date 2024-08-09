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
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { createComponentRef } from '@backstage/frontend-plugin-api';

export const EntityPageDocsEmptyState = () => {
  return <MissingAnnotationEmptyState annotation={[TECHDOCS_ANNOTATION]} />;
};

export const entityPageDocsEmptyStateRef = createComponentRef({
  id: 'techdocs.components.entityPageDocsEmptyState',
});
