/*
 * Copyright 2025 The Backstage Authors
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
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';

import { usePermission } from '@backstage/plugin-permission-react';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common/alpha';

import { UnprocessedEntity } from '../types';

export const FailedEntityActions = ({
  entity,
  canDelete,
  handleRefresh,
  handleDelete,
}: {
  entity: UnprocessedEntity;
  canDelete: boolean;
  handleRefresh: ({ entityRef }: { entityRef: string }) => void;
  handleDelete: ({
    entityId,
    entityRef,
  }: {
    entityId: string;
    entityRef: string;
  }) => void;
}) => {
  const { entity_id, entity_ref } = entity as UnprocessedEntity;
  const canRefresh = usePermission({
    permission: catalogEntityRefreshPermission,
    resourceRef: entity_ref,
  });

  return (
    <>
      <IconButton
        aria-label="refresh"
        disabled={!canRefresh.allowed}
        onClick={() =>
          handleRefresh({
            entityRef: entity_ref,
          })
        }
      >
        <RefreshIcon fontSize="small" data-testid="refresh-icon" />
      </IconButton>
      <IconButton
        aria-label="delete"
        disabled={!canDelete}
        onClick={() =>
          handleDelete({
            entityId: entity_id,
            entityRef: entity_ref,
          })
        }
      >
        <DeleteIcon fontSize="small" data-testid="delete-icon" />
      </IconButton>
    </>
  );
};
