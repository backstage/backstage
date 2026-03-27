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

import { EntityErrorFilter, EntityOrphanFilter } from '../../filters';
import { useState } from 'react';
import { useEntityList } from '../../hooks';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogAutocomplete } from '../CatalogAutocomplete';
import { cn } from '@backstage/core-components';
import { CheckSquare2, Square } from 'lucide-react';

/** @public */
export type CatalogReactEntityProcessingStatusPickerClassKey = 'input';

const icon = <Square className="h-4 w-4 text-muted-foreground" />;
const checkedIcon = <CheckSquare2 className="h-4 w-4 text-primary" />;

/** @public */
export const EntityProcessingStatusPicker = () => {
  const { updateFilters } = useEntityList();
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const [selectedAdvancedItems, setSelectedAdvancedItems] = useState<string[]>(
    [],
  );

  function orphanChange(value: boolean) {
    updateFilters({
      orphan: value ? new EntityOrphanFilter(value) : undefined,
    });
  }

  function errorChange(value: boolean) {
    updateFilters({
      error: value ? new EntityErrorFilter(value) : undefined,
    });
  }

  const availableAdvancedItems = ['Is Orphan', 'Has Error'];

  return (
    <div className={cn('py-2')}>
      <CatalogAutocomplete<string, true>
        label={t('entityProcessingStatusPicker.title')}
        multiple
        disableCloseOnSelect
        options={availableAdvancedItems}
        value={selectedAdvancedItems}
        onChange={(_: object, value: string[]) => {
          setSelectedAdvancedItems(value);
          orphanChange(value.includes('Is Orphan'));
          errorChange(value.includes('Has Error'));
        }}
        renderOption={(option, { selected }) => (
          <div className="flex items-center gap-2 cursor-pointer">
            {selected ? checkedIcon : icon}
            {/* eslint-disable-next-line react/forbid-elements */}
            <span className="text-sm">{option}</span>
          </div>
        )}
        name="processing-status-picker"
        LabelProps={{ className: 'font-bold text-sm' }}
        TextFieldProps={{ className: '' }}
      />
    </div>
  );
};
