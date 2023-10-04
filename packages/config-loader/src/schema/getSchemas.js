const { workerData, parentPort, isMainThread } = require('worker_threads');
const {
  getProgramFromFiles,
  buildGenerator,
} = require('typescript-json-schema');
const { sep } = require('path');

const getSchemas = paths => {
  if (paths.length === 0) {
    return [];
  }

  const program = getProgramFromFiles(paths, {
    incremental: false,
    isolatedModules: true,
    lib: ['ES2022'], // Skipping most libs speeds processing up a lot, we just need the primitive types anyway
    noEmit: true,
    skipLibCheck: true, // Skipping lib checks speeds things up
    skipDefaultLibCheck: true,
    strict: true,
    typeRoots: [], // Do not include any additional types
    types: [],
  });

  const generator = buildGenerator(
    program,
    // This enables the use of these tags in TSDoc comments
    {
      required: true,
      validationKeywords: ['visibility', 'deepVisibility', 'deprecated'],
      ignoreErrors: true,
      uniqueNames: true,
    },
    paths.map(path => path.split(sep).join('/')), // Unix paths are expected for all OSes here
  );

  const tsSchemas = paths.map(path => {
    console.time(path);

    // All schemas should export a `Config` symbol
    const unixPath = path.split(sep).join('/'); // Unix paths are expected for all OSes here

    const generator = buildGenerator(
      program,
      // This enables the use of these tags in TSDoc comments
      {
        required: true,
        validationKeywords: ['visibility', 'deepVisibility', 'deprecated'],
        ignoreErrors: true,
        uniqueNames: true,
      },
      [unixPath],
    );

    // All schemas should export a `Config` symbol
    const configSymbol = generator
      ?.getMainFileSymbols(program, [unixPath])
      .find(symbolName => symbolName.startsWith('Config'));

    if (!configSymbol) {
      throw new Error(`Invalid schema in ${path}, missing Config export`);
    }

    const schema = generator?.getSchemaForSymbol(configSymbol);

    console.timeEnd(path);

    return { path, value: schema };
  });

  return tsSchemas;
};

const init = async paths => {
  const schema = await getSchemas(paths);
  parentPort?.postMessage(schema);
};

if (!isMainThread) {
  init(workerData.paths);
}

module.exports = { getSchemas };
