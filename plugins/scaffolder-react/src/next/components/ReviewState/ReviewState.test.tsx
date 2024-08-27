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

import React from 'react';
import { ReviewState } from './ReviewState';
import { render } from '@testing-library/react';
import { ParsedTemplateSchema } from '../../hooks/useTemplateSchema';

describe('ReviewState', () => {
  it('should render the text as normal with no options', () => {
    const formState = {
      name: 'John Doe',
      test: 'bob',
    };

    const { getByRole } = render(
      <ReviewState formState={formState} schemas={[]} />,
    );

    expect(getByRole('row', { name: 'Name John Doe' })).toBeInTheDocument();
    expect(getByRole('row', { name: 'Test bob' })).toBeInTheDocument();
  });

  it('should mask password ui:fields', () => {
    const formState = {
      name: 'John Doe',
      test: 'bob',
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              'ui:widget': 'password',
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
        description: 'asd',
      },
    ];

    const { getByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(getByRole('row', { name: 'Name ******' })).toBeInTheDocument();
  });

  it('should hide from review if show is not set', async () => {
    const formState = {
      name: 'John Doe',
      test: 'bob',
      nest: {
        foo: 'bar',
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              'ui:widget': 'password',
              'ui:backstage': {
                review: {
                  show: false,
                },
              },
            },
            nest: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  'ui:widget': 'password',
                  'ui:backstage': {
                    review: {
                      show: false,
                    },
                  },
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
        description: 'asd',
      },
    ];

    const { queryByRole, getAllByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );
    expect(getAllByRole('row').length).toEqual(1);
    expect(queryByRole('row', { name: 'Name ******' })).not.toBeInTheDocument();
    expect(queryByRole('row', { name: 'Foo ******' })).not.toBeInTheDocument();
  });

  it('should allow for masking an option with a set text', () => {
    const formState = {
      name: 'John Doe',
      test: 'bob',
      nest: {
        foo: 'bar',
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              'ui:widget': 'password',
              'ui:backstage': {
                review: {
                  mask: 'lols',
                },
              },
            },
            nest: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  'ui:widget': 'password',
                  'ui:backstage': {
                    review: {
                      mask: 'lols',
                    },
                  },
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
        description: 'asd',
      },
    ];

    const { getByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(getByRole('row', { name: 'Name lols' })).toBeInTheDocument();
    expect(getByRole('row', { name: 'Test bob' })).toBeInTheDocument();
    expect(getByRole('row', { name: 'Nest > Foo lols' })).toBeInTheDocument();
  });

  it('should display enum label from enumNames', async () => {
    const formState = {
      name: 'type2',
      nest: {
        foo: 'type2',
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              default: 'type1',
              enum: ['type1', 'type2', 'type3'],
              enumNames: ['Label-type1', 'Label-type2', 'Label-type3'],
            },
            nest: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  default: 'type1',
                  enum: ['type1', 'type2', 'type3'],
                  enumNames: ['Label-type1', 'Label-type2', 'Label-type3'],
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
        description: 'asd',
      },
    ];

    const { queryByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(
      queryByRole('row', { name: 'Name Label-type2' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Nest > Foo Label-type2' }),
    ).toBeInTheDocument();
  });

  it('should display enum value if no corresponding enumNames', async () => {
    const formState = {
      name: 'type4',
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              default: 'type1',
              enum: ['type1', 'type2', 'type3', 'type4'],
              enumNames: ['Label-type1', 'Label-type2', 'Label-type3'],
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
        description: 'asd',
      },
    ];

    const { queryByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(queryByRole('row', { name: 'Name type4' })).toBeInTheDocument();
  });

  it('should display object in separate rows', async () => {
    const formState = {
      name: {
        foo: 'type3',
        bar: 'type4',
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  default: 'type1',
                },
                bar: {
                  type: 'string',
                  default: 'type2',
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const { queryByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(
      queryByRole('row', { name: 'Name > Foo type3' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Bar type4' }),
    ).toBeInTheDocument();
  });

  it('should display nested objects in separate rows', async () => {
    const formState = {
      name: {
        foo: 'type3',
        bar: 'type4',
        example: {
          test: 'type6',
          foo: 'type7',
        },
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  default: 'type1',
                },
                bar: {
                  type: 'string',
                  default: 'type2',
                },
                example: {
                  type: 'object',
                  properties: {
                    test: {
                      type: 'string',
                    },
                    foo: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const { queryByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(
      queryByRole('row', { name: 'Name > Foo type3' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Bar type4' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Example > Test type6' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Example > Foo type7' }),
    ).toBeInTheDocument();
  });

  it('should display partially nested objects', async () => {
    const formState = {
      name: {
        foo: 'type3',
        bar: 'type4',
        example: {
          test: 'type6',
        },
      },
    };

    const schemas: ParsedTemplateSchema[] = [
      {
        mergedSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string',
                  default: 'type1',
                },
                bar: {
                  type: 'string',
                  default: 'type2',
                },
                example: {
                  type: 'object',
                  'ui:backstage': {
                    review: {
                      explode: false,
                    },
                  },
                  properties: {
                    test: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        schema: {},
        title: 'test',
        uiSchema: {},
      },
    ];

    const { queryByRole } = render(
      <ReviewState formState={formState} schemas={schemas} />,
    );

    expect(
      queryByRole('row', { name: 'Name > Foo type3' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Bar type4' }),
    ).toBeInTheDocument();
    expect(
      queryByRole('row', { name: 'Name > Example > Test type6' }),
    ).not.toBeInTheDocument();
  });
});
