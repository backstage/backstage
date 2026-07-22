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
import { renderHook, waitFor } from '@testing-library/react';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { useApi } from '@backstage/core-plugin-api';

import {
  useContentCard,
  useGoldenPathParameterSchema,
} from './ContentCard.utils';

const STEPS = [
  {
    uiSchema: {},
    mergedSchema: {},
    schema: {},
    title: 'Test',
  },
];
const MANIFEST = { title: 'manifest', steps: [] };
const NEW_FORM_STATE = { name: 'Frodo' };

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  useTemplateSchema: jest.fn(() => ({ steps: STEPS })),
}));

const SCHEMA = {
  title: 'schema title',
  steps: [
    {
      title: 'step 1',
      schema: {},
    },
  ],
};
const GP_REF = 'Lord of the Rings';
jest.mock('@backstage/plugin-golden-paths-react', () => {
  const getGoldenPathParameterSchema = jest.fn(() => Promise.resolve(SCHEMA));
  return {
    useGoldenPathRef: jest.fn(() => GP_REF),
    goldenPathsApiRef: {
      id: 'golden-paths',
      T: { getGoldenPathParameterSchema },
    },
    useGoldenPathContext: jest.fn(() => ({ fieldExtensions: [] })),
  };
});

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(({ T }) => ({ ...T })),
}));

jest.mock('./FieldOverrides', () => ({
  DescriptionField: () => <div />,
}));

describe('useContentCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return a proper structure of an object', () => {
    const { result } = renderHook(() => useContentCard(MANIFEST));

    expect(result.current.isFilled).toBe(false);
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.handleChange).toBeDefined();
    expect(result.current.goBack).toBeDefined();
    expect(result.current.formState).toEqual({});
    expect(result.current.formSchema).toBe(STEPS[0].schema);
    expect(result.current.formUiSchema).toBe(STEPS[0].uiSchema);
    expect(result.current.reviewSchemas).toBe(STEPS);
  });

  it('should update `formState` and set `isFilled` to `true` when calling `handleSubmit`', async () => {
    const { result } = renderHook(() => useContentCard(MANIFEST));

    expect(result.current.isFilled).toBe(false);
    expect(result.current.formState).toEqual({});

    await waitFor(() => {
      result.current.handleSubmit({ formData: NEW_FORM_STATE });

      expect(result.current.isFilled).toBe(true);
      expect(result.current.formState).toEqual(NEW_FORM_STATE);
    });
  });

  it('should set `isFilled` back to `false` after `goBack` is called', async () => {
    const { result } = renderHook(() => useContentCard(MANIFEST));

    expect(result.current.isFilled).toBe(false);

    await waitFor(() => {
      result.current.handleSubmit({ formData: NEW_FORM_STATE });

      expect(result.current.isFilled).toBe(true);
    });

    await waitFor(() => {
      result.current.goBack();

      expect(result.current.isFilled).toBe(false);
    });
  });

  it('should update `formState` when calling `handleChange`', async () => {
    const { result } = renderHook(() => useContentCard(MANIFEST));
    expect(result.current.formState).toEqual({});

    await waitFor(() => {
      result.current.handleChange({ formData: NEW_FORM_STATE });

      expect(result.current.formState).toEqual(NEW_FORM_STATE);
    });
  });
});

describe('useGoldenPathParameterSchema', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return a proper initial structure of an object', async () => {
    const { result } = renderHook(() => useGoldenPathParameterSchema());

    await waitFor(() => {
      expect(result.current).toEqual({
        error: undefined,
        loading: true,
        manifest: undefined,
      });
    });
  });

  it('should call `getGoldenPathParameterSchema` with a proper argument', async () => {
    const getSpy = jest.spyOn(
      useApi(goldenPathsApiRef),
      'getGoldenPathParameterSchema',
    );
    renderHook(() => useGoldenPathParameterSchema());

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledWith(GP_REF);
    });
  });

  it('should return a proper structure of an object after API call is finished', async () => {
    const { result } = renderHook(() => useGoldenPathParameterSchema());

    await waitFor(() => {
      expect(result.current).toEqual({
        error: undefined,
        loading: false,
        manifest: SCHEMA,
      });
    });
  });
});
