/*
 * Copyright 2020 The Backstage Authors
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
import { Globe } from 'lucide-react';
import { EntityLinksEmptyState } from './EntityLinksEmptyState';
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
  variant?: InfoCardVariants;
}

/**
 * Adapts the Lucide Globe icon to the Backstage IconComponent type contract.
 * LucideIcon props differ from IconComponent's fontSize union type.
 */
const DefaultLinkIcon: IconComponent = props => <Globe {...props} />;

export const EntityLinksCard = (props: EntityLinksCardProps) => {
  const { cols = undefined, variant } = props;
  const { entity } = useEntity();
  const app = useApp();
  const { t } = useTranslationRef(catalogTranslationRef);

  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? DefaultLinkIcon : DefaultLinkIcon;

  const links = entity?.metadata?.links;

  return (
    <InfoCard title={t('entityLinksCard.title')} variant={variant}>
      {!links || links.length === 0 ? (
        <EntityLinksEmptyState />
      ) : (
        <LinksGridList
          cols={cols}
          items={links.map(({ url, title, icon }) => ({
            text: title ?? url,
            href: url,
            Icon: iconResolver(icon),
          }))}
        />
      )}
    </InfoCard>
  );
};
