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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from '@material-ui/lab';
import { HeaderTabs } from '@backstage/core';
import { Dialog, IconButton } from '@material-ui/core';
import { default as CloseButton } from '@material-ui/icons/Close';
import { useEntityDialogStyles as useStyles } from '../../utils/styles';
import { Entity, Maybe } from '../../types';
import {
  EntityDialogTable,
  EntityDialogTableOptions,
} from './EntityDialogTable';
import { breakdownTabOf } from '../../utils/charts';

type EntityDialogProps = {
  open: boolean;
  entity: Entity;
  options?: EntityDialogTableOptions;
  onClose: () => void;
};

export const EntityDialog = ({
  open,
  entity,
  options = {},
  onClose,
}: EntityDialogProps) => {
  const classes = useStyles();
  const [label, setLabel] = useState<Maybe<string>>(null);
  const [error, setError] = useState<Maybe<Error>>(null);
  const labels = useMemo(() => Object.keys(entity.entities), [entity]);
  const tabs = useMemo(() => labels.map(breakdownTabOf), [labels]);

  const onHeaderTabsChange = useCallback(index => setLabel(labels[index]), [
    labels,
  ]);

  useEffect(() => {
    function loadFirstSubEntityLabel() {
      if (labels.length) {
        setLabel(labels[0]);
      } else {
        setError(
          new Error(
            `Expected ${entity.id} to have sub-entities but received none.`,
          ),
        );
      }
    }
    loadFirstSubEntityLabel();
  }, [entity, labels]);

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Dialog open={open} onClose={onClose} scroll="body" fullWidth maxWidth="lg">
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseButton />
      </IconButton>
      <HeaderTabs tabs={tabs} onChange={onHeaderTabsChange} />
      <EntityDialogTable
        label={label || 'Unknown'}
        entity={entity}
        options={options}
      />
    </Dialog>
  );
};
