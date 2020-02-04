import React, { FC, createContext, useContext } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { useAsync } from 'react-use';
import Progress from 'shared/components/Progress';
import ErrorComponent from 'shared/components/Error';
import { UserApi, User } from './types';

const Context = createContext<User | undefined>(undefined);

type Props = {
  userApi: UserApi;
};

const UserInfoBarrier: FC<Props> = ({ children, userApi }) => {
  const user = useAsync(() => userApi.getUser());

  if (user.loading) {
    return <Progress />;
  }
  if (user.error) {
    return <ErrorComponent error={user.error} />;
  }

  return <Context.Provider value={user.value} children={children} />;
};

export const UserInfoProvider: FC<{ user: User }> = ({ children, user }) => (
  <Context.Provider value={user} children={children} />
);

export function useUser(): User {
  const user = useContext(Context);
  if (!user) {
    throw new Error(
      'No user info context available, make sure to use this hook inside UserInfoBarrier or UserInfoProvider',
    );
  }
  return user;
}

type UserProps = {
  user: User;
};

export function withUser<P extends UserProps>(WrappedComponent: React.ComponentType<P>) {
  const Hoc: FC<Omit<P, keyof UserProps>> = props => {
    const user = useUser();
    return <WrappedComponent {...(props as P)} user={user} />;
  };
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  Hoc.displayName = `withUser(${displayName})`;

  hoistStatics(Hoc, WrappedComponent);

  return Hoc;
}

export default UserInfoBarrier;
