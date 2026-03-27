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

import { Input, Label, cn } from '@backstage/core-components';

import { BaseRepoBranchPickerProps } from './types';

/**
 * The underlying component that is rendered in the form for the `DefaultRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const DefaultRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  isDisabled,
  required,
}: BaseRepoBranchPickerProps) => {
  const { branch } = state;

  return (
    <div className="mt-4 space-y-2">
      <Label
        htmlFor="branchInput"
        className={cn(
          required && "after:content-['*'] after:ml-0.5 after:text-destructive",
        )}
      >
        Branch
      </Label>
      <Input
        id="branchInput"
        placeholder="Enter branch name..."
        disabled={isDisabled}
        onChange={e => onChange({ branch: e.target.value })}
        value={branch}
        required={required}
        className={cn(rawErrors?.length > 0 && !branch && 'border-destructive')}
      />
      <p
        className={cn(
          'text-sm',
          rawErrors?.length > 0 && !branch
            ? 'text-destructive'
            : 'text-muted-foreground',
        )}
      >
        The branch of the repository
      </p>
    </div>
  );
};
