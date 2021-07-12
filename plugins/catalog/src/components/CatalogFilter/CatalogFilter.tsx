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

import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  isWidthDown,
  Typography,
  withWidth,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { PropsWithChildren } from 'react';

interface IProps {
  initiallySelectedFilter?: UserListFilterKind;
  initialFilter?: 'component' | 'api';
}

const CatalogFilterWrapper = withWidth()(
  ({ width, children }: PropsWithChildren<{ width: Breakpoint }>) =>
    isWidthDown('md', width) ? (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    ),
);

export const CatalogFilter = ({
  initiallySelectedFilter = 'owned',
  initialFilter = 'component',
}: IProps) => (
  <CatalogFilterWrapper>
    <Grid container alignContent="flex-start">
      <Grid item xs={12} sm={4} lg={12}>
        <EntityKindPicker initialFilter={initialFilter} hidden />
        <EntityTypePicker />
      </Grid>
      <Grid item xs={12} sm={4} lg={12}>
        <UserListPicker initialFilter={initiallySelectedFilter} />
      </Grid>
      <Grid item xs={12} sm={4} lg={12}>
        <EntityOwnerPicker />
        <EntityLifecyclePicker />
        <EntityTagPicker />
      </Grid>
    </Grid>
  </CatalogFilterWrapper>
);
