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

import { ReactNode, useContext } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { V1PersistentVolume } from '@kubernetes/client-node';
import { PersistentVolumesTable } from './PersistentVolumesTable';
import { GroupedResponsesContext } from '../../hooks';
import { StatusOK, StatusError } from '@backstage/core-components';

type PersistentVolumesAccordionsProps = {
  children?: ReactNode;
};

type PersistentVolumesAccordionProps = {
  persistentVolumes: V1PersistentVolume[];
  children?: ReactNode;
};

type PersistentVolumesSummaryProps = {
  numberOfPersistentVolumes: number;
  numberOfBoundVolumes: number;
  numberOfFailedVolumes: number;
  children?: ReactNode;
};

const PersistentVolumesSummary = ({
  numberOfPersistentVolumes,
  numberOfBoundVolumes,
  numberOfFailedVolumes,
}: PersistentVolumesSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={4} item>
        <Typography variant="body1">
          <strong>PersistentVolumes</strong>
        </Typography>
      </Grid>
      <Grid
        item
        container
        xs={8}
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={0}
      >
        <Grid item>
          <StatusOK>{numberOfPersistentVolumes} volumes</StatusOK>
        </Grid>
        <Grid item>
          <StatusOK>{numberOfBoundVolumes} bound</StatusOK>
        </Grid>
        {numberOfFailedVolumes > 0 && (
          <Grid item>
            <StatusError>
              {numberOfFailedVolumes} volume
              {numberOfFailedVolumes > 1 ? 's' : ''} failed
            </StatusError>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const PersistentVolumesAccordion = ({
  persistentVolumes,
}: PersistentVolumesAccordionProps) => {
  const boundVolumes = persistentVolumes.filter(
    pv => pv.status?.phase === 'Bound',
  );
  const failedVolumes = persistentVolumes.filter(
    pv => pv.status?.phase === 'Failed',
  );

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PersistentVolumesSummary
          numberOfPersistentVolumes={persistentVolumes.length}
          numberOfBoundVolumes={boundVolumes.length}
          numberOfFailedVolumes={failedVolumes.length}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PersistentVolumesTable persistentVolumes={persistentVolumes} />
      </AccordionDetails>
    </Accordion>
  );
};

export const PersistentVolumesAccordions =
  ({}: PersistentVolumesAccordionsProps) => {
    const groupedResponses = useContext(GroupedResponsesContext);

    return (
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid container item xs>
          <Grid item xs>
            <PersistentVolumesAccordion
              persistentVolumes={groupedResponses.persistentVolumes}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };
