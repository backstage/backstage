/*
 * Copyright 2024 The Backstage Authors
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
import { DetectedError } from '@backstage/plugin-kubernetes-common';
import { renderInTestApp } from '@backstage/test-utils';
import { MatcherFunction, screen } from '@testing-library/react';
import { ErrorReporting } from './ErrorReporting';

describe('ErrorReporting', () => {
  const matchTextContent =
    (text: string): MatcherFunction =>
    (_, node) =>
      node?.textContent?.includes(text) ?? false;

  it('sorts errors by severity', async () => {
    await renderInTestApp(
      <ErrorReporting
        detectedErrors={
          new Map<string, DetectedError[]>([
            [
              'cluster',
              [
                {
                  type: 'readiness-probe-taking-too-long',
                  message:
                    'The container my-container failed to start properly, but is not crashing',
                  severity: 4,
                  proposedFix: undefined,
                  sourceRef: {
                    name: 'my-pod',
                    namespace: 'default',
                    kind: 'Pod',
                    apiGroup: 'v1',
                  },
                  occurrenceCount: 1,
                },
                {
                  type: 'condition-message-present',
                  message: 'some condition message',
                  severity: 6,
                  sourceRef: {
                    name: 'my-deployment',
                    namespace: 'default',
                    kind: 'Deployment',
                    apiGroup: 'apps/v1',
                  },
                  occurrenceCount: 1,
                },
              ],
            ],
          ])
        }
        clusters={[{ name: 'cluster' }]}
      />,
    );

    expect(screen.getAllByRole('row')).toEqual([
      expect.anything(),
      screen.getByText(matchTextContent('some condition message'), {
        selector: 'tr',
      }),
      screen.getByText(
        matchTextContent(
          'The container my-container failed to start properly, but is not crashing',
        ),
        { selector: 'tr' },
      ),
      expect.anything(),
    ]);
  });

  it('displays cluster name', async () => {
    await renderInTestApp(
      <ErrorReporting
        detectedErrors={
          new Map<string, DetectedError[]>([
            [
              'my-cluster',
              [
                {
                  type: 'condition-message-present',
                  message: 'some condition message',
                  severity: 6,
                  sourceRef: {
                    name: 'my-deployment',
                    namespace: 'default',
                    kind: 'Deployment',
                    apiGroup: 'apps/v1',
                  },
                  occurrenceCount: 1,
                },
              ],
            ],
          ])
        }
        clusters={[{ name: 'my-cluster' }]}
      />,
    );

    expect(
      screen.getByRole('cell', { name: 'my-cluster' }),
    ).toBeInTheDocument();
  });

  it('displays cluster title when specified', async () => {
    await renderInTestApp(
      <ErrorReporting
        detectedErrors={
          new Map<string, DetectedError[]>([
            [
              'my-cluster',
              [
                {
                  type: 'condition-message-present',
                  message: 'some condition message',
                  severity: 6,
                  sourceRef: {
                    name: 'my-deployment',
                    namespace: 'default',
                    kind: 'Deployment',
                    apiGroup: 'apps/v1',
                  },
                  occurrenceCount: 1,
                },
              ],
            ],
          ])
        }
        clusters={[{ name: 'my-cluster', title: 'cluster-title' }]}
      />,
    );

    expect(
      screen.getByRole('cell', { name: 'cluster-title' }),
    ).toBeInTheDocument();
  });
});
