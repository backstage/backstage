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

import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { EntityLabelsEmptyState } from './EntityLabelsEmptyState';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface EntityLabelsCardProps {
  variant?: InfoCardVariants;
  title?: string;
}

export const EntityLabelsCard = (props: EntityLabelsCardProps) => {
  const { variant, title } = props;
  const { entity } = useEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  const labels = entity?.metadata?.labels ?? {};
  const filtered = Object.entries(labels).filter(
    ([k]) => !k.startsWith('backstage.io/'),
  );

  return (
    <InfoCard title={title || t('entityLabelsCard.title')} variant={variant}>
      {filtered.length === 0 ? (
        <EntityLabelsEmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(([k, v]) => (
            <div key={k} className="flex gap-2 text-sm">
              <span className="font-bold">{k}</span>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};
