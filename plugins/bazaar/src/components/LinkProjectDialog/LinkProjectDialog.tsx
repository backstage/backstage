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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { ProjectSelector } from '../ProjectSelector';
import { CustomDialogTitle } from '../CustomDialogTitle';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

import { bazaarApiRef } from '../../api';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

import { BazaarProject } from '../../types';

type Props = {
  openProjectSelector: boolean;
  handleProjectSelectorClose: () => void;
  catalogEntities: Entity[];
  bazaarProject: BazaarProject;
  fetchBazaarProject: () => Promise<BazaarProject | null>;
  initEntity: Entity;
};

const useStyles = makeStyles({
  content: { padding: '0 1rem' },
});

export const LinkProjectDialog = ({
  openProjectSelector,
  handleProjectSelectorClose,
  catalogEntities,
  bazaarProject,
  fetchBazaarProject,
  initEntity,
}: Props) => {
  const classes = useStyles();
  const bazaarApi = useApi(bazaarApiRef);
  const alertApi = useApi(alertApiRef);
  const [selectedEntity, setSelectedEntity] = useState(initEntity);
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const handleEntityClick = (entity: Entity) => {
    setSelectedEntity(entity);
    setSelectedEntityName(entity.metadata.name);
  };

  const handleSubmit = async () => {
    handleProjectSelectorClose();

    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject,
      entityRef: stringifyEntityRef(selectedEntity!),
    });
    if (updateResponse.status === 'ok') {
      fetchBazaarProject();
      alertApi.post({
        message: `linked entity '${selectedEntityName}' to the project ${bazaarProject.title}`,
        severity: 'success',
        display: 'transient',
      });
    }
  };

  return (
    <Dialog onClose={handleProjectSelectorClose} open={openProjectSelector}>
      <CustomDialogTitle
        id="customized-dialog-title"
        onClose={handleProjectSelectorClose}
      >
        Select entity
      </CustomDialogTitle>
      <DialogContent className={classes.content} dividers>
        <ProjectSelector
          label=""
          onChange={handleEntityClick}
          catalogEntities={catalogEntities || []}
          disableClearable
          defaultValue={catalogEntities[0] || null}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} color="primary" type="submit">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
