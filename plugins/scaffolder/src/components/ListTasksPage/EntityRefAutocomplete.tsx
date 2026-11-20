/*
 * Copyright 2026 The Backstage Authors
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

import { useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import useDebounce from 'react-use/esm/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const entityRefLabel = (ref: string) => {
  try {
    return humanizeEntityRef(parseEntityRef(ref), { defaultKind: 'template' });
  } catch {
    return ref;
  }
};

export const EntityRefAutocomplete = (props: {
  kind: 'user' | 'template';
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
}) => {
  const { kind, label, placeholder, value, onChange } = props;
  const catalogApi = useApi(catalogApiRef);
  const [input, setInput] = useState('');
  const [term, setTerm] = useState('');
  const [labels, setLabels] = useState<Record<string, string>>({});

  useDebounce(() => setTerm(input), 300, [input]);

  const { value: options = [], loading } = useAsync(async () => {
    try {
      const response = await catalogApi.queryEntities({
        filter: { kind },
        fullTextFilter: term
          ? {
              term,
              fields: [
                'metadata.name',
                'metadata.title',
                'spec.profile.displayName',
              ],
            }
          : undefined,
        fields: ['kind', 'metadata', 'spec.profile.displayName'],
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        limit: 20,
      });
      const found = (response?.items ?? []).map(entity => {
        const ref = stringifyEntityRef(entity);
        const title =
          entity.metadata.title ??
          (entity.spec?.profile as { displayName?: string } | undefined)
            ?.displayName;
        return { ref, label: title ?? entityRefLabel(ref) };
      });
      setLabels(prev => ({
        ...prev,
        ...Object.fromEntries(found.map(f => [f.ref, f.label])),
      }));
      return found.map(f => f.ref);
    } catch {
      return [];
    }
  }, [catalogApi, kind, term]);

  return (
    <Autocomplete<string, true>
      multiple
      size="small"
      filterOptions={refs => refs}
      options={[...new Set([...value, ...options])]}
      value={value}
      loading={loading}
      getOptionLabel={ref => labels[ref] ?? entityRefLabel(ref)}
      onChange={(_, selected) => onChange(selected)}
      onInputChange={(_, newInput, reason) => {
        if (reason === 'input') {
          setInput(newInput);
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};
