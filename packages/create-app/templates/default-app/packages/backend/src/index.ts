/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend, discoveryFeatureLoader } from '@backstage/backend-defaults';

const backend = createBackend();

// A loader that discovers backend features from the current package.json and its dependencies.
backend.add(discoveryFeatureLoader);

backend.start();
