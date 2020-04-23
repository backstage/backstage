module.exports = {
  rules: {
    'no-console': 0, // Permitted in console programs
    'new-cap': ['error', { capIsNew: false }], // Because Express constructs things e.g. like 'const r = express.Router()'
  },
};
