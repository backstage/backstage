import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { GitHubIssueListItem } from './GitHubIssueListItem';

const sampleData = {
  location: 'https://google.com',
  text: 'the text body',
  title: 'the title',
  user: 'sohailhaider',
  image: '',
};
describe('Testing Our GitHubIssueListItem', () => {
  it('Testing if our component renders properly', async () => {
    render(<GitHubIssueListItem result={sampleData} />);

    await waitFor(() => {
      expect(screen.getByText(sampleData.title)).toBeInTheDocument();
      expect(screen.getByText(sampleData.text)).toBeInTheDocument();
    });
  });
});
