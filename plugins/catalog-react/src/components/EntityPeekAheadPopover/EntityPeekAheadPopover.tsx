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
import { catalogApiRef } from '../../api';
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { useApiHolder } from '@backstage/core-plugin-api';
import { isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import {
  Progress,
  ResponseErrorPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
} from '@backstage/core-components';
import {
  EntityCardActions,
  UserCardActions,
  GroupCardActions,
} from './CardActionComponents';
import { debounce } from 'lodash';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Properties for an entity popover on hover of a component.
 *
 * @public
 */
export type EntityPeekAheadPopoverProps = PropsWithChildren<{
  entityRef: string;
  delayTime?: number;
}>;

const maxTagChips = 4;

/**
 * Shows an entity popover on hover of a component.
 *
 * @public
 */
export const EntityPeekAheadPopover = (props: EntityPeekAheadPopoverProps) => {
  const { entityRef, children, delayTime = 500 } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const apiHolder = useApiHolder();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const debouncedHandleMouseEnter = useMemo(
    () => debounce(() => setIsHovered(true), delayTime),
    [delayTime],
  );

  const [{ loading, error, value: entity }, load] = useAsyncFn(async () => {
    const catalogApi = apiHolder.get(catalogApiRef);
    if (catalogApi) {
      const retrievedEntity = await catalogApi.getEntityByRef(entityRef);
      if (!retrievedEntity) {
        throw new Error(`${entityRef} not found`);
      }
      return retrievedEntity;
    }
    return undefined;
  }, [apiHolder, entityRef]);

  const handleOnMouseLeave = () => {
    setIsHovered(false);
    setIsOpen(false);
    debouncedHandleMouseEnter.cancel();
  };

  /* Open the popover after debounce fires and load data if not yet fetched */
  useEffect(() => {
    if (isHovered) {
      setIsOpen(true);
    }
  }, [isHovered]);

  useEffect(() => {
    if (isOpen && !entity && !error && !loading) {
      load();
    }
  }, [isOpen, load, entity, error, loading]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          data-testid="trigger"
          ref={triggerRef}
          onMouseEnter={() => debouncedHandleMouseEnter()}
          onMouseLeave={handleOnMouseLeave}
        >
          {children}
        </span>
      </PopoverTrigger>
      {isHovered && (
        <PopoverContent
          className={cn('w-[30em] p-0')}
          align="center"
          side="bottom"
          onMouseEnter={() => debouncedHandleMouseEnter.cancel()}
          onMouseLeave={handleOnMouseLeave}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div
            className={cn(
              'rounded-lg border bg-card text-card-foreground shadow-sm',
            )}
          >
            <div className="p-4">
              {error && <ResponseErrorPanel error={error} />}
              {loading && <Progress />}
              {entity && (
                <>
                  <p className="text-sm text-muted-foreground">
                    {entity.metadata.namespace}
                  </p>
                  <div className="text-lg font-semibold tracking-tight">
                    {entity.metadata.name}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {entity.kind}
                  </p>
                  {entity.metadata.description && (
                    <p className="overflow-hidden text-ellipsis line-clamp-2 mb-4">
                      {entity.metadata.description}
                    </p>
                  )}
                  <p className="text-sm">{entity.spec?.type?.toString()}</p>
                  <div className="mt-2">
                    {(entity.metadata.tags || [])
                      .slice(0, maxTagChips)
                      .map(tag => (
                        <span
                          key={tag}
                          className={cn(
                            'inline-flex items-center rounded-full border',
                            'px-2.5 py-0.5 text-xs font-semibold',
                            'mr-1 bg-secondary text-secondary-foreground',
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    {entity.metadata.tags?.length &&
                      entity.metadata.tags?.length > maxTagChips && (
                        <span
                          key="other-tags"
                          className={cn(
                            'inline-flex items-center rounded-full border',
                            'px-2.5 py-0.5 text-xs font-semibold',
                            'bg-secondary text-secondary-foreground',
                          )}
                          title={t('entityPeekAheadPopover.title')}
                        >
                          ...
                        </span>
                      )}
                  </div>
                </>
              )}
            </div>
            {!error && entity && (
              <div className={cn('flex items-center p-4 pt-0')}>
                {isUserEntity(entity) && <UserCardActions entity={entity} />}
                {isGroupEntity(entity) && <GroupCardActions entity={entity} />}
                <EntityCardActions entity={entity} />
              </div>
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
