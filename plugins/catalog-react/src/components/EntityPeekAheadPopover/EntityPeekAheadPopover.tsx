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

import useAsyncFn from 'react-use/esm/useAsyncFn';
import { PropsWithChildren, useRef } from 'react';
import { useFocusable } from 'react-aria';
import { useApiHolder } from '@backstage/core-plugin-api';
import { isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import {
  Alert,
  Box,
  Flex,
  Popover,
  PreviewTrigger,
  Skeleton,
  Tag,
  TagGroup,
  Text,
} from '@backstage/ui';
import { catalogApiRef } from '../../api';
import {
  EntityCardActions,
  UserCardActions,
  GroupCardActions,
} from './CardActionComponents';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import styles from './EntityPeekAheadPopover.module.css';

/**
 * Properties for an entity popover on hover of a component.
 *
 * @public
 */
export type EntityPeekAheadPopoverProps = PropsWithChildren<{
  entityRef: string;
  /** The opening delay in milliseconds. Defaults to 500. */
  delayTime?: number;
}>;

// Keep accepting arbitrary children without requiring them to forward a DOM ref
// or React Aria's interaction props. Focus events from child links still bubble.
function PeekAheadTrigger({ children }: PropsWithChildren<{}>) {
  const ref = useRef<HTMLSpanElement>(null);
  const { focusableProps } = useFocusable({}, ref);
  return (
    <Text<'span'> as="span" {...focusableProps} ref={ref} tabIndex={-1}>
      {children}
    </Text>
  );
}

/**
 * Shows an interactive entity preview on hover or keyboard focus.
 *
 * @public
 */
export const EntityPeekAheadPopover = (props: EntityPeekAheadPopoverProps) => {
  const { entityRef, children, delayTime = 500 } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const apiHolder = useApiHolder();
  const [{ loading, error, value: entity }, load] = useAsyncFn(async () => {
    const catalogApi = apiHolder.get(catalogApiRef);
    if (!catalogApi) {
      return undefined;
    }
    const retrievedEntity = await catalogApi.getEntityByRef(entityRef);
    if (!retrievedEntity) {
      throw new Error(`${entityRef} not found`);
    }
    return retrievedEntity;
  }, [apiHolder, entityRef]);

  return (
    <PreviewTrigger
      delay={delayTime}
      onOpenChange={isOpen => {
        if (isOpen && !entity && !error && !loading) {
          load();
        }
      }}
    >
      <PeekAheadTrigger>{children}</PeekAheadTrigger>
      <Popover
        placement="bottom"
        className={styles.popover}
        aria-label={entityRef}
      >
        <Flex direction="column" gap="3">
          {error && <Alert status="danger" title={error.toString()} />}
          {loading && <Skeleton height={120} />}
          {entity && (
            <>
              <Box>
                <Text as="p" color="secondary">
                  {entity.metadata.namespace}
                </Text>
                <Text as="h3" variant="title-small">
                  {entity.metadata.name}
                </Text>
                <Text as="p" color="secondary">
                  {entity.kind}
                </Text>
              </Box>
              {entity.metadata.description && (
                <Text as="p" className={styles.description}>
                  {entity.metadata.description}
                </Text>
              )}
              {entity.spec?.type && (
                <Text as="p">{entity.spec.type.toString()}</Text>
              )}
              {!!entity.metadata.tags?.length && (
                <TagGroup aria-label={t('entityTagPicker.title')}>
                  {entity.metadata.tags.slice(0, 4).map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {entity.metadata.tags.length > 4 && (
                    <Tag aria-label={t('entityPeekAheadPopover.title')}>
                      ...
                    </Tag>
                  )}
                </TagGroup>
              )}
              <Flex gap="1" className={styles.actions}>
                {isUserEntity(entity) && <UserCardActions entity={entity} />}
                {isGroupEntity(entity) && <GroupCardActions entity={entity} />}
                <EntityCardActions entity={entity} />
              </Flex>
            </>
          )}
        </Flex>
      </Popover>
    </PreviewTrigger>
  );
};
