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
import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  CompoundEntityRef,
  Entity,
} from '@backstage/catalog-model';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import React, { useEffect, useState } from 'react';
import { TableProps } from '@backstage/core-components';
import StarBorder from '@material-ui/icons/StarBorder';
import { withStyles } from '@material-ui/core/styles';
import Star from '@material-ui/icons/Star';

export const YellowStar = withStyles({
  root: {
    color: '#f3ba37',
  },
})(Star);

export function useDefaultCatalogTableActions<T extends { entity: Entity }>({
  isStarredEntity,
  toggleStarredEntity,
}: {
  isStarredEntity: (
    entityOrRef: string | Entity | CompoundEntityRef,
  ) => boolean;
  toggleStarredEntity: (
    entityOrRef: string | Entity | CompoundEntityRef,
  ) => void;
}) {
  const [defaultActions, setDefaultActions] = useState(
    [] as TableProps<T>['actions'],
  );
  useEffect(() => {
    setDefaultActions([
      ({ entity }: T) => {
        const url = entity.metadata.annotations?.[ANNOTATION_VIEW_URL];
        return {
          icon: () => <OpenInNew aria-label="View" fontSize="small" />,
          tooltip: 'View',
          disabled: !url,
          onClick: () => {
            if (!url) return;
            window.open(url, '_blank');
          },
        };
      },
      ({ entity }: T) => {
        const url = entity.metadata.annotations?.[ANNOTATION_EDIT_URL];
        return {
          icon: () => <Edit aria-label="Edit" fontSize="small" />,
          tooltip: 'Edit',
          disabled: !url,
          onClick: () => {
            if (!url) return;
            window.open(url, '_blank');
          },
        };
      },
      ({ entity }: T) => {
        const isStarred = isStarredEntity(entity);
        return {
          cellStyle: { paddingLeft: '1em' },
          icon: () => (isStarred ? <YellowStar /> : <StarBorder />),
          tooltip: isStarred ? 'Remove from favorites' : 'Add to favorites',
          onClick: () => toggleStarredEntity(entity),
        };
      },
    ]);
  }, [isStarredEntity, setDefaultActions, toggleStarredEntity]);
  return { defaultActions };
}
