import { compileTsSchemas } from '@backstage/config-loader';

// Run with:
// npx ts-node  -O '{"module":"commonjs"}' -T check-schema.ts
const main = async () => {
  const paths = ['./plugins/catalog-backend/config.d.ts'];
  console.time('compileTsSchemas');
  const result = await compileTsSchemas(paths);
  console.timeEnd('compileTsSchemas');
  console.log(JSON.stringify(result, null, 2));
};

main();
