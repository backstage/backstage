import { FunctionComponent } from 'react';
import { AppContextV4I, AppContextV4, AppParamsV4 } from './v4';

export type AppParamsV3 = {
  icons: Record<string, FunctionComponent>;
  components: Record<string, FunctionComponent>;
};

export interface AppContextV3I extends Omit<AppContextV4I, 'getComponents'> {
  getComponents: () => Record<string, FunctionComponent>;
}

export class AppContextV3 extends AppContextV4 implements AppContextV3I {
  getComponents() {
    const v3Components: Record<string, FunctionComponent> = {};

    for (const [name, { component }] of Object.entries(this.components)) {
      v3Components[name] = component;
    }

    return v3Components;
  }
}
