import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { withLogCollector } from 'testUtils';
import { User } from './types';
import MockUserApi from './MockUserApi';
import UserInfoBarrier, { UserInfoProvider, useUser, withUser } from './UserInfoBarrier';

describe('useUser', () => {
  it('should fail if no context is available', () => {
    const MyComponent = () => {
      const user = useUser();
      return <span>I am {user.id}</span>;
    };

    const logs = withLogCollector(['error'], () => {
      expect(() => render(<MyComponent />)).toThrowError(/No user info context available/);
    });
    expect(logs.error.length).toBe(2);
    expect(logs.error[0]).toMatch(/^Error: Uncaught \[Error: No user info context available/);
    expect(logs.error[1]).toMatch(/^The above error occurred in the <MyComponent> component/);
  });
});

describe('withUser', () => {
  it('should fail if no context is available', () => {
    const MyComponent: FC<{ user: User }> = ({ user }) => {
      return <span>I am {user.id}</span>;
    };
    const MyHOC = withUser(MyComponent);

    const logs = withLogCollector(['error'], () => {
      expect(() => render(<MyHOC />)).toThrowError(/No user info context available/);
    });
    expect(logs.error.length).toBe(2);
    expect(logs.error[0]).toMatch(/^Error: Uncaught \[Error: No user info context available/);
    expect(logs.error[1]).toMatch(/^The above error occurred in the <withUser\(MyComponent\)> component/);
  });
});

describe('<UserInfoBarrier />', () => {
  it('should make user available', async () => {
    const MyComponent = () => {
      const user = useUser();
      return <span>I am {user.id}</span>;
    };

    const rendered = render(
      <UserInfoBarrier userApi={new MockUserApi()}>
        <MyComponent />
      </UserInfoBarrier>,
    );

    const text = 'I am mockuser';
    expect(rendered.queryByText(text)).toBeNull();
    await rendered.findByText(text);
  });

  it('should show errors to fetch user', async () => {
    const MyComponent = () => {
      const user = useUser();
      return <span>I am {user.id}</span>;
    };

    const rendered = render(
      <UserInfoBarrier
        userApi={{
          getUser: async () => {
            throw new Error('NOPE');
          },
          getProfile: async () => ({ givenName: 'unused', fullName: 'unused' }),
        }}
      >
        <MyComponent />
      </UserInfoBarrier>,
    );

    await rendered.findByText('An error occurred, please copy to the clipboard and report to tools.');
  });
});

describe('<UserInfoProvider />', () => {
  it('should make user available', async () => {
    const userInfo = {
      id: 'derpy',
    } as User;

    const MyComponent = () => {
      const user = useUser();
      return <span>I am {user.id}</span>;
    };

    const rendered = render(
      <UserInfoProvider user={userInfo}>
        <MyComponent />
      </UserInfoProvider>,
    );

    rendered.getByText('I am derpy');
  });

  it('should make user available to HOC', async () => {
    const userInfo = {
      id: 'derpy',
    } as User;

    const MyComponent = withUser(({ user }) => {
      return <span>I am {user.id}</span>;
    });

    const rendered = render(
      <UserInfoProvider user={userInfo}>
        <MyComponent />
      </UserInfoProvider>,
    );

    rendered.getByText('I am derpy');
  });
});
