module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  restrictedSrcImports: [
    {
      name: '@remixicon/react',
      message:
        'Do not depend on @remixicon/react. Copy SVG from Remix Icon into svg/ and run `yarn workspace @backstage/ui-icons generate`.',
    },
  ],
});
