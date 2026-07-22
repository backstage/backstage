/*
 * Copyright 2026 The Backstage Authors
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
import { Grid } from '@material-ui/core';
import {
  GoldenPathEntityProvider,
  useGoldenPathFromUrl,
} from '@backstage/plugin-golden-paths-react';
import { ExecutionContentCard } from './ExecutionContentCard';
import {
  ContentCardContainer,
  GridContainerFullHeight,
  RightSideGridContainer,
  RightSideGridItem,
} from './ExecutionContentLayout.styles';
import { ExecutionStatusesWrapper } from './ExecutionStatuses';
import { ExecutionNavigation } from './ExecutionNavigation';
import { useGoldenPathTaskContext } from '../useGoldenPathTaskContext';
import { Alert } from '@material-ui/lab';
import { AsyncEntityProvider } from '@backstage/plugin-catalog-react';

export const ExecutionContentLayout = () => {
  const {
    value: {
      stepIndex,
      mappedStatuses,
      goldenPathTask: {
        status,
        spec: { goldenPathInfo },
      },
    },
  } = useGoldenPathTaskContext();

  const entityProviderProps = useGoldenPathFromUrl({
    name: goldenPathInfo?.entity?.metadata?.name ?? '',
    namespace: goldenPathInfo?.entity?.metadata?.namespace ?? '',
  });

  return (
    <GridContainerFullHeight>
      <Grid item xs={2}>
        <ExecutionStatusesWrapper />
      </Grid>

      <RightSideGridItem>
        <RightSideGridContainer>
          <Grid item>
            <ExecutionNavigation />
          </Grid>
          <ContentCardContainer>
            {status === 'cancelled' &&
            mappedStatuses[stepIndex]?.status !== 'completed' ? (
              <Alert severity="error" style={{ fontWeight: 700 }}>
                Golden Path has been canceled
              </Alert>
            ) : (
              <AsyncEntityProvider {...entityProviderProps}>
                <GoldenPathEntityProvider>
                  <ExecutionContentCard />
                </GoldenPathEntityProvider>
              </AsyncEntityProvider>
            )}
          </ContentCardContainer>
        </RightSideGridContainer>
      </RightSideGridItem>
    </GridContainerFullHeight>
  );
};
