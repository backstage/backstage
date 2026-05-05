import rootConfig from '../../oxlint.config.mts';

export default {
  ...rootConfig,
  overrides: [
    ...(rootConfig.overrides ?? []),
    {
      files: ['src/schema/openapi/generated/**'],
      rules: {
        'no-redeclare': 'off',
      },
    },
  ],
};
