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
import { RecentlyVisitedGoldenPathCard } from './RecentlyVisitedCard';
import { styled } from '@material-ui/core';
import {
  ContentHeader,
  EmptyState,
  ErrorPanel,
  LinkButton,
} from '@backstage/core-components';
import useAsync from 'react-use/esm/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),

  '& >*': {
    flex: 1,
  },
}));

export const GoldenPathsRecentlyVisited = () => {
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const { value, loading, error } = useAsync(() => {
    return goldenPathsApi.listTasks({
      filterByOwnership: 'owned',
    });
  }, [goldenPathsApi]);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
        <EmptyState
          missing="info"
          title="No information to display"
          description="There was an issue communicating with backend."
        />
      </>
    );
  }

  const processingTasks = value?.tasks
    .filter(el => el.status === 'processing')
    .slice(0, 5);

  const shouldDisplayGoldenPath = Boolean(
    value?.tasks.filter(task => task.status === 'processing').length,
  );

  return shouldDisplayGoldenPath ? (
    <div
      data-testid="recently-started-golden-paths"
      style={{ paddingBottom: 48 }}
    >
      <ContentHeader title="Your recently started">
        {(value?.totalTasks || 0) > 5 && (
          <LinkButton
            variant="outlined"
            color="secondary"
            to="/golden-paths/tasks"
            data-testid="see-all-button"
          >
            See all
          </LinkButton>
        )}
      </ContentHeader>
      <Container>
        {processingTasks?.map(task => {
          return (
            <RecentlyVisitedGoldenPathCard
              key={task.id}
              id={task.id}
              spec={task.spec}
              createdAt={task.createdAt}
              status={task.status}
            />
          );
        })}
      </Container>
    </div>
  ) : null;
};
