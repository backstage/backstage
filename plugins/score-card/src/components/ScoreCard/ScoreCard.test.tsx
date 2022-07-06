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
import { act, render } from '@testing-library/react';
import { ScoreCard } from './ScoreCard';
import { TestApiProvider } from '@backstage/test-utils';
import { ScoringDataApi, scoringDataApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { SystemScoreExtended } from '../../api/types';
import { errorApiRef } from '@backstage/core-plugin-api';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('ScoreCard-EmptyData', () => {
  class MockClient implements ScoringDataApi {
    getScore(
      _entity?: Entity | undefined,
    ): Promise<SystemScoreExtended | undefined> {
      return new Promise<SystemScoreExtended | undefined>(
        (resolve, _reject) => {
          resolve(undefined);
        },
      );
    }
    getAllScores(): Promise<SystemScoreExtended[] | undefined> {
      throw new Error('Method not implemented.');
    }
  }

  const mockClient = new MockClient();

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'System',
    metadata: {
      name: 'audio-playback',
    },
  };

  it('should render a progress bar', async () => {
    jest.useFakeTimers();

    const errorApi = { post: () => {} };
    const { getByTestId, findByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <TestApiProvider
          apis={[
            [errorApiRef, errorApi],
            [scoringDataApiRef, mockClient],
          ]}
        >
          <EntityProvider entity={entity}>
            <ScoreCard />
          </EntityProvider>
        </TestApiProvider>
      </ThemeProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(getByTestId('progress')).toBeInTheDocument();

    await findByTestId('score-card-no-data');
    jest.useRealTimers();
  });
});

describe('ScoreCard-TestWithData', () => {
  class MockClient implements ScoringDataApi {
    getScore(
      _entity?: Entity | undefined,
    ): Promise<SystemScoreExtended | undefined> {
      return new Promise<SystemScoreExtended | undefined>(
        (resolve, _reject) => {
          const sampleData = require('../../../sample-data/audio-playback.json');
          resolve(sampleData);
        },
      );
    }
    getAllScores(): Promise<SystemScoreExtended[] | undefined> {
      throw new Error('Method not implemented.');
    }
  }

  const mockClient = new MockClient();

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'System',
    metadata: {
      name: 'audio-playback',
    },
  };

  it('should render a progress bar', async () => {
    jest.useFakeTimers();

    const errorApi = { post: () => {} };
    const { getByTestId, findByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <TestApiProvider
          apis={[
            [errorApiRef, errorApi],
            [scoringDataApiRef, mockClient],
          ]}
        >
          <EntityProvider entity={entity}>
            <ScoreCard />
          </EntityProvider>
        </TestApiProvider>
      </ThemeProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(getByTestId('progress')).toBeInTheDocument();

    await findByTestId('score-card');
    jest.useRealTimers();
  });
});
