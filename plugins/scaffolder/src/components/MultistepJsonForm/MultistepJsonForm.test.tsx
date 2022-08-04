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

import { getReviewData } from './MultistepJsonForm';

describe('MultistepJsonForm', () => {
  const formDataMock = {
    password: 'password',
    masked: 'Some info to mask',
    open: 'Some open info',
    hidden: 'Some info to hide',
    'other-open': 'Other open info',
  };

  const formDataHideNameMock = {
    ...formDataMock,
    generation: 'Option 1',
  };

  const formDataDisplayNameMock = {
    ...formDataMock,
    generation: 'Option 2',
    name: 'Name info',
  };

  const stepsMock = [
    {
      title: 'The test template',
      schema: {
        title: 'The test template',
        properties: {
          password: {
            title: 'Password',
            type: 'string',
            'ui:widget': 'password',
          },
          masked: {
            title: 'Masked',
            type: 'string',
            'ui:backstage': {
              review: {
                mask: '******',
              },
            },
          },
          open: {
            title: 'Open info',
            type: 'string',
          },
        },
      },
    },
    {
      title: 'Other fields',
      schema: {
        title: 'Other fields',
        properties: {
          hidden: {
            title: 'Hidden',
            type: 'string',
            'ui:backstage': {
              review: {
                show: false,
              },
            },
          },
          'other-open': {
            title: 'Other Open Info',
            type: 'string',
          },
        },
      },
    },
  ];

  const stepsDependenciesMock = [
    ...stepsMock,
    {
      title: 'OneOf Fields',
      schema: {
        title: 'OneOf fields',
        properties: {
          generation: {
            title: 'Generation Method',
            type: 'string',
            enum: ['Option 1', 'Option 2'],
            default: 'Option 1',
          },
        },
        dependencies: {
          generation: {
            oneOf: [
              {
                properties: {
                  generation: {
                    const: 'Option 1',
                  },
                },
              },
              {
                required: ['name'],
                properties: {
                  generation: {
                    const: 'Option 2',
                  },
                  name: {
                    title: 'Name',
                    type: 'string',
                  },
                },
              },
            ],
          },
        },
      },
    },
  ];

  const renderPropertiesStepsMock = {
    step1: {
      password: { $id: 'root_password' },
      masked: { $id: 'root_masked' },
      open: { $id: 'root_open' },
    },
    step2: {
      hidden: { $id: 'root_hidden' },
      'other-open': { $id: 'root_other-open' },
    },
    step3: {
      generation: { $id: 'root_generation' },
    },
  };

  const renderPropertiesStepsHasNameMock = {
    ...renderPropertiesStepsMock,
    step3: {
      generation: { $id: 'root_generation' },
      name: { $id: 'root_name' },
    },
  };

  test('Fields are defined to be hidden or masked', () => {
    const reviewData = getReviewData(
      formDataMock,
      stepsMock,
      renderPropertiesStepsMock,
    );

    expect(reviewData.password).toBe('******');
    expect(reviewData.masked).toBe('******');
    expect(reviewData.open).toBe('Some open info');
    expect(reviewData.hidden).toBeUndefined();
    expect(reviewData['other-open']).toBe('Other open info');
  });

  test('Name field hide in review', () => {
    const reviewData = getReviewData(
      formDataHideNameMock,
      stepsDependenciesMock,
      renderPropertiesStepsMock,
    );

    expect(reviewData.generation).toBe('Option 1');
    expect(reviewData.name).toBeUndefined();
  });

  test('Name field display in review', () => {
    const reviewData = getReviewData(
      formDataDisplayNameMock,
      stepsDependenciesMock,
      renderPropertiesStepsHasNameMock,
    );

    expect(reviewData.generation).toBe('Option 2');
    expect(reviewData.name).toBe('Name info');
  });
});
