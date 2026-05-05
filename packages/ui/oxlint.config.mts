import rootConfig from '../../oxlint.config.mts';

export default {
  ...rootConfig,
  rules: {
    ...rootConfig.rules,
    'backstage/no-mixed-plugin-imports': 'off',
  },
};
