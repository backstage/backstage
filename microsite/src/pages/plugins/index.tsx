import Link from '@docusaurus/Link';
import PluginsFilter from '@site/src/components/pluginsFilter/pluginsFilter';
import { calcIsNewPlugin } from '@site/src/util/calcIsNewPlugin';
import { truncateDescription } from '@site/src/util/truncateDescription';
import { ChipCategory } from '@site/src/util/types';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { useState } from 'react';

import { IPluginData, PluginCard } from './_pluginCard';
import pluginsStyles from './plugins.module.scss';

interface IPluginsList {
  corePlugins: IPluginData[];
  otherPlugins: IPluginData[];
}

const pluginsContext = require.context(
  '../../../data/plugins',
  false,
  /\.ya?ml/,
);

const plugins: IPluginsList = pluginsContext.keys().reduce(
  (acum, id) => {
    let pluginData: IPluginData = pluginsContext(id).default;
    const category: keyof IPluginsList =
      pluginData.category === 'Core Feature' ? 'corePlugins' : 'otherPlugins';

    pluginData = calcIsNewPlugin(pluginData);
    pluginData = truncateDescription(pluginData);

    acum[category].push(pluginData);

    return acum;
  },
  { corePlugins: [], otherPlugins: [] } as IPluginsList,
);

plugins.corePlugins.sort((a, b) => a.order - b.order);
plugins.otherPlugins.sort((a, b) => a.order - b.order);

const Plugins = () => {
  const allCategoriesSet = new Set(
    [...plugins.corePlugins, ...plugins.otherPlugins].map(
      ({ category }) => category,
    ),
  );
  const allCategoriesArray = Array.from(allCategoriesSet).map(category => ({
    name: category,
    isSelected: false,
  }));
  const [categories, setCategories] =
    useState<ChipCategory[]>(allCategoriesArray);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCoreFeatures, setShowCoreFeatures] = useState(true);
  const [showOtherPlugins, setShowOtherPlugins] = useState(true);

  const handleChipClick = (categoryName: string) => {
    const isSelected =
      categories.find(category => category.name === categoryName)?.isSelected ||
      false;

    const newSelectedCategories = isSelected
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(newSelectedCategories);

    const newCategories = categories.map(category => {
      if (category.name === categoryName) {
        return { ...category, isSelected: !isSelected };
      }
      return category;
    });

    setCategories(newCategories);

    if (!newSelectedCategories.includes('Core Feature')) {
      setShowCoreFeatures(false);
    } else {
      setShowCoreFeatures(true);
    }

    if (
      newSelectedCategories.length === 1 &&
      newSelectedCategories[0] === 'Core Feature'
    ) {
      setShowOtherPlugins(false);
    } else {
      setShowOtherPlugins(true);
    }

    if (newSelectedCategories.length === 0) {
      setShowOtherPlugins(true);
      setShowCoreFeatures(true);
    }
  };

  return (
    <Layout>
      <div
        className={clsx('container', 'padding--lg', pluginsStyles.pluginsPage)}
      >
        <div className="directoryBanner">
          <div className="directoryContent">
            <h2>Plugin directory</h2>

            <p>
              Open source plugins that you can add to your Backstage deployment.
              Learn how to build a <Link to="/docs/plugins">plugin</Link>.
            </p>
          </div>

          <Link
            to="/docs/plugins/add-to-directory"
            className="button button--outline button--primary"
          >
            Add to Directory
          </Link>
        </div>

        <div className="bulletLine margin-bottom--lg"></div>
        <div className="pluginsFilterBox">
          <PluginsFilter
            categories={categories}
            handleChipClick={handleChipClick}
          />
        </div>

        {showCoreFeatures && (
          <div>
            <h2>Core Features</h2>
            <div className="pluginsContainer margin-bottom--lg">
              {plugins.corePlugins
                .filter(
                  pluginData =>
                    !selectedCategories.length ||
                    selectedCategories.includes(pluginData.category),
                )
                .map(pluginData => (
                  <PluginCard
                    key={pluginData.title}
                    {...pluginData}
                  ></PluginCard>
                ))}
            </div>
          </div>
        )}

        {showOtherPlugins && (
          <div>
            <h2>All Plugins</h2>
            <p>
              Friendly reminder: While we love the variety and contributions of
              our open source plugins, they haven't been fully vetted by the
              core Backstage team. We encourage you to exercise caution and do
              your due diligence before installing. Happy exploring!
            </p>
            <div className="pluginsContainer margin-bottom--lg">
              {plugins.otherPlugins
                .filter(
                  pluginData =>
                    !selectedCategories.length ||
                    selectedCategories.includes(pluginData.category),
                )
                .map(pluginData => (
                  <PluginCard
                    key={pluginData.title}
                    {...pluginData}
                  ></PluginCard>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Plugins;
