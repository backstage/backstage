import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  globalIgnores(['.next/**', 'dist/**', 'node_modules/**']),
  {
    rules: {
      'notice/notice': 'off',
      'react/forbid-elements': 'off',
      'jsx-a11y/alt-text': 'off',
    },
  },
]);

export default eslintConfig;
