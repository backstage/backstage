import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { useState } from 'react';
import { IPluginData, PluginCard } from './_pluginCard';
import pluginsStyles from './plugins.module.scss';
import { ChipCategory } from '@site/src/util/types';
import { truncateDescription } from '@site/src/util/truncateDescription';
import PluginsFilter from '@site/src/components/pluginsFilter/pluginsFilter';

const pluginsContext = require.context(
  '../../../data/plugins',
  false,
  /\.ya?ml/,
);

const plugins = pluginsContext.keys().reduce(
  (acum, id) => {
    const pluginData: IPluginData = pluginsContext(id).default;

    acum[
      pluginData.category === 'Core Feature' ? 'corePlugins' : 'otherPlugins'
    ].push(truncateDescription(pluginData));

    return acum;
  },
  { corePlugins: [] as IPluginData[], otherPlugins: [] as IPluginData[] },
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
  const [showCoreFeaturesHeader, setShowCoreFeaturesHeader] = useState(true);
  const [showOtherPluginsHeader, setShowOtherPluginsHeader] = useState(true);

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
      setShowCoreFeaturesHeader(false);
    } else {
      setShowCoreFeaturesHeader(true);
    }

    if (
      newSelectedCategories.length === 1 &&
      newSelectedCategories[0] === 'Core Feature'
    ) {
      setShowOtherPluginsHeader(false);
    } else {
      setShowOtherPluginsHeader(true);
    }

    if (newSelectedCategories.length === 0) {
      setShowOtherPluginsHeader(true);
      setShowCoreFeaturesHeader(true);
    }
  };

  return (
    <Layout>
      <div
        className={clsx('container', 'padding--lg', pluginsStyles.pluginsPage)}
      >
        <div className="marketplaceBanner">
          <div className="marketplaceContent">
            <h2>Plugin Marketplace</h2>

            <p>
              Open source plugins that you can add to your Backstage deployment.
              Learn how to build a <Link to="/docs/plugins">plugin</Link>.
            </p>
          </div>

          <Link
            to="/docs/plugins/add-to-marketplace"
            className="button button--outline button--primary"
          >
            Add to Marketplace
          </Link>
        </div>

        <div className="bulletLine margin-bottom--lg"></div>

        <PluginsFilter
          categories={categories}
          handleChipClick={handleChipClick}
        />

        {showCoreFeaturesHeader && <h2>Core Features</h2>}

        <div className="pluginsContainer margin-bottom--lg">
          {plugins.corePlugins
            .filter(
              pluginData =>
                !selectedCategories.length ||
                selectedCategories.includes(pluginData.category),
            )
            .map(pluginData => (
              <PluginCard key={pluginData.title} {...pluginData}></PluginCard>
            ))}
        </div>

        {showOtherPluginsHeader && <h2>All Plugins</h2>}

        <div className="pluginsContainer margin-bottom--lg">
          {plugins.otherPlugins
            .filter(
              pluginData =>
                !selectedCategories.length ||
                selectedCategories.includes(pluginData.category),
            )
            .map(pluginData => (
              <PluginCard key={pluginData.title} {...pluginData}></PluginCard>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Plugins;
