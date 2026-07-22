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
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';

import { TemplateProcessing } from './TemplateProcessing';
import { useTemplateProcessing } from './TemplateProcessing.utils';

jest.mock('./TemplateProcessing.utils.tsx', () => ({
  useTemplateProcessing: jest.fn(() => ({ taskStream: {} })),
}));

const MENU = 'Rohan';
jest.mock('@backstage/plugin-golden-paths-react', () => ({
  useGoldenPathContext: () => ({}),
  GoldenPathContextMenu: () => <>{MENU}</>,
}));

const OUTPUTS = 'Saruman';
const LOG_STREAM = 'Gandalf';
const STEPS = 'Radagast';
jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  DefaultTemplateOutputs: () => <>{OUTPUTS}</>,
  TaskLogStream: () => <>{LOG_STREAM}</>,
  TaskSteps: () => <>{STEPS}</>,
}));

describe('TemplateProcessing', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all default elements', async () => {
    const {
      getByText,
      getByRole,
      getByTestId,
      queryByTestId,
      queryByText,
      queryByRole,
    } = await renderInTestApp(<TemplateProcessing />);

    expect(getByText(OUTPUTS)).toBeInTheDocument();
    expect(getByText(STEPS)).toBeInTheDocument();
    expect(queryByText(LOG_STREAM)).not.toBeInTheDocument();
    expect(getByTestId('cancel-button')).toBeInTheDocument();
    expect(getByTestId('start-over-button')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Show Logs' })).toBeInTheDocument();
    expect(queryByTestId('retry-button')).not.toBeInTheDocument();
    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it("should render 'Outputs' component from props if available", async () => {
    const FROM_PROPS = 'Iluvatar';
    const { getByText, queryByText } = await renderInTestApp(
      <TemplateProcessing TemplateOutputsComponent={() => <>{FROM_PROPS}</>} />,
    );

    expect(queryByText(OUTPUTS)).not.toBeInTheDocument();
    expect(getByText(FROM_PROPS)).toBeInTheDocument();
  });

  it('should render Error panel in case of error', async () => {
    const ERROR_MSG = 'Shelob found you.';
    (useTemplateProcessing as jest.Mock).mockReturnValue({
      taskStream: { error: new Error(ERROR_MSG) },
    });

    const { getByText } = await renderInTestApp(<TemplateProcessing />);

    expect(getByText(ERROR_MSG)).toBeInTheDocument();
  });

  it("should render Logs and 'Hide Logs' button if logs are set to visible", async () => {
    (useTemplateProcessing as jest.Mock).mockReturnValue({
      logsVisible: true,
      taskStream: {},
    });

    const { getByText, getByRole } = await renderInTestApp(
      <TemplateProcessing />,
    );

    expect(getByText(LOG_STREAM)).toBeInTheDocument();
    expect(getByRole('button', { name: 'Hide Logs' })).toBeInTheDocument();
  });

  it("should render 'Show Logs' button by default, that calls `setLogVisibleState` with proper value when clicked", async () => {
    const setLogVisibleState = jest.fn();
    (useTemplateProcessing as jest.Mock).mockReturnValue({
      setLogVisibleState,
      taskStream: {},
    });

    const { getByRole } = await renderInTestApp(<TemplateProcessing />);

    const button = getByRole('button', { name: 'Show Logs' });
    expect(button).toBeInTheDocument();
    expect(setLogVisibleState).toHaveBeenCalledTimes(0);

    await user.click(button);
    expect(setLogVisibleState).toHaveBeenCalledTimes(1);
    expect(setLogVisibleState).toHaveBeenCalledWith(true);
  });

  describe("'Cancel' button", () => {
    it('is disabled, if `isCancelButtonDisabled === true`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isCancelButtonDisabled: true,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('cancel-button')).toHaveAttribute('disabled');
    });

    it('is enabled, if `isCancelButtonDisabled === false`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isCancelButtonDisabled: false,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('cancel-button')).not.toHaveAttribute('disabled');
    });

    it('should call `triggerCancel` when clicked', async () => {
      const triggerCancel = jest.fn();
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        triggerCancel,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      const button = getByTestId('cancel-button');
      expect(button).toBeInTheDocument();
      expect(triggerCancel).toHaveBeenCalledTimes(0);

      await user.click(button);
      expect(triggerCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("'Retry' button", () => {
    it('should be rendered if the task is retryable', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isRetryableTask: true,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('retry-button')).toBeInTheDocument();
    });

    it('is disabled, if task is retryable and `isRetryButtonDisabled === true`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isRetryableTask: true,
        isRetryButtonDisabled: true,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('retry-button')).toHaveAttribute('disabled');
    });

    it('is enabled, if task is retryable and `isRetryButtonDisabled === false`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isRetryableTask: true,
        isRetryButtonDisabled: false,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('retry-button')).not.toHaveAttribute('disabled');
    });

    it('should call `triggerRetry` when clicked', async () => {
      const triggerRetry = jest.fn();
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isRetryableTask: true,
        triggerRetry,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      const button = getByTestId('retry-button');
      expect(button).toBeInTheDocument();
      expect(triggerRetry).toHaveBeenCalledTimes(0);

      await user.click(button);
      expect(triggerRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("'Start Over' button", () => {
    it('is disabled, if `isStartOverButtonDisabled === true`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isStartOverButtonDisabled: true,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('start-over-button')).toHaveAttribute('disabled');
    });

    it('is enabled, if `isStartOverButtonDisabled === false`', async () => {
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        isStartOverButtonDisabled: false,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      expect(getByTestId('start-over-button')).not.toHaveAttribute('disabled');
    });

    it('should call `startOver` when clicked', async () => {
      const startOver = jest.fn();
      (useTemplateProcessing as jest.Mock).mockReturnValue({
        startOver,
        taskStream: {},
      });

      const { getByTestId } = await renderInTestApp(<TemplateProcessing />);

      const button = getByTestId('start-over-button');
      expect(button).toBeInTheDocument();
      expect(startOver).toHaveBeenCalledTimes(0);

      await user.click(button);
      expect(startOver).toHaveBeenCalledTimes(1);
    });
  });
});
