import { FunctionComponent } from 'react';

type Metadata = { remoteRender: boolean };

export type AppParamsV4 = {
  icons: Record<string, FunctionComponent>;
  components: Record<
    string,
    { component: FunctionComponent; metadata: Metadata }
  >;
};

export interface AppContextV4I {
  getComponents: () => Record<
    string,
    { component: FunctionComponent; metadata: Metadata }
  >;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV4 implements AppContextV4I {
  icons: AppParamsV4['icons'];
  components: AppParamsV4['components'];

  constructor(params: AppParamsV4) {
    this.icons = params.icons;
    this.components = params.components;
  }

  getComponents() {
    return this.components;
  }

  getIcon(icon: string) {
    return this.icons[icon];
  }
}
