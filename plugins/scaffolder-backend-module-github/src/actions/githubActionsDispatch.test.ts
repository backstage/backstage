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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createGithubActionsDispatchAction } from './githubActionsDispatch';
import { getVoidLogger } from '@backstage/backend-common';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import unzipper from 'unzipper';
import { Buffer } from 'buffer';

// FIX 1: Revert to legacy timers
jest.useFakeTimers();

// Mock octokit
const mockCreateWorkflowDispatch = jest.fn();
const mockListWorkflowRuns = jest.fn();
const mockGetWorkflowRun = jest.fn();
const mockListWorkflowRunArtifacts = jest.fn();
const mockDownloadArtifact = jest.fn();

jest.mock('octokit', () => ({
  Octokit: class {
    rest = {
      actions: {
        createWorkflowDispatch: mockCreateWorkflowDispatch,
        listWorkflowRuns: mockListWorkflowRuns,
        getWorkflowRun: mockGetWorkflowRun,
        listWorkflowRunArtifacts: mockListWorkflowRunArtifacts,
        downloadArtifact: mockDownloadArtifact,
      },
    };
  },
}));

// Mock unzipper
jest.mock('unzipper');
const mockUnzipper = unzipper as jest.Mocked<any>;

const mockFileBuffer = jest.fn();
const mockDirectory = {
  files: [
    { path: 'test.json', buffer: mockFileBuffer },
    { path: 'README.md', buffer: jest.fn() },
  ],
};

