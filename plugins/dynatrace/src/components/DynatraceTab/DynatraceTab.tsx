/*
 * Copyright 2022 The Backstage Authors
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
import { Grid } from '@material-ui/core';
import {
  Page,
  Content,
  MissingAnnotationEmptyState,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ProblemsList } from '../Problems/ProblemsList';
import { SyntheticsCard } from '../Synthetics/SyntheticsCard';
import { isDynatraceAvailable } from '../../plugin';
import {
  DYNATRACE_ID_ANNOTATION,
  DYNATRACE_SYNTHETICS_ANNOTATION,
} from '../../constants';

export const DynatraceTab = () => {
  const { entity } = useEntity();

  if (!isDynatraceAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={DYNATRACE_ID_ANNOTATION} />;
  }

  const dynatraceEntityId: string =
    entity?.metadata.annotations?.[DYNATRACE_ID_ANNOTATION]!;

  const syntheticsIds: string =
    entity?.metadata.annotations?.[DYNATRACE_SYNTHETICS_ANNOTATION]!;

  return (
    <Page themeId="tool">
      <Content>
        <Grid container spacing={2}>
          {dynatraceEntityId ? (
            <Grid item xs={12} lg={12}>
              <ProblemsList dynatraceEntityId={dynatraceEntityId} />
            </Grid>
          ) : (
            ''
          )}
          {syntheticsIds
            ?.split(/[ ,]/)
            .filter(Boolean)
            .map(id => {
              return (
                <Grid item xs={12} lg={12}>
                  <SyntheticsCard syntheticsId={id} />
                </Grid>
              );
            })}
        </Grid>
      </Content>
    </Page>
  );
};
