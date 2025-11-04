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
import type { V1PersistentVolumeClaim } from '@kubernetes/client-node';
import { PersistentVolumeClaimsTable } from './PersistentVolumeClaimsTable';
import { GroupedResponsesContext } from '../../hooks';
import { StatusOK, StatusError } from '@backstage/core-components';

type PersistentVolumeClaimsAccordionsProps = {
  children?: ReactNode;
};

type PersistentVolumeClaimsAccordionProps = {
  persistentVolumeClaims: V1PersistentVolumeClaim[];
  children?: ReactNode;
};

type PersistentVolumeClaimsSummaryProps = {
  numberOfPersistentVolumeClaims: number;
  numberOfBoundClaims: number;
  numberOfLostClaims: number;
  children?: ReactNode;
};

const PersistentVolumeClaimsSummary = ({
  numberOfPersistentVolumeClaims,
  numberOfBoundClaims,
  numberOfLostClaims,
}: PersistentVolumeClaimsSummaryProps) => {
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
          <strong>PersistentVolumeClaims</strong>
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
          <StatusOK>{numberOfPersistentVolumeClaims} claims</StatusOK>
        </Grid>
        <Grid item>
          <StatusOK>{numberOfBoundClaims} bound</StatusOK>
        </Grid>
        {numberOfLostClaims > 0 && (
          <Grid item>
            <StatusError>
              {numberOfLostClaims} claim
              {numberOfLostClaims > 1 ? 's' : ''} lost
            </StatusError>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const PersistentVolumeClaimsAccordion = ({
  persistentVolumeClaims,
}: PersistentVolumeClaimsAccordionProps) => {
  const boundClaims = persistentVolumeClaims.filter(
    pvc => pvc.status?.phase === 'Bound',
  );
  const lostClaims = persistentVolumeClaims.filter(
    pvc => pvc.status?.phase === 'Lost',
  );

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PersistentVolumeClaimsSummary
          numberOfPersistentVolumeClaims={persistentVolumeClaims.length}
          numberOfBoundClaims={boundClaims.length}
          numberOfLostClaims={lostClaims.length}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PersistentVolumeClaimsTable
          persistentVolumeClaims={persistentVolumeClaims}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const PersistentVolumeClaimsAccordions =
  ({}: PersistentVolumeClaimsAccordionsProps) => {
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
            <PersistentVolumeClaimsAccordion
              persistentVolumeClaims={groupedResponses.persistentVolumeClaims}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };
