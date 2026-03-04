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

import { UserIcon, ShadcnButton as Button } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { EntityRefLinks } from '@backstage/plugin-catalog-react';

import { scaffolderReactTranslationRef } from '../../../translation';

/**
 * The Props for the {@link TemplateCardActions} component
 * @alpha
 */
export interface TemplateCardActionsProps {
  ownedByRelations: any;
  canCreateTask: boolean;
  handleChoose: () => void;
}
export const TemplateCardActions = ({
  canCreateTask,
  handleChoose,
  ownedByRelations,
}: TemplateCardActionsProps) => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);

  return (
    <div
      className="flex flex-1 items-center justify-between"
      data-testid="template-card-actions--footer"
    >
      <div
        className="flex flex-1 items-center text-[var(--link-color,hsl(var(--primary)))]"
        data-testid="template-card-actions--ownedby"
      >
        {ownedByRelations.length > 0 && (
          <>
            <UserIcon fontSize="small" />
            <EntityRefLinks
              style={{ marginLeft: '8px' }}
              entityRefs={ownedByRelations}
              defaultKind="Group"
              hideIcons
            />
          </>
        )}
      </div>
      {canCreateTask ? (
        <Button
          variant="outline"
          size="sm"
          data-testid="template-card-actions--create"
          onClick={handleChoose}
        >
          {t('templateCard.chooseButtonText')}
        </Button>
      ) : null}
    </div>
  );
};
