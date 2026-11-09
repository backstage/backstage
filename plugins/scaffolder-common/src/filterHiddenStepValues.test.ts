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
import { JsonObject } from '@backstage/types';
import {
  filterHiddenStepValues,
  resolveParameterSteps,
} from './filterHiddenStepValues';

describe('filterHiddenStepValues', () => {
  it('removes hidden nested fields but preserves visible fields, unrelated data, and the original input', () => {
    const values = {
      config: { project: 'keep', awsRegion: 'remove', unrelated: 'keep' },
      shared: 'keep',
      hidden: 'remove',
      'literal.name': 'remove',
      literal: { name: 'keep' },
      unrelated: 'keep',
    };
    const steps = [
      {
        visible: true,
        schema: {
          properties: {
            config: { properties: { project: { type: 'string' } } },
            shared: { type: 'string' },
          },
        },
      },
      {
        visible: false,
        schema: {
          properties: {
            config: { properties: { awsRegion: { type: 'string' } } },
            shared: { type: 'string' },
            hidden: { type: 'string' },
            'literal.name': { type: 'string' },
          },
        },
      },
    ];
    expect(filterHiddenStepValues(values, steps)).toEqual({
      config: { project: 'keep', unrelated: 'keep' },
      shared: 'keep',
      literal: { name: 'keep' },
      unrelated: 'keep',
    });
    expect(values.config.awsRegion).toBe('remove');
    expect(values.hidden).toBe('remove');
    expect(values['literal.name']).toBe('remove');
    expect(filterHiddenStepValues(values, steps.slice(0, 1))).toBe(values);
  });

  it('resolves local references within each step, including escaped names and recursive object fields', () => {
    const visible: JsonObject = {
      definitions: {
        'Config/Fields~': { properties: { project: { type: 'string' } } },
      },
      properties: { config: { $ref: '#/definitions/Config~1Fields~0' } },
    };
    const hidden: JsonObject = {
      definitions: {
        'Config/Fields~': { properties: { awsRegion: { type: 'string' } } },
      },
      allOf: [
        { properties: { config: { $ref: '#/definitions/Config~1Fields~0' } } },
      ],
    };
    expect(
      filterHiddenStepValues(
        { config: { project: 'keep', awsRegion: 'remove' } },
        [
          { visible: true, schema: visible },
          { visible: false, schema: hidden },
        ],
      ),
    ).toEqual({ config: { project: 'keep' } });

    const recursive = (field: string): JsonObject => ({
      definitions: {
        Node: {
          properties: {
            [field]: { type: 'string' },
            child: { $ref: '#/definitions/Node' },
          },
        },
      },
      $ref: '#/definitions/Node',
    });
    expect(
      filterHiddenStepValues(
        {
          label: 'keep',
          hidden: 'remove',
          child: { label: 'keep', hidden: 'remove' },
        },
        [
          { visible: true, schema: recursive('label') },
          { visible: false, schema: recursive('hidden') },
        ],
      ),
    ).toEqual({ label: 'keep', child: { label: 'keep' } });
  });

  it('filters object fields inside arrays, preserves positions and primitive arrays, and respects additionalProperties', () => {
    const values = {
      items: [
        { label: 'first', hidden: 'remove' },
        { hidden: 'remove' },
        { label: 'last', hidden: 'remove' },
      ],
      tags: ['first', 'second'],
      hiddenItems: ['remove'],
      settings: { dynamic: 'keep', shared: 'keep' },
    };
    const actual = filterHiddenStepValues(values, [
      {
        visible: true,
        schema: {
          properties: {
            items: { items: { properties: { label: { type: 'string' } } } },
            tags: { items: { type: 'string' } },
            settings: { type: 'object', additionalProperties: true },
          },
        },
      },
      {
        visible: false,
        schema: {
          properties: {
            items: { items: { properties: { hidden: { type: 'string' } } } },
            tags: { items: { type: 'string' } },
            hiddenItems: { items: { type: 'string' } },
            settings: { properties: { shared: { type: 'string' } } },
          },
        },
      },
    ]);
    expect(actual).toEqual({
      items: [{ label: 'first' }, {}, { label: 'last' }],
      tags: ['first', 'second'],
      settings: { dynamic: 'keep', shared: 'keep' },
    });
    expect(values.items[1]).toEqual({ hidden: 'remove' });
  });

  it('does not let root-level additionalProperties in a hidden step claim undeclared values', () => {
    expect(
      filterHiddenStepValues(
        { hidden: 'remove', prefilled: 'keep', shared: 'keep' },
        [
          {
            visible: false,
            schema: {
              additionalProperties: true,
              properties: { hidden: {}, shared: {} },
            },
          },
          { visible: true, schema: { properties: { shared: {} } } },
        ],
      ),
    ).toEqual({ prefilled: 'keep', shared: 'keep' });
    expect(
      filterHiddenStepValues({ hidden: 'keep' }, [
        { visible: false, schema: { properties: { hidden: {} } } },
        { visible: true, schema: { additionalProperties: true } },
      ]),
    ).toEqual({ hidden: 'keep' });
  });

  it('includes fields from schema branches and dependencies and keeps values when references cannot be resolved', () => {
    expect(
      filterHiddenStepValues(
        {
          selected: 'remove',
          previous: 'remove',
          dependent: 'remove',
          unrelated: 'keep',
        },
        [
          {
            visible: false,
            schema: {
              oneOf: [{ properties: { selected: { type: 'string' } } }],
              then: { properties: { previous: { type: 'string' } } },
              dependencies: {
                choice: { properties: { dependent: { type: 'string' } } },
              },
            },
          },
        ],
      ),
    ).toEqual({ unrelated: 'keep' });
    for (const ref of [
      '#/definitions/Missing',
      '#/constructor',
      '#/definitions/Loop',
      '#/%',
      'https://example.com/schema',
    ]) {
      const schema = {
        definitions: { Loop: { $ref: '#/definitions/Loop' } },
        properties: { field: { type: 'string' } },
        allOf: [{ $ref: ref }],
      };
      expect(
        filterHiddenStepValues({ field: 'value' }, [
          { visible: false, schema },
        ]),
      ).toEqual({ field: 'value' });
      expect(
        filterHiddenStepValues({ field: 'value', other: 'remove' }, [
          { visible: true, schema },
          { visible: false, schema: { properties: { field: {}, other: {} } } },
        ]),
      ).toEqual({ field: 'value', other: 'remove' });
    }
  });
});

describe('resolveParameterSteps', () => {
  it('evaluates conditions in order against values from visible steps', () => {
    const steps = [
      { schema: { properties: { provider: { type: 'string' } } } },
      {
        when: "${{ parameters.provider === 'AWS' }}",
        schema: { properties: { advanced: { type: 'boolean' } } },
      },
      {
        when: '${{ parameters.advanced }}',
        schema: { properties: { tuning: { type: 'string' } } },
      },
    ];

    expect(
      resolveParameterSteps(
        { provider: 'GCP', advanced: true, tuning: 'fast' },
        steps,
      ),
    ).toEqual({ visible: [true, false, false], values: { provider: 'GCP' } });
    expect(
      resolveParameterSteps(
        { provider: 'AWS', advanced: true, tuning: 'fast' },
        steps,
      ),
    ).toEqual({
      visible: [true, true, true],
      values: { provider: 'AWS', advanced: true, tuning: 'fast' },
    });
    expect(
      resolveParameterSteps({ provider: 'AWS' }, [
        ...steps,
        { when: { not: 'a step condition' }, schema: {} },
      ]).visible,
    ).toEqual([true, true, false, true]);
  });
});
