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
import { useApi } from '@backstage/core-plugin-api';
import {
  EntityDisplayName,
  EntityRefPresentationSnapshot,
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteChangeReason,
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { useCallback, useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { EntityPickerProps } from './schema';
import { VirtualizedListbox } from '../VirtualizedListbox';
import { buildCatalogFilter } from './utils';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';

export { EntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `EntityPicker`
 * field extension.
 *
 * @public
 */
export const EntityPicker = (props: EntityPickerProps) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    onChange,
    schema: {
      title = t('fields.entityPicker.title'),
      description = t('fields.entityPicker.description'),
    },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema,
    errors,
  } = props;
  const allowedKinds = uiSchema['ui:options']?.allowedKinds;
  const catalogFilter = buildCatalogFilter(
    uiSchema['ui:options']?.catalogFilter ||
      (allowedKinds && { kind: allowedKinds }),
  );
  const defaultKind = uiSchema['ui:options']?.defaultKind;
  const defaultNamespace =
    uiSchema['ui:options']?.defaultNamespace || undefined;
  const autoSelect = uiSchema?.['ui:options']?.autoSelect ?? true;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const catalogApi = useApi(catalogApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);

  const { value: entities, loading } = useAsync(async () => {
    const fields = [
      'kind',
      'metadata.name',
      'metadata.namespace',
      'metadata.title',
      'metadata.description',
      'spec.profile.displayName',
      'spec.type',
    ];
    const { items } = await catalogApi.getEntities(
      catalogFilter
        ? { filter: catalogFilter, fields }
        : { filter: undefined, fields },
    );

    const entityRefToPresentation = new Map<
      string,
      EntityRefPresentationSnapshot
    >(
      await Promise.all(
        items.map(async item => {
          const presentation = await entityPresentationApi.forEntity(item)
            .promise;
          return [stringifyEntityRef(item), presentation] as [
            string,
            EntityRefPresentationSnapshot,
          ];
        }),
      ),
    );

    return { catalogEntities: items, entityRefToPresentation };
  });

  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;

  const getLabel = useCallback(
    (freeSoloValue: string) => {
      try {
        // Will throw if defaultKind or defaultNamespace are not set
        const parsedRef = parseEntityRef(freeSoloValue, {
          defaultKind,
          defaultNamespace,
        });

        return stringifyEntityRef(parsedRef);
      } catch (err) {
        return freeSoloValue;
      }
    },
    [defaultKind, defaultNamespace],
  );

  const onSelect = useCallback(
    (_: any, ref: string | Entity | null, reason: AutocompleteChangeReason) => {
      // ref can either be a string from free solo entry or
      if (typeof ref !== 'string') {
        // if ref does not exist: pass 'undefined' to trigger validation for required value
        onChange(ref ? stringifyEntityRef(ref as Entity) : undefined);
      } else {
        if (reason === 'blur' || reason === 'create-option') {
          // Add in default namespace, etc.
          let entityRef = ref;
          try {
            // Attempt to parse the entity ref into it's full form.
            entityRef = stringifyEntityRef(
              parseEntityRef(ref as string, {
                defaultKind,
                defaultNamespace,
              }),
            );
          } catch (err) {
            // If the passed in value isn't an entity ref, do nothing.
          }
          // We need to check against formData here as that's the previous value for this field.
          if (formData !== ref || allowArbitraryValues) {
            onChange(entityRef);
          }
        }
      }
    },
    [onChange, formData, defaultKind, defaultNamespace, allowArbitraryValues],
  );

  // Since free solo can be enabled, attempt to parse as a full entity ref first, then fall
  // back to the given value.
  const selectedEntity =
    entities?.catalogEntities.find(e => stringifyEntityRef(e) === formData) ??
    (allowArbitraryValues && formData ? getLabel(formData) : '');

  useEffect(() => {
    if (
      required &&
      !allowArbitraryValues &&
      entities?.catalogEntities.length === 1 &&
      selectedEntity === ''
    ) {
      onChange(stringifyEntityRef(entities.catalogEntities[0]));
    }
  }, [entities, onChange, selectedEntity, required, allowArbitraryValues]);

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
      required={required}
      disabled={isDisabled}
      errors={errors}
    >
      <Autocomplete
        disabled={
          isDisabled ||
          (required &&
            !allowArbitraryValues &&
            entities?.catalogEntities.length === 1)
        }
        id={idSchema?.$id}
        value={selectedEntity}
        loading={loading}
        onChange={onSelect}
        options={entities?.catalogEntities || []}
        getOptionLabel={option =>
          // option can be a string due to freeSolo.
          typeof option === 'string'
            ? option
            : entities?.entityRefToPresentation.get(stringifyEntityRef(option))
                ?.entityRef!
        }
        autoSelect={autoSelect}
        freeSolo={allowArbitraryValues}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            variant="outlined"
            required={required}
            disabled={isDisabled}
            InputProps={params.InputProps}
          />
        )}
        renderOption={option => <EntityDisplayName entityRef={option} />}
        filterOptions={createFilterOptions<Entity>({
          stringify: option =>
            entities?.entityRefToPresentation.get(stringifyEntityRef(option))
              ?.primaryTitle!,
        })}
        ListboxComponent={VirtualizedListbox}
      />
    </ScaffolderField>
  );
};
