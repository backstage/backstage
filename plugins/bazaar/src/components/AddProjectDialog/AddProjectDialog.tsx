/*
 * Copyright 2021 The Backstage Authors
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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { UseFormReset, UseFormGetValues } from 'react-hook-form';
import { useApi } from '@backstage/core-plugin-api';
import { ProjectDialog } from '../ProjectDialog';
import { ProjectSelector } from '../ProjectSelector';
import { BazaarProject, FormValues, Size, Status } from '../../types';
import { bazaarApiRef } from '../../api';

type Props = {
  catalogEntities: Entity[];
  open: boolean;
  handleClose: () => void;
  fetchBazaarProjects: () => Promise<BazaarProject[]>;
  fetchCatalogEntities: () => Promise<Entity[]>;
};

export const AddProjectDialog = ({
  catalogEntities,
  open,
  handleClose,
  fetchBazaarProjects,
  fetchCatalogEntities,
}: Props) => {
  const bazaarApi = useApi(bazaarApiRef);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const defaultValues = {
    name: '',
    title: 'Add project',
    community: '',
    description: '',
    status: 'proposed' as Status,
    size: 'medium' as Size,
    responsible: '',
    startDate: null,
    endDate: null,
  };

  const handleEntityClick = (entity: Entity) => {
    setSelectedEntity(entity);
  };

  const handleSubmit: (
    getValues: UseFormGetValues<FormValues>,
    reset: UseFormReset<FormValues>,
  ) => Promise<void> = async (
    getValues: UseFormGetValues<FormValues>,
    reset: UseFormReset<FormValues>,
  ) => {
    const formValues = getValues();
    const response = await bazaarApi.addProject({
      ...formValues,
      entityRef: selectedEntity ? stringifyEntityRef(selectedEntity) : null,
      startDate: formValues.startDate ?? null,
      endDate: formValues.endDate ?? null,
    } as BazaarProject);

    if (response.status === 'ok') {
      fetchBazaarProjects();
      fetchCatalogEntities();
    }

    handleClose();
    reset(defaultValues);
  };

  return (
    <ProjectDialog
      handleSave={handleSubmit}
      title="Add project"
      isAddForm
      defaultValues={defaultValues}
      open={open}
      projectSelector={
        <ProjectSelector
          onChange={handleEntityClick}
          catalogEntities={catalogEntities || []}
          disableClearable={false}
          defaultValue={null}
          label="Select a project"
        />
      }
      handleClose={handleClose}
    />
  );
};
