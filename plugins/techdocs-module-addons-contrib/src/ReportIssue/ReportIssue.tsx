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

import { useGitRepository } from './hooks';
import { ReportIssueTemplateBuilder } from './types';
import { ADDON_ISSUE_REPO_TYPES_SUPPORTED } from './constants';
import { ReportIssueAddonContent } from './ReportIssueContent';

/**
 * Props customizing the <ReportIssue /> Addon.
 *
 * @public
 */
export type ReportIssueProps = {
  /**
   * Number of milliseconds after a user highlights some text before the report
   * issue link appears above the highlighted text. Defaults to 500ms.
   */
  debounceTime?: number;

  /**
   * An optional function defining how a custom issue title and body should be
   * constructed, given some selected text.
   */
  templateBuilder?: ReportIssueTemplateBuilder;
};

export const ReportIssueAddon = ({
  debounceTime = 500,
  templateBuilder,
}: ReportIssueProps) => {
  const repository = useGitRepository();

  if (
    !repository ||
    !ADDON_ISSUE_REPO_TYPES_SUPPORTED.includes(repository.type)
  ) {
    return null;
  }

  return (
    <ReportIssueAddonContent
      debounceTime={debounceTime}
      templateBuilder={templateBuilder}
      repository={repository}
    />
  );
};
