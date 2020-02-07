import React from 'react';
import { render } from '@testing-library/react';
import CreateEntityPage from './CreateEntityPage';

describe('CreateEntityPage', () => {
  it('should render', () => {
    const rendered = render(<CreateEntityPage />);
    expect(rendered.getByText('Hello!')).toBeInTheDocument();
  });
});
