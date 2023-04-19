import { IPluginData } from './_pluginCard';
import { truncateDescription } from '@site/src/util/truncateDescription';

const pluginsContext = require.context('../../../data/plugins', false, /\.ya?ml/);

const plugins = pluginsContext.keys().reduce((acum, id) => {
  const pluginData: IPluginData = pluginsContext(id).default;

  acum[pluginData.category === 'Core Feature' ? 'corePlugins' : 'otherPlugins'].push(
    truncateDescription(pluginData)
  );

  return acum;
}, { corePlugins: [] as IPluginData[], otherPlugins: [] as IPluginData[] });

plugins.corePlugins.sort((a, b) => a.order - b.order);
plugins.otherPlugins.sort((a, b) => a.order - b.order);

export { plugins };