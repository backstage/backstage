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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { EntityLinksEmptyState } from './EntityLinksEmptyState';
import { LinksGridList } from './LinksGridList';
import { ColumnBreakpoints } from './types';
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';

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

  if (!links || links.length === 0) {
    return (
      <EntityInfoCard title={t('entityLinksCard.title')}>
        <EntityLinksEmptyState />
      </EntityInfoCard>
    );
  }

  const ungrouped = links.filter(link => !link.type);
  const grouped = links
    .filter(link => link.type)
    .reduce<Record<string, typeof links>>((acc, link) => {
      const key = link.type!;
      acc[key] = acc[key] ?? [];
      acc[key].push(link);
      return acc;
    }, {});

  const hasGroups = Object.keys(grouped).length > 0;

  return (
    <EntityInfoCard title={t('entityLinksCard.title')}>
      {ungrouped.length > 0 && (
        <LinksGridList
          cols={cols}
          items={ungrouped.map(({ url, title, icon }) => ({
            text: title ?? url,
            href: url,
            Icon: iconResolver(icon),
          }))}
        />
      )}
      {hasGroups &&
        Object.entries(grouped).map(([type, typeLinks]) => (
          <Box key={type} mt={ungrouped.length > 0 ? 2 : 0}>
            <Typography variant="overline" color="textSecondary">
              {type}
            </Typography>
            <LinksGridList
              cols={cols}
              items={typeLinks.map(({ url, title, icon }) => ({
                text: title ?? url,
                href: url,
                Icon: iconResolver(icon),
              }))}
            />
          </Box>
        ))}
    </EntityInfoCard>
  );
};
