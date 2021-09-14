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

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Entity } from '@backstage/catalog-model';
import { updateMetadata } from '../../util/dbRequests';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { ProjectDialog } from '../ProjectDialog';
import { BazaarProject, FormValues } from '../../util/types';

type Props = {
  entity: Entity;
  bazaarProject: BazaarProject;
  setBazaarProject: Dispatch<SetStateAction<BazaarProject>>;
  open: boolean;
  handleClose: () => void;
  isAddForm: boolean;
};

export const EditProjectDialog = ({
  entity,
  bazaarProject,
  setBazaarProject,
  open,
  handleClose,
}: Props) => {
  const baseUrl = useApi(configApiRef)
    .getConfig('backend')
    .getString('baseUrl');

  const [defaultValues, setDefaultValues] = useState<FormValues>({
    announcement: bazaarProject.announcement,
    status: bazaarProject.status,
  });

  useEffect(() => {
    setDefaultValues({
      announcement: bazaarProject.announcement,
      status: bazaarProject.status,
    });
  }, [bazaarProject]);

  const handleSave: any = async (getValues: any, _: any) => {
    const formValues = getValues();

    const updateResponse = await updateMetadata(
      entity!,
      entity.metadata.name,
      formValues.announcement,
      formValues.status,
      baseUrl,
    );

    if (updateResponse.status === 'ok')
      setBazaarProject((oldProject: BazaarProject) => {
        return {
          ...oldProject,
          announcement: formValues.announcement,
          status: formValues.status,
        };
      });
    handleClose();
  };

  return (
    <ProjectDialog
      title="Edit project"
      handleSave={handleSave}
      isAddForm={false}
      defaultValues={defaultValues}
      open={open}
      handleClose={handleClose}
    />
  );
};
