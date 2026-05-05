import rootConfig from '../../oxlint.config.mts';

export default {
  ...rootConfig,
  rules: {
    ...rootConfig.rules,
    'no-console': 'off',
  },
};
