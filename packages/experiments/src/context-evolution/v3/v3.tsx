import { FunctionComponent } from 'react';

export type AppParamsV3 = {
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

export interface AppContextV3I {
  getComponents: () => Record<string, FunctionComponent>;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV3 implements AppContextV3I {
  icons: AppParamsV3['icons'];
  components: AppParamsV3['components'];

  constructor(params: AppParamsV3) {
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
