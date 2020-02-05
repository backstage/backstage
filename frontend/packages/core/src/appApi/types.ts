import { ComponentType } from 'react';

export type EntityConfig = {
  kind: string;
  title: string;
  icon: React.ComponentType<{ fontSize: number }>;
  color: {
    primary: string;
    secondary: string;
  };
  pages: {
    list?: ComponentType<{}> | AppComponentBuilder;
    view?: ComponentType<{}> | AppComponentBuilder;
  };
};

export type App = {
  getEntityConfig(kind: string): EntityConfig;
};

export class AppComponentBuilder<T = any> {
  build(_app: App): ComponentType<T> {
    throw new Error('Must override build() in AppComponentBuilder');
  }
}

export type User = {
  id: string;
  email: string;
};

export type UserApi = {
  isLoggedIn(): Promise<boolean>;

  getUser(): Promise<User>;
};
