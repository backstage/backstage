import React, { useMemo, useState } from 'react';

// Import all YAML files from the data directory
const pluginsContext = require.context(
  '../../../rspress-poc/data/plugins',
  false,
  /\.ya?ml$/
);

interface IPluginData {
  author: string;
  authorUrl: string;
  category: string;
  description: string;
  documentation: string;
  iconUrl?: string;
  title: string;
  addedDate: string;
  isNew?: boolean;
  order?: number;
}

interface IPluginsList {
  corePlugins: IPluginData[];
  otherPlugins: IPluginData[];
}

// Calculate if a plugin is new (added within last 60 days)
const calcIsNewPlugin = (plugin: IPluginData): IPluginData => {
  const addedDate = new Date(plugin.addedDate);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  return { ...plugin, isNew: addedDate > sixtyDaysAgo };
};

// Truncate description to reasonable length
const truncateDescription = (plugin: IPluginData): IPluginData => {
  const maxLength = 150;
  if (plugin.description && plugin.description.length > maxLength) {
    return {
      ...plugin,
      description: plugin.description.substring(0, maxLength) + '...',
    };
  }
  return plugin;
};

// Load all plugins
const plugins: IPluginsList = pluginsContext.keys().reduce(
  (acum: IPluginsList, id: string) => {
    let pluginData: IPluginData = pluginsContext(id).default || pluginsContext(id);
    const category: keyof IPluginsList =
      pluginData.category === 'Core Feature' ? 'corePlugins' : 'otherPlugins';

    pluginData = calcIsNewPlugin(pluginData);
    pluginData = truncateDescription(pluginData);
    pluginData.order = pluginData.order ?? 999;

    acum[category].push(pluginData);

    return acum;
  },
  { corePlugins: [], otherPlugins: [] } as IPluginsList
);

plugins.corePlugins.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
plugins.otherPlugins.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

const defaultIconUrl = '/img/logo-gradient-on-dark.svg';

// Plugin Card Component
const PluginCard = ({
  author,
  authorUrl,
  category,
  description,
  documentation,
  iconUrl,
  isNew = false,
  title,
}: IPluginData) => (
  <div className="plugin-card">
    <div className="plugin-card-header">
      {isNew && <div className="new-ribbon">NEW</div>}
      <img src={iconUrl || defaultIconUrl} alt={title} className="plugin-icon" />
      <div className="plugin-info">
        <h3 className={isNew ? 'new-ribbon-padding' : ''}>{title}</h3>
        <p className="plugin-author">
          by <a href={authorUrl}>{author}</a>
        </p>
        <span className="plugin-category">{category}</span>
      </div>
    </div>
    <div className="plugin-card-body">
      <p>{description}</p>
    </div>
    <div className="plugin-card-footer">
      <a href={documentation} className="plugin-button">
        Explore
      </a>
    </div>
  </div>
);

// Category filter chips
interface ChipCategory {
  name: string;
  isSelected: boolean;
}

const PluginsPage = () => {
  const allCategoriesSet = new Set(
    [...plugins.corePlugins, ...plugins.otherPlugins].map(
      ({ category }) => category
    )
  );
  const allCategoriesArray = Array.from(allCategoriesSet).map((category) => ({
    name: category,
    isSelected: false,
  }));

  const [categories, setCategories] = useState<ChipCategory[]>(allCategoriesArray);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCoreFeatures, setShowCoreFeatures] = useState(true);
  const [showOtherPlugins, setShowOtherPlugins] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChipClick = (categoryName: string) => {
    const isSelected =
      categories.find((category) => category.name === categoryName)?.isSelected ||
      false;

    const newSelectedCategories = isSelected
      ? selectedCategories.filter((c) => c !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(newSelectedCategories);

    const newCategories = categories.map((category) => {
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

  const matchesSearch = (pluginData: IPluginData, term: string) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      pluginData.title.toLowerCase().includes(lowerTerm) ||
      pluginData.description.toLowerCase().includes(lowerTerm) ||
      pluginData.category.toLowerCase().includes(lowerTerm) ||
      (pluginData.author && pluginData.author.toLowerCase().includes(lowerTerm))
    );
  };

  const matchesCategory = (pluginData: IPluginData, cats: string[]) => {
    if (cats.length === 0) return true;
    return cats.includes(pluginData.category);
  };

  const corePlugins = useMemo(() => {
    return plugins.corePlugins
      .filter((pluginData) => matchesCategory(pluginData, selectedCategories))
      .filter((pluginData) => matchesSearch(pluginData, searchTerm));
  }, [selectedCategories, searchTerm]);

  const otherPlugins = useMemo(() => {
    return plugins.otherPlugins
      .filter((pluginData) => matchesCategory(pluginData, selectedCategories))
      .filter((pluginData) => matchesSearch(pluginData, searchTerm));
  }, [selectedCategories, searchTerm]);

  return (
    <div className="plugins-page">
      <div className="plugins-container">
        <div className="directory-banner">
          <div className="directory-content">
            <h2>Plugin directory</h2>
            <p>
              Open source plugins that you can add to your Backstage deployment.
              Learn how to build a <a href="/plugins/create-a-plugin">plugin</a>.
            </p>
          </div>
          <a
            href="/plugins/add-to-directory"
            className="add-to-directory-button"
          >
            Add to Directory
          </a>
        </div>

        <div className="bullet-line"></div>

        <div className="plugins-filter-box">
          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`filter-chip ${category.isSelected ? 'selected' : ''}`}
                onClick={() => handleChipClick(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search plugins..."
            className="plugins-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {corePlugins.length === 0 && otherPlugins.length === 0 && (
          <div className="no-plugins-found">
            <h3>No plugins found</h3>
            <p>
              We couldn't find any plugins matching your criteria. Please try
              adjusting your search or filter settings.
            </p>
          </div>
        )}

        {showCoreFeatures && corePlugins.length > 0 && (
          <div className="plugins-section">
            <h2>Core Features ({corePlugins.length})</h2>
            <div className="plugins-grid">
              {corePlugins.map((pluginData) => (
                <PluginCard key={pluginData.title} {...pluginData} />
              ))}
            </div>
          </div>
        )}

        {showOtherPlugins && otherPlugins.length > 0 && (
          <div className="plugins-section">
            <h2>All Plugins ({otherPlugins.length})</h2>
            <p className="plugins-disclaimer">
              Friendly reminder: While we love the variety and contributions of
              our open source plugins, they haven't been fully vetted by the
              core Backstage team. We encourage you to exercise caution and do
              your due diligence before installing. Happy exploring!
            </p>
            <div className="plugins-grid">
              {otherPlugins.map((pluginData) => (
                <PluginCard key={pluginData.title} {...pluginData} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginsPage;
