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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FilterGroup, useEntityFilterGroup } from '../../filter';

type ComponentType =
  | 'service'
  | 'website'
  | 'library'
  | 'documentation'
  | 'other';

export type LabeledComponentType = {
  id: ComponentType;
  label: string;
};

const labeledEntityTypes: LabeledComponentType[] = [
  {
    id: 'service',
    label: 'Services',
  },
  {
    id: 'website',
    label: 'Websites',
  },
  {
    id: 'library',
    label: 'Libraries',
  },
  {
    id: 'documentation',
    label: 'Documentation',
  },
  {
    id: 'other',
    label: 'Other',
  },
];

const filterGroup: FilterGroup = {
  filters: Object.fromEntries(
    labeledEntityTypes.map(t => [
      t.id,
      (entity: Entity) => entity.spec?.type === t.id,
    ]),
  ),
};

type OnChangeCallback = (item: { type: string; label: string }) => void;

type Props = {
  onChange?: OnChangeCallback;
};

/**
 * The tabs at the top of the catalog list page, for component type filtering.
 */
export const CatalogTabs = ({ onChange }: Props) => {
  const { setSelectedFilters } = useEntityFilterGroup('type', filterGroup, [
    labeledEntityTypes[0].id,
  ]);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const onChangeRef = useRef<OnChangeCallback>();
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const type = labeledEntityTypes[currentTabIndex];
    onChangeRef.current?.({ type: type.id, label: type.label });
  }, [currentTabIndex]);

  const switchTab = useCallback(
    (index: Number) => {
      const type = labeledEntityTypes[index as number];
      setSelectedFilters([type.id]);
      setCurrentTabIndex(index as number);
      onChangeRef.current?.({ type: type.id, label: type.label });
    },
    [setSelectedFilters],
  );

  return <HeaderTabs tabs={labeledEntityTypes} onChange={switchTab} />;
};
