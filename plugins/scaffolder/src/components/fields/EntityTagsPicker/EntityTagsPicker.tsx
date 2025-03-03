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
import React, { useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import useEffectOnce from 'react-use/esm/useEffectOnce';
import { GetEntityFacetsRequest } from '@backstage/catalog-client';
import { makeValidator } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { EntityTagsPickerProps } from './schema';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export { EntityTagsPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `EntityTagsPicker`
 * field extension.
 *
 * @public
 */
export const EntityTagsPicker = (props: EntityTagsPickerProps) => {
  const { formData, onChange, uiSchema } = props;
  const catalogApi = useApi(catalogApiRef);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const tagValidator = makeValidator().isValidTag;
  const kinds = uiSchema['ui:options']?.kinds;
  const showCounts = uiSchema['ui:options']?.showCounts;
  const helperText = uiSchema['ui:options']?.helperText;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { loading, value: existingTags } = useAsync(async () => {
    const facet = 'metadata.tags';
    const tagsRequest: GetEntityFacetsRequest = { facets: [facet] };
    if (kinds) {
      tagsRequest.filter = { kind: kinds };
    }

    const { facets } = await catalogApi.getEntityFacets(tagsRequest);

    const tagFacets = Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );

    setTagOptions(
      Object.keys(tagFacets).sort((a, b) =>
        showCounts ? tagFacets[b] - tagFacets[a] : a.localeCompare(b),
      ),
    );

    return tagFacets;
  });

  const setTags = (_: React.ChangeEvent<{}>, values: string[] | null) => {
    // Reset error state in case all tags were removed
    let hasError = false;
    let addDuplicate = false;
    const currentTags = formData || [];

    // If adding a new tag
    if (values?.length && currentTags.length < values.length) {
      const newTag = (values[values.length - 1] = values[values.length - 1]
        .toLocaleLowerCase('en-US')
        .trim());
      hasError = !tagValidator(newTag);
      addDuplicate = currentTags.indexOf(newTag) !== -1;
    }

    setInputError(hasError);
    setInputValue(!hasError ? '' : inputValue);
    if (!hasError && !addDuplicate) {
      onChange(values || []);
    }
  };

  // Initialize field to always return an array
  useEffectOnce(() => onChange(formData || []));

  return (
    <FormControl margin="normal">
      <Autocomplete
        multiple
        freeSolo
        filterSelectedOptions
        onChange={setTags}
        disabled={isDisabled}
        value={formData || []}
        inputValue={inputValue}
        loading={loading}
        options={tagOptions}
        ChipProps={{ size: 'small' }}
        renderOption={option =>
          showCounts ? `${option} (${existingTags?.[option]})` : option
        }
        renderInput={params => (
          <TextField
            {...params}
            label={t('fields.entityTagsPicker.title')}
            disabled={isDisabled}
            onChange={e => setInputValue(e.target.value)}
            error={inputError}
            helperText={helperText ?? t('fields.entityTagsPicker.description')}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
          />
        )}
      />
    </FormControl>
  );
};
