/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { mockServices } from '@backstage/backend-test-utils';
import { createAllowBootFailurePredicate } from './createAllowBootFailurePredicate';

describe('createAllowBootFailurePredicate', () => {
  describe('when no config is provided', () => {
    it('should default to abort for plugins', () => {
      const predicate = createAllowBootFailurePredicate();
      expect(predicate('test-plugin')).toBe(false);
    });

    it('should default to abort for modules', () => {
      const predicate = createAllowBootFailurePredicate();
      expect(predicate('test-plugin', 'test-module')).toBe(false);
    });
  });

  describe('default plugin boot failure configuration', () => {
    it('should use abort as default when not configured', () => {
      const config = mockServices.rootConfig();
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(false);
    });

    it('should use continue when default is set to continue', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'continue',
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
    });

    it('should use abort when default is set to abort', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'abort',
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(false);
    });
  });

  describe('default module boot failure configuration', () => {
    it('should use abort as default when not configured', () => {
      const config = mockServices.rootConfig();
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(false);
    });

    it('should use continue when default is set to continue', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'continue',
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(true);
    });

    it('should use abort when default is set to abort', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'abort',
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(false);
    });
  });

  describe('plugin-specific overrides', () => {
    it('should override default with plugin-specific continue', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'abort',
              },
              plugins: {
                'test-plugin': {
                  onPluginBootFailure: 'continue',
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
    });

    it('should override default with plugin-specific abort', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'continue',
              },
              plugins: {
                'test-plugin': {
                  onPluginBootFailure: 'abort',
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(false);
    });

    it('should use default when plugin-specific config is not set', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'continue',
              },
              plugins: {
                'other-plugin': {
                  onPluginBootFailure: 'abort',
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
    });

    it('should handle multiple plugins independently', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'abort',
              },
              plugins: {
                'plugin-a': {
                  onPluginBootFailure: 'continue',
                },
                'plugin-b': {
                  onPluginBootFailure: 'abort',
                },
                'plugin-c': {
                  // No override, uses default
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('plugin-a')).toBe(true);
      expect(predicate('plugin-b')).toBe(false);
      expect(predicate('plugin-c')).toBe(false);
    });
  });

  describe('module-specific overrides', () => {
    it('should override default with module-specific continue', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'abort',
              },
              plugins: {
                'test-plugin': {
                  modules: {
                    'test-module': {
                      onPluginModuleBootFailure: 'continue',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(true);
    });

    it('should override default with module-specific abort', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'continue',
              },
              plugins: {
                'test-plugin': {
                  modules: {
                    'test-module': {
                      onPluginModuleBootFailure: 'abort',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(false);
    });

    it('should use default when module-specific config is not set', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'continue',
              },
              plugins: {
                'test-plugin': {
                  modules: {
                    'other-module': {
                      onPluginModuleBootFailure: 'abort',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(true);
    });

    it('should handle multiple modules independently', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'abort',
              },
              plugins: {
                'test-plugin': {
                  modules: {
                    'module-a': {
                      onPluginModuleBootFailure: 'continue',
                    },
                    'module-b': {
                      onPluginModuleBootFailure: 'abort',
                    },
                    'module-c': {
                      // No override, uses default
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'module-a')).toBe(true);
      expect(predicate('test-plugin', 'module-b')).toBe(false);
      expect(predicate('test-plugin', 'module-c')).toBe(false);
    });

    it('should handle modules across different plugins', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'abort',
              },
              plugins: {
                'plugin-a': {
                  modules: {
                    'module-x': {
                      onPluginModuleBootFailure: 'continue',
                    },
                  },
                },
                'plugin-b': {
                  modules: {
                    'module-y': {
                      onPluginModuleBootFailure: 'abort',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('plugin-a', 'module-x')).toBe(true);
      expect(predicate('plugin-b', 'module-y')).toBe(false);
    });
  });

  describe('combined plugin and module configurations', () => {
    it('should use module config when both plugin and module configs exist', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'abort',
                onPluginModuleBootFailure: 'abort',
              },
              plugins: {
                'test-plugin': {
                  onPluginBootFailure: 'continue',
                  modules: {
                    'test-module': {
                      onPluginModuleBootFailure: 'abort',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
      expect(predicate('test-plugin', 'test-module')).toBe(false);
    });

    it('should use plugin default when module config does not exist', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'abort',
                onPluginModuleBootFailure: 'abort',
              },
              plugins: {
                'test-plugin': {
                  onPluginBootFailure: 'continue',
                  modules: {
                    'other-module': {
                      onPluginModuleBootFailure: 'abort',
                    },
                  },
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
      expect(predicate('test-plugin', 'test-module')).toBe(false); // Uses default module config
    });
  });

  describe('edge cases', () => {
    it('should handle empty plugins config', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginBootFailure: 'continue',
              },
              plugins: {},
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin')).toBe(true);
    });

    it('should handle plugin with empty modules config', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'continue',
              },
              plugins: {
                'test-plugin': {
                  modules: {},
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(true);
    });

    it('should handle plugin without modules config', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              default: {
                onPluginModuleBootFailure: 'continue',
              },
              plugins: {
                'test-plugin': {
                  onPluginBootFailure: 'abort',
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('test-plugin', 'test-module')).toBe(true);
    });

    it('should handle case sensitivity correctly', () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            startup: {
              plugins: {
                'Test-Plugin': {
                  onPluginBootFailure: 'continue',
                },
              },
            },
          },
        },
      });
      const predicate = createAllowBootFailurePredicate(config);
      expect(predicate('Test-Plugin')).toBe(true);
      expect(predicate('test-plugin')).toBe(false); // Different case
    });
  });

  describe('performance - configuration read upfront', () => {
    it('should read configuration only once', () => {
      const configData = {
        backend: {
          startup: {
            default: {
              onPluginBootFailure: 'continue',
            },
            plugins: {
              'plugin-a': {
                onPluginBootFailure: 'abort',
                modules: {
                  'module-x': {
                    onPluginModuleBootFailure: 'continue',
                  },
                },
              },
            },
          },
        },
      };
      const config = mockServices.rootConfig({ data: configData });
      const predicate = createAllowBootFailurePredicate(config);

      // Call predicate multiple times - should use cached values
      expect(predicate('plugin-a')).toBe(false);
      expect(predicate('plugin-a')).toBe(false);
      expect(predicate('plugin-a', 'module-x')).toBe(true);
      expect(predicate('plugin-a', 'module-x')).toBe(true);
      expect(predicate('plugin-b')).toBe(true); // Uses default
    });
  });
});
