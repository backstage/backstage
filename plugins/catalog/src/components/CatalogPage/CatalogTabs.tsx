/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { HeaderTabs } from '@backstage/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FilterGroup, useEntityFilterGroup } from '../../filter';

/**
 * A component type, and a human readable label for it.
 */
export type LabeledComponentType = {
  id: string;
  label: string;
};

/**
 * Called on mount, and when the selected tab changes.
 */
export type OnChangeCallback = (tab: LabeledComponentType) => void;

type Props = {
  tabs: LabeledComponentType[];
  onChange?: OnChangeCallback;
};

/**
 * The tabs at the top of the catalog list page, for component type filtering.
 */
export const CatalogTabs = ({ tabs, onChange }: Props) => {
  const filterGroup = useMemo<FilterGroup>(() => {
    const otherType = 'other';
    const wellKnownTypes = tabs.map(t => t.id).filter(t => t !== otherType);
    const isOtherType = (entity: Entity) =>
      !wellKnownTypes.includes(entity.spec?.type as string);

    return {
      filters: Object.fromEntries(
        tabs.map(t => [
          t.id,
          (entity: Entity) =>
            (t.id === otherType && isOtherType(entity)) ||
            entity.spec?.type === t.id,
        ]),
      ),
    };
  }, [tabs]);

  const { setSelectedFilters } = useEntityFilterGroup('type', filterGroup, [
    tabs[0].id,
  ]);

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  // Hold a reference to the callback
  const onChangeRef = useRef<OnChangeCallback>();
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(tabs[currentTabIndex]);
  }, [tabs, currentTabIndex]);

  const switchTab = useCallback(
    (index: number) => {
      const tab = tabs[index];
      setSelectedFilters([tab.id]);
      setCurrentTabIndex(index);
      onChangeRef.current?.(tab);
    },
    [tabs, setSelectedFilters],
  );

  return <HeaderTabs tabs={tabs} onChange={switchTab} />;
};
