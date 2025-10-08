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
import { useContext } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { V1PersistentVolumeClaim } from '@kubernetes/client-node';
import { GroupedResponsesContext } from '../../hooks';
import { StructuredMetadataTable } from '@backstage/core-components';
import { PersistentVolumeClaimsDrawer } from './PersistentVolumeClaimsDrawer.tsx';

type PersistentVolumeClaimSummaryProps = {
  persistentVolumeClaim: V1PersistentVolumeClaim;
};

const PersistentVolumeClaimsSummary = ({
  persistentVolumeClaim,
}: PersistentVolumeClaimSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={8} item>
        <PersistentVolumeClaimsDrawer
          persistentVolumeClaim={persistentVolumeClaim}
        />
      </Grid>

      <Grid item>
        <Typography variant="subtitle2">Data Count:</Typography>
      </Grid>
    </Grid>
  );
};

type PersistentVolumeClaimsCardProps = {
  persistentVolumeClaim: V1PersistentVolumeClaim;
};

const PersistentVolumeClaimClaimCard = ({
  persistentVolumeClaim,
}: PersistentVolumeClaimsCardProps) => {
  const metadata: any = {};

  metadata.phase = persistentVolumeClaim.status?.phase;

  return (
    <StructuredMetadataTable
      metadata={{
        ...metadata,
      }}
      options={{ nestedValuesAsYaml: true }}
    />
  );
};

export type PersistentVolumeClaimsAccordionsProps = {};

type PersistentVolumeClaimsAccordionProps = {
  persistentVolumeClaim: V1PersistentVolumeClaim;
};

const PersistentVolumeClaimsAccordion = ({
  persistentVolumeClaim,
}: PersistentVolumeClaimsAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PersistentVolumeClaimsSummary
          persistentVolumeClaim={persistentVolumeClaim}
        />
      </AccordionSummary>
      <AccordionDetails>
        <PersistentVolumeClaimClaimCard
          persistentVolumeClaim={persistentVolumeClaim}
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
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {groupedResponses.persistentVolumeClaims.map(
          (persistentVolumeClaim, i) => (
            <Grid item key={i} xs>
              <PersistentVolumeClaimsAccordion
                persistentVolumeClaim={persistentVolumeClaim}
              />
            </Grid>
          ),
        )}
      </Grid>
    );
  };
