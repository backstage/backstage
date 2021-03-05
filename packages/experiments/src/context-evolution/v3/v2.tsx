import { AppContextV3, AppContextV3I, AppParamsV3 } from './v3';

type Plugin = { name: string };
type AppParamsV2 = AppParamsV3 & { plugins: Plugin[] };

export interface AppContextV2I extends AppContextV3I {
  getPlugins: () => Plugin[];
}

export class AppContextV2 extends AppContextV3 implements AppContextV2I {
  plugins: Plugin[];

  constructor(params: AppParamsV2) {
    super(params);

    this.plugins = params.plugins;
  }

  /** @deprecated */
  getPlugins() {
    return this.plugins;
  }
}
