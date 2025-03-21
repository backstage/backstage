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
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
      <Grid xs={12} item>
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
      TransitionProps={{ unmountOnExit: true }}
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
          <StructuredMetadataTable
            metadata={customResource.status}
            options={{ nestedValuesAsYaml: true }}
          />
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
    >
      {customResources.map((cr, i) => (
        <Grid container item key={i} xs>
          <Grid item xs>
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
