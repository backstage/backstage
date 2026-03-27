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

import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { cn } from '@backstage/core-components';
import { User, Users, Square, SquareCheckBig } from 'lucide-react';
import {
  type ReactNode,
  MouseEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityOwnerFilter } from '../../filters';
import { useDebouncedEffect } from '@react-hookz/web';
import { humanizeEntity, humanizeEntityRef } from '../EntityRefLink/humanize';
import { useFetchEntities } from './useFetchEntities';
import { useEntityPresentation } from '../../apis';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogAutocomplete } from '../CatalogAutocomplete';

/** @public */
export type CatalogReactEntityOwnerPickerClassKey = 'input';

/** @public */
export type FixedWidthFormControlLabelClassKey = 'label' | 'root';

/**
 * Tailwind-styled replacement for MUI's FormControlLabel with fixed-width constraints.
 * Replaces the previous MUI styled FormControlLabel pattern.
 */
function FixedWidthFormControlLabel(props: {
  control: ReactNode;
  label: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent) => void;
}) {
  return (
    // Keyboard interaction is handled by the parent CatalogAutocomplete listbox;
    // the onClick here only calls preventDefault() to avoid redundant toggling.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <label
      className={cn(
        'flex items-center w-[90%] cursor-pointer',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.control}
      <span className="w-full">{props.label}</span>
    </label>
  );
}

const icon = <Square className="h-4 w-4 text-muted-foreground" />;
const checkedIcon = <SquareCheckBig className="h-4 w-4 text-primary" />;

/**
 * @public
 */
export type EntityOwnerPickerProps = {
  mode?: 'owners-only' | 'all';
};

function RenderOptionLabel(props: { entity: Entity; isSelected: boolean }) {
  const isGroup = props.entity.kind.toLocaleLowerCase('en-US') === 'group';
  const { primaryTitle: title } = useEntityPresentation(props.entity);
  return (
    <div className="w-full">
      <FixedWidthFormControlLabel
        className="w-full"
        control={
          <span className="mr-2 flex items-center">
            {props.isSelected ? checkedIcon : icon}
          </span>
        }
        onClick={event => event.preventDefault()}
        label={
          <div title={title} className="flex items-center">
            {isGroup ? (
              <Users className="h-4 w-4 shrink-0" />
            ) : (
              <User className="h-4 w-4 shrink-0" />
            )}
            <span className="w-full overflow-hidden text-ellipsis ml-1">
              <span className="truncate block text-sm">{title}</span>
            </span>
          </div>
        }
      />
    </div>
  );
}

/** @public */
export const EntityOwnerPicker = (props?: EntityOwnerPickerProps) => {
  const { mode = 'owners-only' } = props || {};
  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();

  const [text, setText] = useState('');
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState<string[]>(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  const [{ value, loading }, handleFetch, cache] = useFetchEntities({
    mode,
    initialSelectedOwnersRefs: selectedOwners,
  });
  useDebouncedEffect(
    () => handleFetch({ text: text.toLocaleLowerCase('en-US') }),
    [text, handleFetch],
    250,
  );

  const availableOwners = value?.items || [];

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      const filter = new EntityOwnerFilter(queryParamOwners);
      setSelectedOwners(filter.values);
    }
  }, [queryParamOwners]);

  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length
        ? new EntityOwnerFilter(selectedOwners)
        : undefined,
    });
  }, [selectedOwners, updateFilters]);

  if (
    ['user', 'group'].includes(
      filters.kind?.value.toLocaleLowerCase('en-US') || '',
    )
  ) {
    return null;
  }

  return (
    <div className="py-2">
      <CatalogAutocomplete<Entity, true>
        label={t('entityOwnerPicker.title')}
        multiple
        disableCloseOnSelect
        loading={loading}
        options={availableOwners}
        value={selectedOwners as unknown as Entity[]}
        getOptionSelected={(o, v) => {
          if (typeof v === 'string') {
            return stringifyEntityRef(o) === v;
          }
          return o === v;
        }}
        getOptionLabel={o => {
          const entity =
            typeof o === 'string'
              ? cache.getEntity(o) ||
                parseEntityRef(o, {
                  defaultKind: 'group',
                  defaultNamespace: 'default',
                })
              : o;
          return humanizeEntity(entity, humanizeEntityRef(entity));
        }}
        onChange={(_: object, owners) => {
          setText('');
          setSelectedOwners(
            owners.map(e => {
              const entityRef =
                typeof e === 'string' ? e : stringifyEntityRef(e);

              if (typeof e !== 'string') {
                cache.setEntity(e);
              }
              return entityRef;
            }),
          );
        }}
        filterOptions={x => x}
        renderOption={(entity, { selected }) => {
          return <RenderOptionLabel entity={entity} isSelected={selected} />;
        }}
        name="owner-picker"
        onInputChange={(_e, inputValue) => {
          setText(inputValue);
        }}
        ListboxProps={{
          onScroll: (e: MouseEvent) => {
            const element = e.currentTarget;
            const hasReachedEnd =
              Math.abs(
                element.scrollHeight - element.clientHeight - element.scrollTop,
              ) < 1;

            if (hasReachedEnd && value?.cursor) {
              handleFetch({ items: value.items, cursor: value.cursor });
            }
          },
          'data-testid': 'owner-picker-listbox',
        }}
        LabelProps={{}}
        TextFieldProps={{}}
      />
    </div>
  );
};
