import MenuItem from 'shared/apis/menu/MenuItem';

import { PluginBase } from 'shared/pluginApi';

import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

export default class BackstageMenuItem extends MenuItem {
  type = 'Link';

  constructor(ownerPlugin, id, title, options = {}, parent = undefined) {
    super(id, title, options, parent);

    if (!(ownerPlugin instanceof PluginBase)) {
      console.error(ownerPlugin);
      throw new Error('BackstageMenuItem: ownerPlugin must extend PluginBase');
    }

    this.ownerPlugin = ownerPlugin;

    this.type = this.options.type || this.type;
  }

  get visible() {
    if (this.ownerPlugin.manifest.featureFlag) {
      return super.visible && FeatureFlags.getItem(this.ownerPlugin.manifest.featureFlag);
    }

    return super.visible;
  }
}
