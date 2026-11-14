/*
 * Copyright 2021 The Backstage Authors
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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { Select } from '@backstage/ui';
import { useCallback, useMemo } from 'react';
import { useRelations } from '../../hooks';
import { catalogGraphTranslationRef } from '../../translation';

/**
 * @public
 * @deprecated The filter is styled with CSS modules and no longer reads theme
 * overrides, so this type has no effect and will be removed.
 */
export type SelectedRelationsFilterClassKey = 'formControl';

export type Props = {
  relations?: string[];
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
};

export const SelectedRelationsFilter = (props: Props) => {
  const { relations: incomingRelations, value, onChange } = props;

  const { relations, includeRelation } = useRelations({
    relations: incomingRelations,
  });

  const defaultValue = useMemo(
    () => relations.filter(rel => includeRelation(rel)),
    [relations, includeRelation],
  );
  const options = useMemo(
    () => relations.map(rel => ({ value: rel, label: rel })),
    [relations],
  );
  const { t } = useTranslationRef(catalogGraphTranslationRef);

  // Selecting nothing is the same as using the default set of relations
  const handleChange = useCallback(
    (selection: unknown) => {
      const selected = selection as string[];
      onChange(selected.length ? selected : undefined);
    },
    [onChange],
  );

  return (
    <Select
      selectionMode="multiple"
      search
      label={t('catalogGraphPage.selectedRelationsFilter.title')}
      options={options}
      value={value ?? defaultValue}
      onChange={handleChange}
    />
  );
};
