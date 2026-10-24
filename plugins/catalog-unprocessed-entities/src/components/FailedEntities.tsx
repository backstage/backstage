/*
 * Copyright 2023 The Backstage Authors
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
import { useState } from 'react';
import { DateTime } from 'luxon';
import {
  ErrorPanel,
  MarkdownContent,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';

import { Alert, Box, ButtonIcon, Text } from '@backstage/ui';
import { RiDeleteBinLine } from '@remixicon/react';
import { useApi } from '@backstage/core-plugin-api';

import { EntityDialog } from './EntityDialog';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import useAsync from 'react-use/esm/useAsync';
import { DeleteEntityConfirmationDialog } from './DeleteEntityConfirmationDialog';
import { UnprocessedEntity } from '@backstage/plugin-catalog-unprocessed-entities-common';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import styles from './FailedEntities.module.css';

const RenderErrorContext = ({
  error,
  rowData,
}: {
  error: { message: string };
  rowData: UnprocessedEntity;
}) => {
  if (error.message.includes('tags.')) {
    return (
      <>
        <Text className={styles.errorText}>Tags</Text>
        <ul>
          {rowData.unprocessed_entity.metadata.tags?.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </>
    );
  }

  if (error.message.includes('metadata.name')) {
    return (
      <>
        <Text className={styles.errorText}>Name</Text>
        <Text className={styles.errorText} variant="body-small">
          {rowData.unprocessed_entity.metadata.name}
        </Text>
      </>
    );
  }

  return null;
};

/**
 * Converts input datetime which lacks timezone info into user's local time so that they can
 * easily understand the times.
 */
export const convertTimeToLocalTimezone = (dateTime: string | Date) => {
  const isoDateTime =
    typeof dateTime === 'string' ? dateTime : dateTime.toISOString();

  const strDateTime = DateTime.fromISO(isoDateTime, {
    zone: DateTime.local().zoneName,
  });

  return strDateTime.toFormat('yyyy-MM-dd hh:mm:ss ZZZZ');
};

export const FailedEntities = () => {
  const unprocessedApi = useApi(catalogUnprocessedEntitiesApiRef);
  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => await unprocessedApi.failed());
  const toastApi = useApi(toastApiRef);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(
    undefined,
  );
  const [selectedEntityRef, setSelectedEntityRef] = useState<
    string | undefined
  >(undefined);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }

  const handleDelete = ({
    entityId,
    entityRef,
  }: {
    entityId: string;
    entityRef: string;
  }) => {
    setSelectedEntityId(entityId);
    setSelectedEntityRef(entityRef);
    setConfirmationDialogOpen(true);
  };

  const cleanUpAfterRemoval = async () => {
    try {
      if (selectedEntityId) {
        await unprocessedApi.delete(selectedEntityId);
        toastApi.post({
          title: `Entity ${selectedEntityRef} has been deleted`,
          status: 'success',
        });
      }
    } catch (e) {
      toastApi.post({
        title: `Failed to delete entity ${selectedEntityRef}`,
        status: 'danger',
      });
    }
    setConfirmationDialogOpen(false);
  };

  const columns: TableColumn[] = [
    {
      title: <Text>entityRef</Text>,
      sorting: true,
      field: 'entity_ref',
      customFilterAndSearch: (query, row: any) =>
        row.entity_ref.toUpperCase().includes(query.toUpperCase()),
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).entity_ref,
    },
    {
      title: <Text>Location Path</Text>,
      sorting: true,
      field: 'location_key',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).location_key,
    },
    {
      title: <Text>Kind</Text>,
      sorting: true,
      field: 'kind',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.kind,
    },
    {
      title: <Text>Owner</Text>,
      sorting: true,
      field: 'unprocessed_entity.spec.owner',
      render: (rowData: UnprocessedEntity | {}) =>
        (rowData as UnprocessedEntity).unprocessed_entity.spec?.owner ||
        'unknown',
    },
    {
      title: <Text>Last Discovery At</Text>,
      sorting: true,
      field: 'last_discovery_at',
      render: (rowData: UnprocessedEntity | {}) =>
        convertTimeToLocalTimezone(
          (rowData as UnprocessedEntity).last_discovery_at,
        ) || 'unknown',
    },
    {
      title: <Text>Next Refresh At</Text>,
      sorting: true,
      field: 'next_update_at',
      render: (rowData: UnprocessedEntity | {}) =>
        convertTimeToLocalTimezone(
          (rowData as UnprocessedEntity).next_update_at,
        ) || 'unknown',
    },
    {
      title: <Text>Raw Entity Definition</Text>,
      sorting: false,
      render: (rowData: UnprocessedEntity | {}) => (
        <EntityDialog entity={rowData as UnprocessedEntity} />
      ),
    },
    {
      title: <Text>Actions</Text>,
      render: (rowData: UnprocessedEntity | {}) => {
        const { entity_id, entity_ref } = rowData as UnprocessedEntity;

        return (
          <ButtonIcon
            variant="tertiary"
            aria-label="delete"
            icon={<RiDeleteBinLine />}
            onPress={() =>
              handleDelete({
                entityId: entity_id,
                entityRef: entity_ref,
              })
            }
          />
        );
      },
    },
  ];

  return (
    <>
      <Table
        options={{ pageSize: 20, search: true }}
        columns={columns}
        data={data?.entities ?? []}
        emptyContent={
          <Alert
            status="info"
            title="No failed entities found"
            style={{ placeSelf: 'center', margin: 'var(--bui-space-4)' }}
          />
        }
        detailPanel={({ rowData }) => {
          const errors = (rowData as UnprocessedEntity).errors;
          return (
            <>
              {errors?.map((e, idx) => {
                return (
                  <Box
                    key={idx}
                    bg="danger"
                    p="4"
                    m="4"
                    className={styles.errorBox}
                  >
                    <Text as="p" weight="bold" className={styles.errorText}>
                      {e.name}
                    </Text>
                    <MarkdownContent content={e.message} />
                    <RenderErrorContext
                      error={e}
                      rowData={rowData as UnprocessedEntity}
                    />
                  </Box>
                );
              })}
            </>
          );
        }}
      />
      <DeleteEntityConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={cleanUpAfterRemoval}
      />
    </>
  );
};
