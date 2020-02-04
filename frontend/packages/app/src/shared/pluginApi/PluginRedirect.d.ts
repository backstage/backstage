import PluginBase from './PluginBase';

export = PluginRedirect;
declare class PluginRedirect {
  constructor(owner: PluginBase, from: string, to: string, exact: boolean);
}
