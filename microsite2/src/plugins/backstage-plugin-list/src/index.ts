import path from 'path';
import fs from 'fs/promises';
import { getPluginI18nPath, normalizeUrl, docuHash } from '@docusaurus/utils';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { PluginData } from './types';
import yaml from 'js-yaml';

// import type { AlumniData } from 'docusaurus-plugin-alumni';

// import getAlumni from './alumni';
// INSPIRED BY https://github.com/Computerization/computerization.github.io

export default function backstagePluginList(
  context: LoadContext,
): Plugin<PluginData> {
  const {
    siteDir,
    siteConfig: { baseUrl },
    i18n: { currentLocale },
  } = context;
  return {
    name: 'backstage-plugin-list',
    getThemePath() {
      return path.resolve(__dirname, 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },
    async loadContent() {
      const pluginsDirectory = path.join('./data/plugins');
      const plugins = [];
      const pluginFiles = await fs.readdir(pluginsDirectory);
      for (const pluginFile of pluginFiles) {
        const content = yaml.load(
          await fs.readFile(path.join(pluginsDirectory, pluginFile), 'utf8'),
        );
        plugins.push(content);
      }

      const pluginMetadata = plugins.sort((a: any, b: any) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
      return pluginMetadata;
    },
    async contentLoaded({ content, actions }) {
      const { addRoute, createData } = actions;
      const url = normalizeUrl([baseUrl, 'plugins']);
      const pluginData = await createData(
        `${docuHash('plugins')}.json`,
        JSON.stringify(content, null, 2),
      );
      addRoute({
        path: url,
        component: '@theme/PluginPage',
        exact: true,
        modules: {
          plugins: pluginData,
        },
      });
    },
    async getDefaultCodeTranslationMessages() {
      const file = path.join(
        __dirname,
        `../translations/${context.i18n.currentLocale}.json`,
      );
      return JSON.parse((await fs.readFile(file)).toString());
    },
  };
}
