import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { TodoList } from './TodoList';

describe('TodoList', () => {
  it('renders a list of todos', async () => {
    const todos = [
      { id: '1', title: 'First task', createdBy: 'user:default/guest', createdAt: '2025-01-01T00:00:00.000Z' },
      { id: '2', title: 'Second task', createdBy: 'user:default/admin', createdAt: '2025-01-02T00:00:00.000Z' },
    ];

    await renderInTestApp(<TodoList todos={todos} />);

    expect(await screen.findByText('First task')).toBeInTheDocument();
    expect(await screen.findByText('Second task')).toBeInTheDocument();
    expect(await screen.findByText('user:default/guest')).toBeInTheDocument();
  });
});
