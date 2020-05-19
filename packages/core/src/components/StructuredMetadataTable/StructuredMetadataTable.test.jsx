/*
 * Copyright 2020 Spotify AB
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
import { render } from '@testing-library/react';

import StructuredMetadataTable from './StructuredMetadataTable';
import { startCase } from 'lodash';

describe('<StructuredMetadataTable />', () => {
  it('renders without exploding', () => {
    const metadata = { hello: 'world' };
    const { getByText } = render(
      <StructuredMetadataTable metadata={metadata} />,
    );
    expect(getByText(metadata.hello)).toBeInTheDocument();
  });

  describe('Item Mappings', () => {
    it('Iterates over and displays every field in the map', () => {
      const metadata = { field1: 'one', field2: 'two', field3: 'three' };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      const keys = Object.keys(metadata);
      keys.forEach((value) => {
        expect(getByText(startCase(value))).toBeInTheDocument();
        expect(getByText(metadata[value])).toBeInTheDocument();
      });
    });

    it('Supports primative value fields', () => {
      const metadata = { strField: 'my field', intField: 1 };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      const keys = Object.keys(metadata);
      keys.forEach((value) => {
        expect(getByText(startCase(value))).toBeInTheDocument();
        expect(getByText(metadata[value].toString())).toBeInTheDocument();
      });
    });

    it('Supports array fields', () => {
      const metadata = { arrayField: ['arrVal1', 'arrVal2'] };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      const keys = Object.keys(metadata);
      keys.forEach((value) => {
        expect(getByText(startCase(value))).toBeInTheDocument();
      });
      metadata.arrayField.forEach((value) => {
        expect(getByText(value)).toBeInTheDocument();
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
      const metadata = { config: { a: 1, b: 2 } };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      const keys = Object.keys(metadata.config);
      keys.forEach((value) => {
        expect(
          getByText(startCase(value), { exact: false }),
        ).toBeInTheDocument();
        expect(
          getByText(metadata.config[value].toString(), { exact: false }),
        ).toBeInTheDocument();
      });
    });
  });
});
