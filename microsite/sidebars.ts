import { link } from 'fs';
import { releases } from './releases';
import overview from './sidebars/overview';
import gettingStarted from './sidebars/gettingStarted';
import coreFeatures from './sidebars/coreFeatures';
import integrations from './sidebars/integrations';
import plugins from './sidebars/plugins';
import configurations from './sidebars/configurations';
import framework from './sidebars/framework';
import tutorials from './sidebars/tutorials';
import faq from './sidebars/faq';
import references from './sidebars/references';
import contribute from './sidebars/contribute';

export default {
  docs: [
    overview,
    gettingStarted,
    coreFeatures,
    integrations,
    plugins,
    configurations,
    framework,
    tutorials,
    faq,
    contribute,
    references,
  ],

  releases: {
    'Release Notes': releases.map(release => `releases/${release}`),
  },
};
