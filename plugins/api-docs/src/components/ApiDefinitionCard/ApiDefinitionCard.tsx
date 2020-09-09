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

import { ApiEntity } from '@backstage/catalog-model';
import { InfoCard } from '@backstage/core';
import React from 'react';
import { ApiDefinitionWidget } from '../ApiDefinitionWidget';
import { Alert } from '@material-ui/lab';

type Props = {
  title?: string;
  apiEntity?: ApiEntity;
};

export const ApiDefinitionCard = ({ title, apiEntity }: Props) => {
  if (!apiEntity) {
    return (
      <InfoCard title={title}>
        <Alert severity="error">Could not fetch the API</Alert>
      </InfoCard>
    );
  }

  return (
    <InfoCard title={title} subheader={apiEntity.spec.type}>
      <ApiDefinitionWidget
        type={apiEntity.spec.type}
        definition={apiEntity.spec.definition}
      />
    </InfoCard>
  );
};
