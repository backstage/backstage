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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
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
                show: true,
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

  test('Fields are defined to be hidden or masked', () => {
    const reviewData = getReviewData(formDataMock, stepsMock);

    expect(reviewData.password).toBe('******');
    expect(reviewData.masked).toBe('******');
    expect(reviewData.open).toBe('Some open info');
    expect(reviewData.hidden).toBeUndefined();
    expect(reviewData['other-open']).toBe('Other open info');
  });
});
