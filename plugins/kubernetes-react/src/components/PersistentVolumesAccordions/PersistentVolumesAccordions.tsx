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
import type { V1PersistentVolume } from '@kubernetes/client-node';
import { PersistentVolumesDrawer } from './PersistentVolumesDrawer.tsx';
import { GroupedResponsesContext } from '../../hooks';
import { getPersistentVolumeType } from '../../utils/persistentVolumes.ts';
import {
  StatusError,
  StatusOK,
  StatusPending,
  StructuredMetadataTable,
} from '@backstage/core-components';

type PersistentVolumeSummaryProps = {
  persistentVolume: V1PersistentVolume;
};

const PersistentVolumeSummary = ({
  persistentVolume,
}: PersistentVolumeSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={8} item>
        <PersistentVolumesDrawer persistentVolume={persistentVolume} />
      </Grid>

      <Grid item>
        <Typography variant="subtitle2">
          {persistentVolume.status?.phase === 'Bound' && (
            <StatusOK>Bound</StatusOK>
          )}
          {persistentVolume.status?.phase === 'Available' && (
            <StatusPending>Available</StatusPending>
          )}
          {persistentVolume.status?.phase === 'Released' && (
            <StatusPending>Released</StatusPending>
          )}
          {persistentVolume.status?.phase === 'Pending' && (
            <StatusPending>Pending</StatusPending>
          )}
          {persistentVolume.status?.phase === 'Failed' && (
            <StatusError>Failed</StatusError>
          )}
        </Typography>
        <Typography variant="subtitle2">
          Size: {persistentVolume.spec?.capacity?.storage ?? 'N/A'}
        </Typography>
        {persistentVolume.spec?.csi?.driver && (
          <Typography variant="subtitle2">
            Type: {getPersistentVolumeType(persistentVolume.spec?.csi?.driver)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

type PersistentVolumesCardProps = {
  persistentVolume: V1PersistentVolume;
};

const PersistentVolumeCard = ({
  persistentVolume,
}: PersistentVolumesCardProps) => {
  const metadata: any = {};

  metadata.size = persistentVolume.spec?.capacity?.storage;
  metadata.access_modes = persistentVolume.spec?.accessModes;
  metadata.driver = persistentVolume.spec?.csi?.driver;
  metadata.volume_handle = persistentVolume.spec?.csi?.volumeHandle;
  metadata.mount_options = persistentVolume.spec?.mountOptions;
  metadata.claim_ref_name = persistentVolume.spec?.claimRef?.name;
  metadata.claim_ref_namespace = persistentVolume.spec?.claimRef?.namespace;

  return (
    <StructuredMetadataTable
      metadata={{
        size: persistentVolume.spec?.capacity?.storage,
        access_modes: persistentVolume.spec?.accessModes,
        driver: persistentVolume.spec?.csi?.driver,
        volume_handle: persistentVolume.spec?.csi?.volumeHandle,
        mount_options: persistentVolume.spec?.mountOptions,
        claim_ref_name: persistentVolume.spec?.claimRef?.name,
        claim_ref_namespace: persistentVolume.spec?.claimRef?.namespace,
        ...metadata,
      }}
      options={{ nestedValuesAsYaml: true }}
    />
  );
};

export type PersistentVolumesAccordionsProps = {};

type PersistentVolumesAccordionProps = {
  persistentVolume: V1PersistentVolume;
};

const PersistentVolumesAccordion = ({
  persistentVolume,
}: PersistentVolumesAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <PersistentVolumeSummary persistentVolume={persistentVolume} />
      </AccordionSummary>
      <AccordionDetails>
        <PersistentVolumeCard persistentVolume={persistentVolume} />
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
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {groupedResponses.persistentVolumes.map((persistentVolume, i) => (
          <Grid item key={i} xs>
            <PersistentVolumesAccordion persistentVolume={persistentVolume} />
          </Grid>
        ))}
      </Grid>
    );
  };
