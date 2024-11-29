/*
 * Copyright 2020 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import {
  useEntity,
  MissingAnnotationEmptyState,
} from '@backstage/plugin-catalog-react';
import { Route, Routes } from 'react-router-dom';
import { KubernetesContent } from './KubernetesContent';
import Button from '@material-ui/core/Button';

const KUBERNETES_ANNOTATION = 'backstage.io/kubernetes-id';
const KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION =
  'backstage.io/kubernetes-label-selector';

export const isKubernetesAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[KUBERNETES_ANNOTATION]) ||
  Boolean(
    entity.metadata.annotations?.[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION],
  );

export const Router = (props: { refreshIntervalMs?: number }) => {
  const { entity } = useEntity();

  const kubernetesAnnotationValue =
    entity.metadata.annotations?.[KUBERNETES_ANNOTATION];

  const kubernetesLabelSelectorQueryAnnotationValue =
    entity.metadata.annotations?.[KUBERNETES_LABEL_SELECTOR_QUERY_ANNOTATION];

  if (
    kubernetesAnnotationValue ||
    kubernetesLabelSelectorQueryAnnotationValue
  ) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <KubernetesContent
              entity={entity}
              refreshIntervalMs={props.refreshIntervalMs}
            />
          }
        />
      </Routes>
    );
  }

  return (
    <>
      <MissingAnnotationEmptyState annotation={KUBERNETES_ANNOTATION} />
      <h1>
        Or use a label selector query, which takes precedence over the previous
        annotation.
      </h1>
      <Button
        variant="contained"
        color="primary"
        href="https://backstage.io/docs/features/kubernetes/configuration#surfacing-your-kubernetes-components-as-part-of-an-entity"
      >
        Read Kubernetes Plugin Docs
      </Button>
    </>
  );
};