describe('github:actions:dispatch', () => {
  const config = new ConfigReader({
    integrations: {
      github: [{ host: 'github.com', token: 'test-token' }],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGithubActionsDispatchAction({ integrations });
  const logger = getVoidLogger();

  // We control the clock so `dispatchTimestamp` and `created_at` match.
  const MOCK_TIME = new Date('2025-11-05T12:00:00.000Z');
  const MOCK_TIMESTAMP = MOCK_TIME.getTime();

  const mockRun = {
    id: 12345,
    html_url: 'https://github.com/owner/repo/actions/runs/12345',
    created_at: MOCK_TIME.toISOString(), // Use our controlled time
    status: 'completed',
    conclusion: 'success',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnzipper.Open.buffer.mockResolvedValue(mockDirectory);
    // Make Date.now() return our controlled time
    jest.spyOn(Date, 'now').mockReturnValue(MOCK_TIMESTAMP);
  });

  const baseInput = {
    repoUrl: 'github.com?owner=owner&repo=repo',
    workflowId: 'ci.yml',
    branchOrTagName: 'main',
    initialWaitSeconds: 5,
    pollIntervalSeconds: 10,
    timeoutMinutes: 30,
    waitForCompletion: false, 
  };

  it('should dispatch a workflow and not wait', async () => {
    mockListWorkflowRuns.mockResolvedValue({
      data: { workflow_runs: [mockRun] },
    });

    const context = createMockActionContext({
      input: baseInput,
      logger,
      checkpoint: async ({ fn }) => fn(), // FIX 3: Correct checkpoint type
      output: jest.fn(),
    });

    const handlerPromise = action.handler(context);
    jest.runAllTimers(); // Use legacy timers
    await handlerPromise;

    expect(mockCreateWorkflowDispatch).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      workflow_id: 'ci.yml',
      ref: 'main',
      inputs: undefined,
    });
    expect(mockListWorkflowRuns).toHaveBeenCalled();
    expect(mockGetWorkflowRun).not.toHaveBeenCalled();
    expect(context.output).toHaveBeenCalledWith('runId', mockRun.id);
    expect(context.output).toHaveBeenCalledWith('runUrl', mockRun.html_url);
  });

  it('should wait for completion with success', async () => {
    mockListWorkflowRuns.mockResolvedValue({
      data: { workflow_runs: [mockRun] },
    });
    mockGetWorkflowRun
      .mockResolvedValueOnce({ data: { ...mockRun, status: 'in_progress' } })
      .mockResolvedValueOnce({ data: { ...mockRun, status: 'completed' } });

    const context = createMockActionContext({
      input: {
        ...baseInput,
        waitForCompletion: true,
        pollIntervalSeconds: 1,
      },
      logger,
      checkpoint: async ({ fn }) => fn(), 
      output: jest.fn(),
    });

    const handlerPromise = action.handler(context);
    jest.runAllTimers(); // Use legacy timers
    await handlerPromise;

    expect(mockGetWorkflowRun).toHaveBeenCalledTimes(2);
    expect(context.output).toHaveBeenCalledWith('runId', mockRun.id);
    expect(context.output).toHaveBeenCalledWith('runUrl', mockRun.html_url);
    expect(context.output).toHaveBeenCalledWith('conclusion', 'success');
  });

  it('should throw if workflow fails', async () => {
    const failedRun = {
      ...mockRun,
      conclusion: 'failure',
    };
    mockListWorkflowRuns.mockResolvedValue({
      data: { workflow_runs: [failedRun] },
    });
    mockGetWorkflowRun.mockResolvedValue({ data: failedRun });

    const context = createMockActionContext({
      input: { ...baseInput, waitForCompletion: true },
      logger,
      checkpoint: async ({ fn }) => fn(),
      output: jest.fn(),
    });

    // Use legacy timer fix for rejected promises
    await expect(async () => {
      const handlerPromise = action.handler(context);
      jest.runAllTimers();
      await handlerPromise;
    }).rejects.toThrow(/Workflow run failed with conclusion: failure/);
  });

  it('should throw on timeout', async () => {
    const inProgressRun = { ...mockRun, status: 'in_progress' };
    mockListWorkflowRuns.mockResolvedValue({
      data: { workflow_runs: [inProgressRun] },
    });
    mockGetWorkflowRun.mockResolvedValue({ data: inProgressRun });

    const context = createMockActionContext({
      input: {
        ...baseInput,
        waitForCompletion: true,
        timeoutMinutes: 1, 
        pollIntervalSeconds: 30,
      },
      logger,
      checkpoint: async ({ fn }) => fn(),
      output: jest.fn(),
    });

    
    const handlerPromise = action.handler(context);

    // Advance clock by 30s (poll 1)
    jest.advanceTimersByTime(30000);
    // Advance clock by 30s (poll 2)
    jest.advanceTimersByTime(30000);
    // Advance clock by 1ms (to go over the 1min/60s timeout
    jest.advanceTimersByTime(1);

    await expect(handlerPromise).rejects.toThrow(
      /Timed out waiting for workflow completion after 1 minutes/,
    );
  });

  it('should fetch and parse artifact JSON', async () => {
    const artifact = { id: 678, name: 'my-artifact' };
    const artifactZipData = Buffer.from('zip-file-content');
    const artifactJsonContent = { foo: 'bar' };
    mockFileBuffer.mockResolvedValue(
      Buffer.from(JSON.stringify(artifactJsonContent)),
    );

    mockListWorkflowRuns.mockResolvedValue({
      data: { workflow_runs: [mockRun] },
    });
    mockGetWorkflowRun.mockResolvedValue({ data: mockRun });
    mockListWorkflowRunArtifacts.mockResolvedValue({
      data: { artifacts: [artifact] },
    });
    mockDownloadArtifact.mockResolvedValue({ data: artifactZipData });

    const context = createMockActionContext({
      input: {
        ...baseInput,
        waitForCompletion: true,
        outputArtifactName: 'my-artifact',
      },
      logger,
      checkpoint: async ({ fn }) => fn(),
      output: jest.fn(),
    });

    const handlerPromise = action.handler(context);
    jest.runAllTimers(); 
    await handlerPromise;

    expect(mockListWorkflowRunArtifacts).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      run_id: mockRun.id,
    });
    expect(mockDownloadArtifact).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      artifact_id: artifact.id,
      archive_format: 'zip',
    });
    expect(mockUnzipper.Open.buffer).toHaveBeenCalledWith(artifactZipData);
    expect(mockFileBuffer).toHaveBeenCalled();
    expect(context.output).toHaveBeenCalledWith('outputs', artifactJsonContent);
    expect(context.output).toHaveBeenCalledWith('conclusion', 'success');
  });
});
