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

import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DefaultCustomResourceDrawer } from './DefaultCustomResourceDrawer';
import { StructuredMetadataTable } from '@backstage/core-components';

type DefaultCustomResourceAccordionsProps = {
  customResources: any[];
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type DefaultCustomResourceAccordionProps = {
  customResource: any;
  customResourceName: string;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
};

type DefaultCustomResourceSummaryProps = {
  customResource: any;
  customResourceName: string;
  children?: React.ReactNode;
};

const DefaultCustomResourceSummary = ({
  customResource,
  customResourceName,
}: DefaultCustomResourceSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={0}
    >
      <Grid xs={12}>
        <DefaultCustomResourceDrawer
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </Grid>
    </Grid>
  );
};

const DefaultCustomResourceAccordion = ({
  customResource,
  customResourceName,
  defaultExpanded,
}: DefaultCustomResourceAccordionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      slotProps={{ transition: { unmountOnExit: true } }}
      variant="outlined"
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <DefaultCustomResourceSummary
          customResource={customResource}
          customResourceName={customResourceName}
        />
      </AccordionSummary>
      <AccordionDetails>
        {Object.prototype.hasOwnProperty.call(customResource, 'status') && (
          <StructuredMetadataTable metadata={customResource.status} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const DefaultCustomResourceAccordions = ({
  customResources,
  customResourceName,
  defaultExpanded = false,
}: DefaultCustomResourceAccordionsProps) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      xs={12}
    >
      {customResources.map((cr, i) => (
        <Grid container key={i} xs={12}>
          <Grid xs={12}>
            <DefaultCustomResourceAccordion
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
