import React from 'react';
import { render } from '@testing-library/react';

import StructuredMetadataTable from './StructuredMetadataTable';
import { startCase } from 'lodash';

describe('<StructuredMetadataTable />', () => {
  it('renders without exploding', () => {
    const metadata = { hello: 'world' };
    const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);
    expect(getByText(metadata.hello)).toBeInTheDocument();
  });

  describe('Item Mappings', () => {
    it('Iterates over and displays every field in the map', () => {
      const metadata = { field1: 'one', field2: 'two', field3: 'three' };
      const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);
      const keys = Object.keys(metadata);
      keys.forEach(value => {
        expect(getByText(startCase(value))).toBeInTheDocument();
        expect(getByText(metadata[value])).toBeInTheDocument();
      });
    });

    it('Supports primative value fields', () => {
      const metadata = { strField: 'my field', intField: 1 };
      const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);

      const keys = Object.keys(metadata);
      keys.forEach(value => {
        expect(getByText(startCase(value))).toBeInTheDocument();
        expect(getByText(metadata[value].toString())).toBeInTheDocument();
      });
    });

    it('Supports array fields', () => {
      const metadata = { arrayField: ['arrVal1', 'arrVal2'] };
      const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);
      const keys = Object.keys(metadata);
      keys.forEach(value => {
        expect(getByText(startCase(value))).toBeInTheDocument();
      });
      metadata.arrayField.forEach(value => {
        expect(getByText(value)).toBeInTheDocument();
      });
    });

    it('Supports react elements', () => {
      const metadata = { react: <div id="findMe"> field </div> };
      const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);

      expect(getByText('field')).toBeInTheDocument();
    });

    it('Supports object elements', () => {
      const metadata = { config: { a: 1, b: 2 } };
      const { getByText } = render(<StructuredMetadataTable metadata={metadata} />);

      const keys = Object.keys(metadata.config);
      keys.forEach(value => {
        expect(getByText(startCase(value), { exact: false })).toBeInTheDocument();
        expect(getByText(metadata.config[value].toString(), { exact: false })).toBeInTheDocument();
      });
    });
  });
});
