import { FunctionComponent } from 'react';

type Plugin = { name: string };

type AppParams = {
  plugins: Plugin[];
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

export interface AppContextV2I {
  getPlugins: () => Plugin[];
  getComponents: () => Record<string, FunctionComponent>;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV2 implements AppContextV2I {
  plugins: AppParams['plugins'];
  icons: AppParams['icons'];
  components: AppParams['components'];

  constructor(params: AppParams) {
    this.plugins = params.plugins;
    this.icons = params.icons;
    this.components = params.components;
  }

  /** @deprecated */
  getPlugins() {
    return this.plugins;
  }

  getComponents() {
    return this.components;
  }

  getIcon(icon: string) {
    return this.icons[icon];
  }
}
