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
import { Input, Label, cn } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export const GerritRepoPicker = (props: BaseRepoUrlPickerProps) => {
  const { onChange, rawErrors, state, isDisabled } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const { workspace, owner } = state;
  return (
    <>
      <div
        className={cn(
          'mt-4 mb-2 space-y-2',
          rawErrors?.length > 0 && !owner && 'text-destructive',
        )}
      >
        <Label htmlFor="ownerInput">
          {t('fields.gerritRepoPicker.owner.title')}
        </Label>
        <Input
          id="ownerInput"
          onChange={e => onChange({ owner: e.target.value })}
          value={owner}
          disabled={isDisabled}
        />
        <p className="text-sm text-muted-foreground">
          {t('fields.gerritRepoPicker.owner.description')}
        </p>
      </div>
      <div
        className={cn(
          'mt-4 mb-2 space-y-2',
          rawErrors?.length > 0 && !workspace && 'text-destructive',
        )}
      >
        <Label htmlFor="parentInput">
          {t('fields.gerritRepoPicker.parent.title')}
        </Label>
        <Input
          id="parentInput"
          onChange={e => onChange({ workspace: e.target.value })}
          value={workspace}
          disabled={isDisabled}
        />
        <p className="text-sm text-muted-foreground">
          {t('fields.gerritRepoPicker.parent.description')}
        </p>
      </div>
    </>
  );
};
