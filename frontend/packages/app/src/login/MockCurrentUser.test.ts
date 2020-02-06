import { MockCurrentUser } from './MockCurrentUser';
import { wait } from '@testing-library/react';

describe('MockCurrentUser', () => {
  it('notifies immediately on subscribe', async () => {
    const next = jest.fn();
    const current = new MockCurrentUser();
    current.state.subscribe(next);
    await wait();
    expect(next).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'LOGGED_OUT' }),
    );
  });

  it('logs in and out', async () => {
    const next = jest.fn();
    const current = new MockCurrentUser();
    current.state.subscribe(next);
    await wait();
    expect(next).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'LOGGED_OUT' }),
    );
    current.login('apa');
    await wait();
    expect(next).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'LOGGED_IN', user: 'apa' }),
    );
    current.logout();
    await wait();
    expect(next).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ type: 'LOGGED_OUT' }),
    );
  });
});
