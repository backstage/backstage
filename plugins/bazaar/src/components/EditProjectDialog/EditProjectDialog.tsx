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

import React, { useState, useEffect } from 'react';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { ProjectDialog } from '../ProjectDialog';
import { BazaarProject, FormValues } from '../../types';
import { bazaarApiRef } from '../../api';
import { UseFormGetValues } from 'react-hook-form';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Button, makeStyles } from '@material-ui/core';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { bazaarTranslationRef } from '../../translations';

type Props = {
  bazaarProject: BazaarProject;
  openEdit: boolean;
  handleEditClose: () => void;
  handleCardClose?: () => void;
  fetchBazaarProject: () => Promise<BazaarProject | null>;
};

const useStyles = makeStyles({
  button: {
    marginLeft: '0',
    marginRight: 'auto',
  },
  wordBreak: {
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    margin: '-0.25rem 0',
  },
});

export const EditProjectDialog = ({
  bazaarProject,
  openEdit,
  handleEditClose,
  handleCardClose,
  fetchBazaarProject,
}: Props) => {
  const classes = useStyles();
  const bazaarApi = useApi(bazaarApiRef);
  const alertApi = useApi(alertApiRef);
  const [openDelete, setOpenDelete] = useState(false);
  const [defaultValues, setDefaultValues] = useState<FormValues>({
    ...bazaarProject,
    startDate: bazaarProject.startDate ?? null,
    endDate: bazaarProject.endDate ?? null,
  });
  const { t } = useTranslationRef(bazaarTranslationRef);

  const handleDeleteClose = () => {
    setOpenDelete(false);
    handleEditClose();

    if (handleCardClose) handleCardClose();
  };

  const handleDeleteSubmit = async () => {
    await bazaarApi.deleteProject(bazaarProject.id);

    handleDeleteClose();
    fetchBazaarProject();
    alertApi.post({
      message: t('deleted_project').replace('{0}', bazaarProject.title),
      severity: 'success',
      display: 'transient',
    });
  };

  useEffect(() => {
    setDefaultValues({
      ...bazaarProject,
      startDate: bazaarProject.startDate ?? null,
      endDate: bazaarProject.endDate ?? null,
    });
  }, [bazaarProject]);

  const handleEditSubmit: (
    getValues: UseFormGetValues<FormValues>,
  ) => Promise<void> = async (getValues: UseFormGetValues<FormValues>) => {
    const formValues = getValues();

    const updateResponse = await bazaarApi.updateProject({
      ...formValues,
      id: bazaarProject.id,
      entityRef: bazaarProject.entityRef,
      membersCount: bazaarProject.membersCount,
      startDate: formValues?.startDate ?? null,
      endDate: formValues?.endDate ?? null,
    });

    if (updateResponse.status === 'ok') fetchBazaarProject();
    handleEditClose();
    alertApi.post({
      message: t('updated_project').replace('{0}', formValues.title),
      severity: 'success',
      display: 'transient',
    });
  };

  return (
    <div>
      <ConfirmationDialog
        open={openDelete}
        handleClose={handleDeleteClose}
        message={[
          t('confirmation_1'),
          <b key={bazaarProject.id} className={classes.wordBreak}>
            {bazaarProject.title}
          </b>,
          t('confirmation_2'),
        ]}
        type="delete"
        handleSubmit={handleDeleteSubmit}
      />

      <ProjectDialog
        title={t('edit_project')}
        handleSave={handleEditSubmit}
        isAddForm={false}
        defaultValues={defaultValues}
        open={openEdit}
        handleClose={handleEditClose}
        deleteButton={
          <Button
            color="primary"
            type="submit"
            className={classes.button}
            onClick={() => {
              setOpenDelete(true);
            }}
          >
            {t('delete_project_button')}
          </Button>
        }
      />
    </div>
  );
};
