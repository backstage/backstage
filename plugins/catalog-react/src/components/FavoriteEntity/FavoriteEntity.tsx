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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import IconButton from '@material-ui/core/IconButton';
import { ComponentProps } from 'react';
import { useStarredEntity } from '../../hooks/useStarredEntity';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { FavoriteToggle } from '@backstage/core-components';

/** @public */
export type FavoriteEntityProps = ComponentProps<typeof IconButton> & {
  entity: Entity;
};

/**
 * IconButton for showing if a current entity is starred and adding/removing it from the favorite entities
 * @param props - MaterialUI IconButton props extended by required `entity` prop
 * @public
 */
export const FavoriteEntity = (props: FavoriteEntityProps) => {
  const { toggleStarredEntity, isStarredEntity } = useStarredEntity(
    props.entity,
  );
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const title = isStarredEntity
    ? t('favoriteEntity.removeFromFavorites')
    : t('favoriteEntity.addToFavorites');

  const id = `favorite-${stringifyEntityRef(props.entity).replace(
    /[^a-zA-Z0-9-_]/g,
    '-',
  )}`;

  return (
    <FavoriteToggle
      title={title}
      id={id}
      isFavorite={isStarredEntity}
      onToggle={toggleStarredEntity}
      {...props}
    />
  );
};
