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

import {
  type Key,
  ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import TextField from '@material-ui/core/TextField';
import { MyGroupsPickerProps, MyGroupsPickerSchema } from './schema';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { EntityDisplayName } from '@backstage/plugin-catalog-react';
import { NotFoundError } from '@backstage/errors';
import useAsync from 'react-use/esm/useAsync';
import {
  Entity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { VirtualizedListbox } from '../VirtualizedListbox';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import {
  ScaffolderField,
  useScaffolderTheme,
} from '@backstage/plugin-scaffolder-react/alpha';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';
import { useEntityPickerOptions } from '../useEntityPickerOptions';

export { MyGroupsPickerSchema };

export const MyGroupsPicker = (props: MyGroupsPickerProps) => {
  const theme = useScaffolderTheme();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    schema: {
      title = t('fields.myGroupsPicker.title'),
      description = t('fields.myGroupsPicker.description'),
    },
    required,
    rawErrors,
    onChange,
    formData,
    uiSchema,
    idSchema,
    errors,
  } = props;

  const identityApi = useApi(identityApiRef);
  const errorApi = useApi(errorApiRef);
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const { value: userEntityRef, loading: identityLoading } = useAsync(
    async () => {
      const { userEntityRef: identityEntityRef } =
        await identityApi.getBackstageIdentity();

      if (!identityEntityRef) {
        errorApi.post(new NotFoundError('No user entity ref found'));
        return undefined;
      }

      return identityEntityRef;
    },
  );
  const catalogFilter = useMemo(
    () =>
      userEntityRef
        ? {
            kind: 'Group',
            ['relations.hasMember']: [userEntityRef],
          }
        : undefined,
    [userEntityRef],
  );
  const selectedEntityRef = useMemo(() => {
    if (!formData) {
      return undefined;
    }
    try {
      return stringifyEntityRef(parseEntityRef(formData));
    } catch {
      return undefined;
    }
  }, [formData]);
  const selectedEntityRefs = useMemo(
    () => (selectedEntityRef ? [selectedEntityRef] : []),
    [selectedEntityRef],
  );
  const {
    entities,
    selectedEntities,
    entityRefToPresentation,
    loading,
    loadingState,
    setSearchText,
    loadMore,
    initialResultIsOnlyOption,
  } = useEntityPickerOptions({
    catalogFilter,
    enabled: !identityLoading && Boolean(userEntityRef),
    selectedEntityRefs,
  });

  // MUI: update handler
  const updateChange = (_: ChangeEvent<{}>, value: Entity | null) => {
    setSearchText('');
    onChange(value ? stringifyEntityRef(value) : '');
  };

  const selectedEntity =
    entities.find(e => stringifyEntityRef(e) === selectedEntityRef) ??
    selectedEntities.find(e => stringifyEntityRef(e) === selectedEntityRef) ??
    null;
  const muiOptions = useMemo(
    () =>
      selectedEntity && !entities.includes(selectedEntity)
        ? [selectedEntity, ...entities]
        : entities,
    [entities, selectedEntity],
  );

  // BUI: options
  const buiOptions = useMemo(() => {
    const options = muiOptions.map(entity => {
      const entityRef = stringifyEntityRef(entity);
      const presentation = entityRefToPresentation.get(entityRef);
      return {
        value: entityRef,
        label: presentation?.primaryTitle || entityRef,
      };
    });
    if (
      selectedEntityRef &&
      !options.some(option => option.value === selectedEntityRef)
    ) {
      options.unshift({
        value: selectedEntityRef,
        label:
          entityRefToPresentation.get(selectedEntityRef)?.primaryTitle ||
          formData ||
          selectedEntityRef,
      });
    }
    return options;
  }, [entityRefToPresentation, formData, muiOptions, selectedEntityRef]);

  const [inputValue, setInputValue] = useState('');
  const inputIsDirtyRef = useRef(false);
  const previousFormDataRef = useRef(formData);
  const selectedPresentationTitle = formData
    ? entityRefToPresentation.get(selectedEntityRef ?? formData)?.primaryTitle
    : undefined;

  useEffect(() => {
    if (previousFormDataRef.current !== formData) {
      previousFormDataRef.current = formData;
      inputIsDirtyRef.current = false;
    }
    if (!inputIsDirtyRef.current) {
      setInputValue(formData ? selectedPresentationTitle || formData : '');
    }
  }, [formData, selectedPresentationTitle]);

  const selectedKey =
    selectedEntityRef && buiOptions.some(o => o.value === selectedEntityRef)
      ? selectedEntityRef
      : null;

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      inputIsDirtyRef.current = false;
      setSearchText('');
      onChange(key !== null ? String(key) : '');
    },
    [onChange, setSearchText],
  );

  useEffect(() => {
    if (required && initialResultIsOnlyOption && !selectedEntity) {
      onChange(stringifyEntityRef(entities[0]));
    }
  }, [entities, initialResultIsOnlyOption, onChange, selectedEntity, required]);

  if (theme === 'bui') {
    const isAutoSelected = required && initialResultIsOnlyOption;

    return (
      <ScaffolderField
        rawErrors={rawErrors}
        rawDescription={uiSchema['ui:description'] ?? description}
        required={required}
        disabled={isDisabled}
        errors={errors}
      >
        <BuiAutocomplete
          id={idSchema?.$id}
          label={title}
          isRequired={required}
          isDisabled={isDisabled || isAutoSelected}
          selectedKey={selectedKey}
          onSelectionChange={handleSelectionChange}
          options={buiOptions}
          search={{
            mode: 'server',
            inputValue,
            onInputChange: value => {
              inputIsDirtyRef.current = true;
              setInputValue(value);
              setSearchText(value);
            },
          }}
          loading={{ state: loadingState, onLoadMore: loadMore }}
          allowsCustomValue={false}
          isInvalid={rawErrors && rawErrors.length > 0}
        />
      </ScaffolderField>
    );
  }

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
      required={required}
      disabled={isDisabled}
      errors={errors}
    >
      <Autocomplete
        disabled={isDisabled || (required && initialResultIsOnlyOption)}
        id="OwnershipEntityRefPicker-dropdown"
        options={muiOptions}
        value={selectedEntity}
        loading={identityLoading || loading}
        onChange={updateChange}
        onInputChange={(_event, value, reason) => {
          if (reason === 'input' || reason === 'clear') {
            setSearchText(value);
          }
        }}
        getOptionLabel={option =>
          entityRefToPresentation.get(stringifyEntityRef(option))?.primaryTitle!
        }
        getOptionSelected={(option, value) =>
          stringifyEntityRef(option) === stringifyEntityRef(value)
        }
        filterSelectedOptions
        autoSelect
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
        renderOption={option => <EntityDisplayName entityRef={option} />}
        filterOptions={options => options}
        ListboxComponent={VirtualizedListbox}
        ListboxProps={{
          onScroll: (event: MouseEvent) => {
            const element = event.currentTarget;
            if (
              Math.abs(
                element.scrollHeight - element.clientHeight - element.scrollTop,
              ) < 1
            ) {
              loadMore();
            }
          },
        }}
      />
    </ScaffolderField>
  );
};
