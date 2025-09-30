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
import type { V1ConfigMap } from '@kubernetes/client-node';
import { ConfigmapsDrawer } from './ConfigmapsDrawer.tsx';
import { GroupedResponsesContext } from '../../hooks';
import { StructuredMetadataTable } from '@backstage/core-components';

type ConfigmapSummaryProps = {
  configmap: V1ConfigMap;
};

const ConfigmapSummary = ({ configmap }: ConfigmapSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={8} item>
        <ConfigmapsDrawer configmap={configmap} />
      </Grid>

      <Grid item>
        <Typography variant="subtitle2">
          Data Count: {configmap.data ? Object.keys(configmap.data).length : 0}
        </Typography>
      </Grid>
    </Grid>
  );
};

type ConfigmapsCardProps = {
  configmap: V1ConfigMap;
};

const ConfigmapCard = ({ configmap }: ConfigmapsCardProps) => {
  const metadata: any = {};

  metadata.data = configmap.data;

  return (
    <StructuredMetadataTable
      metadata={{
        ...metadata,
      }}
      options={{ nestedValuesAsYaml: true }}
    />
  );
};

export type ConfigmapsAccordionsProps = {};

type ConfigmapsAccordionProps = {
  configmap: V1ConfigMap;
};

const ConfigmapsAccordion = ({ configmap }: ConfigmapsAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ConfigmapSummary configmap={configmap} />
      </AccordionSummary>
      <AccordionDetails>
        <ConfigmapCard configmap={configmap} />
      </AccordionDetails>
    </Accordion>
  );
};

export const ConfigmapsAccordions = ({}: ConfigmapsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.configMaps.map((configmap, i) => (
        <Grid item key={i} xs>
          <ConfigmapsAccordion configmap={configmap} />
        </Grid>
      ))}
    </Grid>
  );
};
