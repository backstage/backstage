import { render, cleanup } from '@testing-library/react';
import { metadataValueToElement } from './metadataUtils';

describe('metadataValueToElement', () => {
  it('handles any kind of input without exploding', () => {
    const inputs = [
      'asd',
      /asd/,
      { asd: 'asd' },
      { asd: { asd: { asd: { asd: 'asd' } } } },
      { asd: ['asd'] },
      [],
      ['asd'],
      NaN,
      ['asd', 0, NaN],
      ['asd', 0, NaN, null],
      { [Symbol('asd')]: 'asd' },
      null,
      true,
      false,
      undefined,
      () => {},
      { asd() {} },
      new Uint32Array([1, 2, 3]),
      (function*() {})(),
      new Set(),
      new Map(),
    ];

    inputs.forEach(input => {
      render(metadataValueToElement(input, 'NONE'));
      cleanup();
    });
  });

  it('renders nil representation', () => {
    render(metadataValueToElement(false, 'NONE')).getByText('NONE');
    cleanup();
    render(metadataValueToElement(null, 'NONE')).getByText('NONE');
    cleanup();
    render(metadataValueToElement(NaN, 'NONE')).getByText('NONE');
    cleanup();
    render(metadataValueToElement([], 'NONE')).getByText('NONE');
    cleanup();
  });

  it('renders an object', () => {
    const rendered = render(metadataValueToElement({ a: false, b: '1', c: ['2', '3'] }, 'NONE'));
    rendered.getByText('a:');
    rendered.getByText('b:');
    rendered.getByText('c:');
    rendered.getByText('1');
    rendered.getByText('2');
    rendered.getByText('3');
    rendered.getByText('NONE');
  });

  it('renders unknown values', () => {
    render(metadataValueToElement(Infinity)).getByText('(unknown value type)');
    cleanup();
    render(metadataValueToElement(Symbol.iterator)).getByText('(unknown value type)');
    cleanup();
  });
});
