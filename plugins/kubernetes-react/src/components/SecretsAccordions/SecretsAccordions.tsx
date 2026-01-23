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
import type { V1Secret } from '@kubernetes/client-node';
import { SecretsDrawer } from './SecretsDrawer.tsx';
import { GroupedResponsesContext } from '../../hooks';
import { StructuredMetadataTable } from '@backstage/core-components';

type SecretSummaryProps = {
  secret: V1Secret;
};

const SecretSummary = ({ secret }: SecretSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={8} item>
        <SecretsDrawer secret={secret} />
      </Grid>

      <Grid item>
        <Typography variant="subtitle2">
          Data Count: {secret.data ? Object.keys(secret.data).length : 0}
        </Typography>
      </Grid>
    </Grid>
  );
};

type SecretsCardProps = {
  secret: V1Secret;
};

const SecretCard = ({ secret }: SecretsCardProps) => {
  const metadata: any = {};

  metadata.data = secret.data;

  return (
    <StructuredMetadataTable
      metadata={{
        ...metadata,
      }}
      options={{ nestedValuesAsYaml: true }}
    />
  );
};

export type SecretsAccordionsProps = {};

type SecretsAccordionProps = {
  secret: V1Secret;
};

const SecretsAccordion = ({ secret }: SecretsAccordionProps) => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SecretSummary secret={secret} />
      </AccordionSummary>
      <AccordionDetails>
        <SecretCard secret={secret} />
      </AccordionDetails>
    </Accordion>
  );
};

export const SecretsAccordions = ({}: SecretsAccordionsProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {groupedResponses.secrets.map((secret, i) => (
        <Grid item key={i} xs>
          <SecretsAccordion secret={secret} />
        </Grid>
      ))}
    </Grid>
  );
};
