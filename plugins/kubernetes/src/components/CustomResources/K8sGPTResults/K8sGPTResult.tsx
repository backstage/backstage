/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { K8sGPTResultDrawer } from './K8sGPTResultsDrawer';
import { StructuredMetadataTable } from '@backstage/core-components';
import { Typography } from '@material-ui/core';

type K8sGPTResultAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type K8sGPTResultAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type K8sGPTResultSummaryProps = {
  customResource: any;
  customResourceName: string;
  children?: React.ReactNode;
};

const K8sGPTResultSummary = ({
  customResource,
  customResourceName,
}: K8sGPTResultSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={12} item>
        <K8sGPTResultDrawer
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </Grid>
    </Grid>
  );
};

const K8sGPTResultAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded,
}: K8sGPTResultAccordionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      TransitionProps={{ unmountOnExit: true }}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <K8sGPTResultSummary
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
          K8sGPT found this issue: {customResource.spec.details}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export const K8sGPTResultAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false,
}: K8sGPTResultAccordionsProps) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {customResources.map((cr, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
            <K8sGPTResultAccordion
              defaultExpanded={defaultExpanded}
              customResource={cr}
              customResourceName={customResourceName}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};
