/*
 * Copyright 2020 The Backstage Authors
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

import { render, within } from '@testing-library/react';
import { startCase } from 'lodash';
import React from 'react';
import { StructuredMetadataTable } from './StructuredMetadataTable';

describe('<StructuredMetadataTable />', () => {
  it('renders without exploding', () => {
    const metadata = { hello: 'world', foo: null };
    const { getByText } = render(
      <StructuredMetadataTable metadata={metadata} />,
    );
    expect(getByText(metadata.hello)).toBeInTheDocument();
  });

  describe('Item Mappings', () => {
    it('Iterates over and displays every field in the map', () => {
      const metadata = {
        field1: 'one',
        field2: 'two',
        field3: 'three',
      } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      for (const [key, value] of Object.entries(metadata)) {
        expect(getByText(startCase(key))).toBeInTheDocument();
        expect(getByText(value)).toBeInTheDocument();
      }
    });

    it('Supports primitive value fields', () => {
      const metadata = { strField: 'my field', intField: 1 } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      for (const [key, value] of Object.entries(metadata)) {
        expect(getByText(startCase(key))).toBeInTheDocument();
        expect(getByText(value.toString())).toBeInTheDocument();
      }
    });

    it('Supports array fields', () => {
      const metadata = { arrayField: ['arrVal1', 'arrVal2'] } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      const keys = Object.keys(metadata);
      keys.forEach(value => {
        expect(getByText(startCase(value))).toBeInTheDocument();
      });
      metadata.arrayField.forEach(value => {
        expect(getByText(new RegExp(value))).toBeInTheDocument();
      });
    });

    it('Supports boolean values', () => {
      const metadata = { foo: true, bar: false };
      const expectedValues = [
        ['Foo', '✅'],
        ['Bar', '❌'],
      ];

      const { getAllByRole } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      getAllByRole('row').forEach((row, index) => {
        const [firstCell, secondCell] = within(row).getAllByRole('cell');
        const [expectedKey, expectedValue] = expectedValues[index];

        expect(firstCell).toHaveTextContent(expectedKey);
        expect(secondCell).toHaveTextContent(expectedValue);
      });
    });

    it('Supports react elements', () => {
      const metadata = { react: <div id="findMe"> field </div> };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      expect(getByText('field')).toBeInTheDocument();
    });

    it('Supports object elements', () => {
      const metadata = {
        config: { a: 1, b: 2 },
      } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      for (const [key, value] of Object.entries(metadata.config)) {
        expect(getByText(startCase(key), { exact: false })).toBeInTheDocument();
        expect(
          getByText(value.toString(), { exact: false }),
        ).toBeInTheDocument();
      }
    });
  });

  describe('Title formatting', () => {
    const metadata = {
      testA: 'stuff',
      testB: { testC: 'stuff' },
      testD: [{ testE: 'stuff' }],
    };

    it('should make keys human readable', async () => {
      const rendered = render(
        <StructuredMetadataTable
          metadata={metadata}
          options={{ nestedValuesAsYaml: true }}
        />,
      );
      expect(rendered.queryByText(/^Test A/)).toBeInTheDocument();
      expect(rendered.queryByText(/^Test B/)).toBeInTheDocument();
      expect(rendered.queryByText(/^Test D/)).toBeInTheDocument();

      // nested content is displayed as yaml, so not affected by formatting
      expect(rendered.queryByText(/^testC/)).toBeInTheDocument();
      expect(rendered.queryByText(/testE: stuff/)).toBeInTheDocument();
    });

    it('should be possible to disable it', async () => {
      const rendered = render(
        <StructuredMetadataTable
          metadata={metadata}
          options={{ titleFormat: key => key }}
        />,
      );
      expect(rendered.queryByText(/^testA/)).toBeInTheDocument();
      expect(rendered.queryByText(/^testB/)).toBeInTheDocument();
      expect(rendered.queryByText(/^testC/)).toBeInTheDocument();
      expect(rendered.queryByText(/^testD/)).toBeInTheDocument();
      expect(rendered.queryByText(/^testE/)).toBeInTheDocument();
    });

    it('should be customizable', async () => {
      const spongeBobCase = (key: string) =>
        key
          .split('')
          .map((letter, index) => {
            if (index % 2 === 0) {
              return letter.toLocaleLowerCase('en-US');
            }
            return letter.toLocaleUpperCase('en-US');
          })
          .join('');

      const rendered = render(
        <StructuredMetadataTable
          metadata={metadata}
          options={{ titleFormat: spongeBobCase, nestedValuesAsYaml: true }}
        />,
      );
      expect(rendered.queryByText(/^tEsTa/)).toBeInTheDocument();
      expect(rendered.queryByText(/^tEsTb/)).toBeInTheDocument();
      expect(rendered.queryByText(/^tEsTd/)).toBeInTheDocument();

      // nested content is displayed as yaml, so not affected by formatting
      expect(rendered.queryByText(/^testC/)).toBeInTheDocument();
      expect(rendered.queryByText(/^testE/)).toBeInTheDocument();
    });
  });
});
