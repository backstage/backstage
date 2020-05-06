module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint.backend')],
  ignorePatterns: ['sample-templates/'],
  rules: {
    'no-console': 0, // Permitted in console programs
    'new-cap': ['error', { capIsNew: false }], // Because Express constructs things e.g. like 'const r = express.Router()'
  },
};
