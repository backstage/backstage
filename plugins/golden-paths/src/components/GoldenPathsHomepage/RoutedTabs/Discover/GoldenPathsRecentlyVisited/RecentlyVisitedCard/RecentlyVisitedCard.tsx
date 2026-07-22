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
import {
  Card,
  CardActions,
  CardContent,
  styled,
  Typography,
} from '@material-ui/core';
import { Gauge, LinkButton } from '@backstage/core-components';
import {
  goldenPathsApiRef,
  GoldenPathTask,
} from '@backstage/plugin-golden-paths-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

const RecentlyVisitedCard = styled(Card)(() => ({
  minHeight: '10rem',
  maxWidth: '20rem',

  '& > div': {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px 24px',

    '& > [class*=MuiCardActions]': {
      justifyContent: 'space-between',
      padding: 0,
    },
  },
}));

const GaugeContainer = styled('div')(() => ({
  width: 50,
  '& > div': {
    marginLeft: '-0.25rem',

    '& [class*=MuiBox-root]': {
      fontSize: '0.6rem',
      fontWeight: '400',
    },
  },
}));

const Title = styled(props => (
  <Typography variant="h6" component="div" {...props} />
))({
  fontSize: '1rem',
});

const TextContainer = styled('div')({
  display: 'flex',
  gap: '0.6rem',
  flexDirection: 'column',
});

export const RecentlyVisitedGoldenPathCard = ({ id, spec }: GoldenPathTask) => {
  const goldenPathsApi = useApi(goldenPathsApiRef);
  const numberOfSteps = spec.steps.length;
  const metadata = spec.goldenPathInfo?.entity?.metadata;
  const { value, loading } = useAsync(() => {
    if (goldenPathsApi.listGoldenPathSteps) {
      return goldenPathsApi.listGoldenPathSteps(id);
    }
    return Promise.resolve({ statuses: [] });
  }, [goldenPathsApi]);

  if (loading || value === undefined) {
    return null;
  }

  const numberOfCompletedGoldenPathSteps = value.statuses?.filter(item =>
    ['missing', 'completed', 'marked_as_done', 'skipped'].includes(
      item.status as string,
    ),
  ).length;

  const nameOfCurrentlyActiveStep =
    spec.steps[numberOfCompletedGoldenPathSteps]?.name;

  const gaugeValue =
    numberOfCompletedGoldenPathSteps !== 0
      ? numberOfCompletedGoldenPathSteps / numberOfSteps
      : 0;
  const currentlyActiveStep =
    gaugeValue === 1
      ? 'Waiting for completion'
      : `${numberOfCompletedGoldenPathSteps + 1}. ${nameOfCurrentlyActiveStep}`;

  return (
    <RecentlyVisitedCard
      data-testid={`recently-visited-card-${metadata?.title}`}
      variant="outlined"
    >
      <CardContent>
        <TextContainer>
          <Title>{metadata?.title}</Title>
          <Typography variant="body2">{currentlyActiveStep}</Typography>
        </TextContainer>

        <CardActions>
          <GaugeContainer>
            <Gauge getColor={() => '#1F5493'} size="small" value={gaugeValue} />
          </GaugeContainer>
          <LinkButton
            to={`/golden-paths/tasks/${id}`}
            size="small"
            color="primary"
            variant="contained"
          >
            Continue
          </LinkButton>
        </CardActions>
      </CardContent>
    </RecentlyVisitedCard>
  );
};
