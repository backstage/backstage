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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UseCreateReleaseCandidate } from '../features/CreateReleaseCandidate/hooks/useCreateReleaseCandidate';
import { UsePatch } from '../features/Patch/hooks/usePatch';
import { UsePromoteRc } from '../features/PromoteRc/hooks/usePromoteRc';

export type ComponentConfig<OnSuccessArgs> = {
  omit?: boolean;
  onSuccess?: (args: OnSuccessArgs) => Promise<void> | void;
};

export interface CreateRcOnSuccessArgs {
  input: Omit<UseCreateReleaseCandidate, 'onSuccess'>;
  comparisonUrl: string;
  createdTag: string;
  gitReleaseName: string | null;
  gitReleaseUrl: string;
  previousTag?: string;
}

export interface PromoteRcOnSuccessArgs {
  input: Omit<UsePromoteRc, 'onSuccess'>;
  gitReleaseUrl: string;
  gitReleaseName: string | null;
  previousTagUrl: string;
  previousTag: string;
  updatedTagUrl: string;
  updatedTag: string;
}

export interface PatchOnSuccessArgs {
  input: Omit<UsePatch, 'onSuccess'>;
  updatedReleaseUrl: string;
  updatedReleaseName: string | null;
  previousTag: string;
  patchedTag: string;
  patchCommitUrl: string;
  patchCommitMessage: string;
}

export interface ResponseStep {
  message: string | React.ReactNode;
  secondaryMessage?: string | React.ReactNode;
  link?: string;
  icon?: 'success' | 'failure';
}

export interface CardHook<RunArgs> {
  progress: number;
  responseSteps: ResponseStep[];
  run: (args: RunArgs) => Promise<any>;
  runInvoked: boolean;
}

export interface AlertError {
  title?: string;
  subtitle: string;
}
