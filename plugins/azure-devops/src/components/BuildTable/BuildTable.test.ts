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

import {
  BuildResult,
  BuildStatus,
} from '@backstage/plugin-azure-devops-common';
import { 
  getBuildResultComponent, 
  getBuildStateComponent 
} from './BuildTable';

import { renderInTestApp } from '@backstage/test-utils';

describe('getBuildResultComponent', () => {
  describe('getBuildResultComponent with Succeeded result', () => {
    it('should return Status ok Succeeded', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(BuildResult.Succeeded),
      );

      expect(getByLabelText('Status ok')).toBeInTheDocument();
      expect(getByText('Succeeded')).toBeInTheDocument();
    });
  });

  describe('getBuildResultComponent with Partially Succeeded result', () => {
    it('should return Status warning Partially Succeeded', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(BuildResult.PartiallySucceeded),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Partially Succeeded')).toBeInTheDocument();
    });
  });

  describe('getBuildResultComponent with Failed result', () => {
    it('should return Status error Failed', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(BuildResult.Failed),
      );

      expect(getByLabelText('Status error')).toBeInTheDocument();
      expect(getByText('Failed')).toBeInTheDocument();
    });
  });

  describe('getBuildResultComponent with Canceled result', () => {
    it('should return Status aborted Canceled', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(BuildResult.Canceled),
      );

      expect(getByLabelText('Status aborted')).toBeInTheDocument();
      expect(getByText('Canceled')).toBeInTheDocument();
    });
  });

  describe('getBuildResultComponent with None result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(BuildResult.None),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('getBuildResultComponent with undefined result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildResultComponent(undefined),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });
});

describe('getBuildStateComponent', () => {
  describe('getBuildStateComponent with In Progress status and undefined result', () => {
    it('should return Status running In Progress', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.InProgress, undefined),
      );

      expect(getByLabelText('Status running')).toBeInTheDocument();
      expect(getByText('In Progress')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and Succeeded result', () => {
    it('should return Status ok Succeeded', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Completed, BuildResult.Succeeded),
      );

      expect(getByLabelText('Status ok')).toBeInTheDocument();
      expect(getByText('Succeeded')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and Partially Succeeded result', () => {
    it('should return Status warning Partially Succeeded', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(
          BuildStatus.Completed,
          BuildResult.PartiallySucceeded,
        ),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Partially Succeeded')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and Failed result', () => {
    it('should return Status error Failed', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Completed, BuildResult.Failed),
      );

      expect(getByLabelText('Status error')).toBeInTheDocument();
      expect(getByText('Failed')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and Canceled result', () => {
    it('should return Status aborted Canceled', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Completed, BuildResult.Canceled),
      );

      expect(getByLabelText('Status aborted')).toBeInTheDocument();
      expect(getByText('Canceled')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and None result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Completed, BuildResult.None),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Completed status and undefined result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Completed, undefined),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });

  // TODO: Add remaining Completed iterations

  describe('getBuildStateComponent with Cancelling status and undefined result', () => {
    it('should return Status aborted Cancelling', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Cancelling, undefined),
      );

      expect(getByLabelText('Status aborted')).toBeInTheDocument();
      expect(getByText('Cancelling')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Postponed status and undefined result', () => {
    it('should return Status pending Postponed', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.Postponed, undefined),
      );

      expect(getByLabelText('Status pending')).toBeInTheDocument();
      expect(getByText('Postponed')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with Not Started status and undefined result', () => {
    it('should return Status aborted Not Started', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.NotStarted, undefined),
      );

      expect(getByLabelText('Status aborted')).toBeInTheDocument();
      expect(getByText('Not Started')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with None status and undefined result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(BuildStatus.None, undefined),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with undefined and undefined result', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(undefined, undefined),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('getBuildStateComponent with undefined and any valid BuildResult', () => {
    it('should return Status warning Unknown', async () => {
      const { getByLabelText, getByText } = await renderInTestApp(
        getBuildStateComponent(undefined, BuildResult.Succeeded),
      );

      expect(getByLabelText('Status warning')).toBeInTheDocument();
      expect(getByText('Unknown')).toBeInTheDocument();
    });
  });
});

describe('getBuildDuration', () => {
  describe('getBuildDuration with undefined startTime and valid finishTime', () => {
    it('should return empty result', () => {
      const finishTime = new Date('2021-10-15T11:00:00.0000000Z');

      const result = getBuildDuration(undefined, finishTime);

      expect(result).toEqual('');
    });
  });

  describe('getBuildDuration with undefined startTime and undefined finishTime', () => {
    it('should return empty result', () => {
      const result = getBuildDuration(undefined, undefined);

      expect(result).toEqual('');
    });
  });
});
