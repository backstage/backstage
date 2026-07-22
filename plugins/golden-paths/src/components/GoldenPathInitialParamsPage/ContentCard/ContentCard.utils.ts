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
import { useMemo, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { useTemplateSchema } from '@backstage/plugin-scaffolder-react/alpha';
import type { JsonValue } from '@backstage/types';
import {
  GoldenPathParameterSchema,
  goldenPathsApiRef,
  useGoldenPathContext,
  useGoldenPathRef,
} from '@backstage/plugin-golden-paths-react';
import useAsync from 'react-use/esm/useAsync';

import * as FieldOverrides from './FieldOverrides';

export const useContentCard = (manifest: GoldenPathParameterSchema) => {
  const [isFilled, setIsFilled] = useState(false);
  const { steps } = useTemplateSchema(manifest);
  const [formState, setFormState] = useState<Record<string, JsonValue>>({});
  const { fieldExtensions } = useGoldenPathContext();

  const extensions = useMemo(() => {
    return Object.fromEntries(
      fieldExtensions.map(({ name, component }) => [name, component]),
    );
  }, [fieldExtensions]);

  const fields = useMemo(
    () => ({ ...FieldOverrides, ...extensions }),
    [extensions],
  );

  const handleSubmit = ({
    formData = {},
  }: {
    formData?: Record<string, JsonValue>;
  }) => {
    setFormState(current => ({
      ...current,
      ...formData,
    }));
    setIsFilled(true);
  };

  const handleChange = ({
    formData = {},
  }: {
    formData?: Record<string, JsonValue>;
  }) => {
    setFormState(current => ({
      ...current,
      ...formData,
    }));
  };

  const goBack = () => {
    setIsFilled(false);
  };

  return {
    isFilled,
    handleSubmit,
    handleChange,
    goBack,
    formState,
    formSchema: steps[0].schema,
    formUiSchema: steps[0].uiSchema,
    reviewSchemas: steps,
    fields,
  };
};

export const useGoldenPathParameterSchema = () => {
  const goldenPathRef = useGoldenPathRef();
  const goldenPathsApi = useApi(goldenPathsApiRef);

  const {
    loading,
    error,
    value: manifest,
  } = useAsync(
    async () =>
      await goldenPathsApi.getGoldenPathParameterSchema(goldenPathRef),
    [],
  );

  return { loading, error, manifest };
};
