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

import { useEntity, EntityInfoCard } from '@backstage/plugin-catalog-react';
import LanguageIcon from '@material-ui/icons/Language';
import { EntityLinksEmptyState } from './EntityLinksEmptyState';
import { LinksGridList, LinksGridListItem } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';
import { Flex, Text } from '@backstage/ui';

/** @public */
export interface EntityLinksCardProps {
  cols?: ColumnBreakpoints | number;
}

export const EntityLinksCard = (props: EntityLinksCardProps) => {
  const { cols = undefined } = props;
  const { entity } = useEntity();
  const app = useApp();
  const { t } = useTranslationRef(catalogTranslationRef);

  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? LanguageIcon : LanguageIcon;

  const links = entity?.metadata?.links;

  const renderContent = () => {
    if (!links || links.length === 0) {
      return <EntityLinksEmptyState />;
    }

    const untyped: LinksGridListItem[] = [];
    const groups = new Map<string, LinksGridListItem[]>();

    for (const link of links) {
      const item: LinksGridListItem = {
        text: link.title ?? link.url,
        href: link.url,
        Icon: iconResolver(link.icon),
      };
      const type = link.type?.trim();
      if (type) {
        const existing = groups.get(type);
        if (existing) {
          existing.push(item);
        } else {
          groups.set(type, [item]);
        }
      } else {
        untyped.push(item);
      }
    }

    if (groups.size === 0) {
      return <LinksGridList cols={cols} items={untyped} />;
    }

    return (
      <Flex direction="column" gap="4">
        {untyped.length > 0 && <LinksGridList cols={cols} items={untyped} />}
        {Array.from(groups.entries()).map(([type, items]) => (
          <Flex direction="column" gap="2" key={type}>
            <Text as="h4" variant="title-x-small" weight="bold">
              {type}
            </Text>
            <LinksGridList cols={cols} items={items} />
          </Flex>
        ))}
      </Flex>
    );
  };

  return (
    <EntityInfoCard title={t('entityLinksCard.title')}>
      {renderContent()}
    </EntityInfoCard>
  );
};
