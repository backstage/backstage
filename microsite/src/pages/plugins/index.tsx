import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { useState } from 'react';
import { PluginCard } from './_pluginCard';
import pluginsStyles from './plugins.module.scss';
import { plugins } from './plugins';
import PluginsChipsFilter from '@site/src/components/pluginsChipsFilter/pluginsChipsFilter';
import { ChipCategory } from '@site/src/util/types';

const Plugins = () => {
  const allCategories: ChipCategory[] = [];
  plugins.corePlugins.concat(plugins.otherPlugins).forEach(pluginData => {
    const index = allCategories.findIndex(
      chip => chip.name === pluginData.category,
    );
    if (index === -1) {
      allCategories.push({
        name: pluginData.category,
        isSelected: false,
      });
    }
  });

  const [categories, setCategories] = useState(allCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCoreFeaturesHeader, setShowCoreFeaturesHeader] = useState(true);
  const [showOtherPluginsHeader, setShowOtherPluginsHeader] = useState(true);

  const handleChipClick = categoryName => {
    const category = categories.find(
      category => category.name === categoryName,
    );
    const isSelected = category?.isSelected || false;

    let newSelectedCategories = selectedCategories;

    if (isSelected) {
      newSelectedCategories = selectedCategories.filter(
        c => c !== categoryName,
      );
    } else {
      newSelectedCategories.push(categoryName);
    }

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

        <PluginsChipsFilter
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
