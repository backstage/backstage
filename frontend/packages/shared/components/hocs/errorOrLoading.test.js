import React from 'react';
import { render } from '@testing-library/react';
import errorOrLoading from './errorOrLoading';

describe('errorOrLoading', () => {
  const Wrapped = errorOrLoading()(({ data }) => <div>data: {data.result}</div>);

  it('should be loading', () => {
    const rendered = render(<Wrapped data={{ loading: true }} />);
    rendered.getByTestId('progress');
  });

  it('should show an error', () => {
    const rendered = render(<Wrapped data={{ loading: false, error: new Error('NOPE') }} />);
    rendered.getByTestId('error');
  });

  it('should show a not found error', () => {
    const rendered = render(
      <Wrapped
        location={{ pathname: '/a' }}
        data={{
          loading: false,
          error: { graphQLErrors: [{ message: 'Error while fetching data: Not found' }] },
        }}
      />,
    );
    rendered.getByText('Not found');
  });

  it('should show data', () => {
    const rendered = render(<Wrapped data={{ loading: false, result: 'yay' }} />);
    rendered.getByText('data: yay');
  });
});
