import { FunctionComponent } from 'react';

type Plugin = { name: string };

type AppParams = {
  plugins: Plugin[];
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

interface AppContextV1I {
  getPlugins: () => Plugin[];
  getComponents: () => Record<string, FunctionComponent>;
  getIcon: (icon: string) => FunctionComponent;
}

export class AppContextV1 implements AppContextV1I {
  plugins: AppParams['plugins'];
  icons: AppParams['icons'];
  components: AppParams['components'];

  constructor(params: AppParams) {
    this.plugins = params.plugins;
    this.icons = params.icons;
    this.components = params.components;
  }

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
