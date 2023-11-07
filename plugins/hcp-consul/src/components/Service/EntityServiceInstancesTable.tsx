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
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  CONSUL_CLUSTER_RESOUCR_NAME_ANNOTATION,
  CONSUL_NAMESPACE_ANNOTATION,
  CONSUL_PARTITION_ANNOTATION,
  CONSUL_NAME_ANNOTATION,
  isHcpConsulServiceAvailable,
} from '../../annotations';

import { Service } from '../../api/api';
import { ServiceInstancesComponent } from './ServiceInstancesComponent';

const ServiceInstancesTable = () => {
  // Wait on entity
  const { entity } = useEntity();

  // Get plugin attributes
  const service_name = entity.metadata.annotations?.[CONSUL_NAME_ANNOTATION];
  const clusterResourceName =
    entity.metadata.annotations?.[CONSUL_CLUSTER_RESOUCR_NAME_ANNOTATION];
  const partition =
    entity.metadata.annotations?.[CONSUL_PARTITION_ANNOTATION] ?? '';
  const namespace =
    entity.metadata.annotations?.[CONSUL_NAMESPACE_ANNOTATION] ?? '';

  const service = {
    name: service_name,
    cluster_resource_name: clusterResourceName,
    namespace: namespace,
    partition: partition,
  } as Service;

  return <ServiceInstancesComponent service={service} />;
};

export const EntityServiceInstancesTable = () => {
  // Wait on entity
  const { entity } = useEntity();

  // Check that attributes are available
  if (!isHcpConsulServiceAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState
        annotation={[
          CONSUL_CLUSTER_RESOUCR_NAME_ANNOTATION,
          CONSUL_NAMESPACE_ANNOTATION,
          CONSUL_PARTITION_ANNOTATION,
          CONSUL_NAME_ANNOTATION,
        ]}
      />
    );
  }

  return <ServiceInstancesTable />;
};
