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

import {
  CompilerState,
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { TSDocTagSyntaxKind } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import fs from 'fs-extra';
import { groupBy } from 'lodash';
import { minimatch } from 'minimatch';
import {
  join,
  relative as relativePath,
  resolve as resolvePath,
} from 'node:path';
import { getPackageExportDetails } from '../getPackageExportDetails';
import { targetPaths } from '@backstage/cli-common';
import {
  FormattedReport,
  formatReports,
  restoreReport,
} from '../formatReports';
import { logApiReportInstructions } from '../logApiReportInstructions';
import { logReportDiff } from '../logReportDiff';
import { patchApiReportGeneration } from './patchApiReportGeneration';

async function readReport(reportPath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(reportPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

function countReportWarnings(content: string | undefined) {
  if (content === undefined) {
    return 0;
  }
  const lines = content.split('\n');

  const lineWarnings = lines.filter(line =>
    line.includes('// Warning:'),
  ).length;

  const trailerStart = lines.findIndex(
    line => line === '// Warnings were encountered during analysis:',
  );
  const trailerWarnings =
    trailerStart === -1
      ? 0
      : lines.length -
        trailerStart -
        4; /* 4 lines at the trailer and after are not warnings */

  return lineWarnings + trailerWarnings;
}

export async function countApiReportWarnings(reportPath: string) {
  return countReportWarnings(await readReport(reportPath));
}

/**
 * Compares reports the same way as API Extractor, where differences in
 * whitespace alone don't count as a change.
 */
function areEquivalentReports(a: string, b: string) {
  return a.replace(/\s+/g, ' ') === b.replace(/\s+/g, ' ');
}

function validateReportReleaseTags(
  report: string,
  reportPath: string,
  entryPointName: string,
) {
  // The root index entry point is only allowed @public exports, while /alpha and /beta only allow @alpha and @beta.
  if (!['index', 'alpha', 'beta'].includes(entryPointName)) {
    return;
  }
  const lines = report.split(/\r?\n/);
  const expectedTag = entryPointName === 'index' ? 'public' : entryPointName;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^\/\/ @(alpha|beta|public)/);
    if (match && match[1] !== expectedTag) {
      // Because of limitations in the type script rollup logic we need to allow public exports from the other release stages
      // TODO(Rugvip): Try to work around the need for this exception
      if (expectedTag !== 'public' && match[1] === 'public') {
        continue;
      }
      throw new Error(
        `Unexpected release tag ${match[1]} in ${reportPath} at line ${i + 1}`,
      );
    }
  }
}

/**
 * A report written by API Extractor to the temporary report folder, before it
 * has been formatted and compared with the committed report.
 */
interface ExtractedReport {
  packageDir: string;
  entryPointName: string;
  tempPath: string;
  reportPath: string;
  warningCountBefore: number;
  noBail: boolean;
}

export async function getTsDocConfig() {
  const tsdocConfigFile = await TSDocConfigFile.loadFile(
    require.resolve('@microsoft/api-extractor/extends/tsdoc-base.json'),
  );
  tsdocConfigFile.addTagDefinition({
    tagName: '@ignore',
    syntaxKind: TSDocTagSyntaxKind.ModifierTag,
  });
  tsdocConfigFile.addTagDefinition({
    tagName: '@config',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
  });
  tsdocConfigFile.setSupportForTag('@ignore', true);
  tsdocConfigFile.setSupportForTag('@config', true);
  return tsdocConfigFile;
}

async function findPackageEntryPoints(packageDirs: string[]): Promise<
  Array<{
    // package dir relative to root, e.g. "packages/backend-app-api"
    packageDir: string;
    // the name of the export, e.g. "index" or "alpha"
    name: string;
    // the path within the dist directory for this export, e.g. "alpha.d.ts"
    distPath: string;
    // the path within the dist-types directory of this package for this export,
    // e.g. "src/entrypoints/foo/index.d.ts"
    distTypesPath: string;
  }>
> {
  return Promise.all(
    packageDirs.map(async packageDir => {
      const pkg = await fs.readJson(
        targetPaths.resolveRoot(packageDir, 'package.json'),
      );

      return getPackageExportDetails(pkg).map(details => {
        return { packageDir, ...details };
      });
    }),
  ).then(results => results.flat());
}

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
  tsconfigFilePath: string;
  allowWarnings?: boolean | string[];
  omitMessages?: string[];
  validateReleaseTags?: boolean;
}

export async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
  tsconfigFilePath,
  allowWarnings = false,
  omitMessages = [],
  validateReleaseTags = false,
}: ApiExtractionOptions) {
  patchApiReportGeneration();

  await fs.remove(outputDir);

  // The collection of all entry points of all packages, as a single list
  const allEntryPoints = await findPackageEntryPoints(packageDirs);

  // The path (relative to the root) to ALL dist-types entry points (e.g.
  // "dist-types/packages/backend-app-api/src/index.d.ts"). These are used as
  // "extra"/contextual entry points for the extractor so that it can see the
  // full context of things that are required by the local entry point being
  // inspected.
  const allDistTypesEntryPointPaths = allEntryPoints.map(
    ({ packageDir, distTypesPath }) => {
      return targetPaths.resolveRoot('./dist-types', packageDir, distTypesPath);
    },
  );

  let compilerState: CompilerState | undefined = undefined;

  const allowWarningPkg = Array.isArray(allowWarnings) ? allowWarnings : [];

  const messagesConf: { [key: string]: { logLevel: string } } = {};
  for (const messageCode of omitMessages) {
    messagesConf[messageCode] = {
      logLevel: 'none',
    };
  }

  const extractedReports = new Array<ExtractedReport>();

  for (const [packageDir, packageEntryPoints] of Object.entries(
    groupBy(allEntryPoints, ep => ep.packageDir),
  )) {
    console.log(`## Processing ${packageDir}`);
    const noBail = Array.isArray(allowWarnings)
      ? allowWarnings.some(aw => aw === packageDir || minimatch(packageDir, aw))
      : allowWarnings;

    const projectFolder = targetPaths.resolveRoot(packageDir);
    const packageFolder = targetPaths.resolveRoot('./dist-types', packageDir);

    const remainingReportFiles = new Set(
      fs.readdirSync(projectFolder).filter(
        filename =>
          // https://regex101.com/r/QDZIV0/2
          filename !== 'knip-report.md' &&
          !filename.startsWith('cli-report') &&
          !filename.endsWith('.sql.md') &&
          // this has to temporarily match all old api report formats
          filename.match(/^.*?(api-)?report(-[^.-]+)?(.*?)\.md$/),
      ),
    );

    for (const packageEntryPoint of packageEntryPoints) {
      const suffix =
        packageEntryPoint.name === 'index' ? '' : `-${packageEntryPoint.name}`;
      const reportFileName = `report${suffix}`;
      const extractorConfig = ExtractorConfig.prepare({
        configObject: {
          mainEntryPointFilePath: resolvePath(
            packageFolder,
            packageEntryPoint.distTypesPath,
          ),
          bundledPackages: [],

          compiler: {
            tsconfigFilePath,
          },

          apiReport: {
            enabled: true,
            reportFileName,
            reportFolder: projectFolder,
            // Reports are read back after all packages are extracted, so
            // each package needs its own folder
            reportTempFolder: resolvePath(outputDir, 'reports', packageDir),
          },

          docModel: {
            // TODO(Rugvip): This skips docs for non-index entry points. We can try to work around it, but
            //               most likely it makes sense to wait for API Extractor to natively support exports.
            enabled: packageEntryPoint.name === 'index',
            apiJsonFilePath: resolvePath(
              outputDir,
              `<unscopedPackageName>${suffix}.api.json`,
            ),
          },

          dtsRollup: {
            enabled: false,
          },

          tsdocMetadata: {
            enabled: false,
          },

          messages: {
            // Silence compiler warnings, as these will prevent the CI build to work
            compilerMessageReporting: {
              default: {
                logLevel: 'none' as ExtractorLogLevel.None,
                // These contain absolute file paths, so can't be included in the report
                // addToApiReportFile: true,
              },
            },
            extractorMessageReporting: {
              default: {
                logLevel: 'warning' as ExtractorLogLevel.Warning,
                addToApiReportFile: true,
              },
              ...messagesConf,
            },
            tsdocMessageReporting: {
              default: {
                logLevel: 'warning' as ExtractorLogLevel.Warning,
                addToApiReportFile: true,
              },
            },
          },

          newlineKind: 'lf',

          projectFolder,
        },
        configObjectFullPath: projectFolder,
        packageJsonFullPath: resolvePath(projectFolder, 'package.json'),
        tsdocConfigFile: await getTsDocConfig(),
        ignoreMissingEntryPoint: true,
      });

      // remove extracted reports from current list
      for (const reportConfig of extractorConfig.reportConfigs) {
        remainingReportFiles.delete(reportConfig.fileName);
      }

      // The `packageFolder` needs to point to the location within `dist-types` in order for relative
      // paths to be logged. Unfortunately the `prepare` method above derives it from the `packageJsonFullPath`,
      // which needs to point to the actual file, so we override `packageFolder` afterwards.
      (
        extractorConfig as {
          packageFolder: string;
        }
      ).packageFolder = packageFolder;

      if (!compilerState) {
        compilerState = CompilerState.create(extractorConfig, {
          additionalEntryPoints: allDistTypesEntryPointPaths,
        });
      }

      // Message verbosity can't be configured, so just skip the check instead
      (Extractor as any)._checkCompilerCompatibility = () => {};

      // Invoke API Extractor, which only writes the reports to the temporary
      // report folder, see patchApiReportGeneration
      const extractorResult = Extractor.invoke(extractorConfig, {
        localBuild: isLocalBuild,
        showVerboseMessages: false,
        showDiagnostics: false,
        compilerState,
      });

      if (!extractorResult.succeeded) {
        throw new Error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`,
        );
      }

      for (const reportConfig of extractorConfig.reportConfigs) {
        const reportPath = resolvePath(
          extractorConfig.reportFolder,
          reportConfig.fileName,
        );
        extractedReports.push({
          packageDir,
          entryPointName: packageEntryPoint.name,
          tempPath: resolvePath(
            extractorConfig.reportTempFolder,
            reportConfig.fileName,
          ),
          reportPath,
          warningCountBefore: await countApiReportWarnings(reportPath),
          noBail,
        });
      }
    }

    if (remainingReportFiles.size > 0) {
      if (isLocalBuild) {
        for (const f of remainingReportFiles) {
          fs.rmSync(resolvePath(projectFolder, f));
          console.log(`Deleted deprecated API report ${f}`);
        }
      } else {
        const staleList = [...remainingReportFiles]
          .map(f => join(packageDir, f))
          .join(', ');
        throw new Error(
          `The API Report(s) ${staleList} are no longer relevant and should be deleted`,
        );
      }
    }
  }

  await updateApiReports(extractedReports, {
    isLocalBuild,
    allowWarningPkg,
    validateReleaseTags,
  });
}

/**
 * Formats all extracted reports in one batch, and then either updates the
 * committed reports, or fails if any of them are out of date.
 */
async function updateApiReports(
  extractedReports: ExtractedReport[],
  options: {
    isLocalBuild: boolean;
    allowWarningPkg: string[];
    validateReleaseTags: boolean;
  },
) {
  const { isLocalBuild, allowWarningPkg, validateReleaseTags } = options;

  const formattedReports = await formatReports(
    await Promise.all(
      extractedReports.map(async report => ({
        path: report.reportPath,
        content: await fs.readFile(report.tempPath, 'utf8'),
      })),
    ),
  );

  if (!isLocalBuild) {
    // CI builds never change the committed reports
    await Promise.all(formattedReports.map(report => restoreReport(report)));
  }

  const outdatedReports = new Array<FormattedReport>();

  for (const [index, extracted] of extractedReports.entries()) {
    const report = formattedReports[index];
    const { path: reportPath, existing, formatted } = report;

    // This release tag validation makes sure that the release tag of known entry points match expectations.
    if (validateReleaseTags) {
      validateReportReleaseTags(
        formatted,
        reportPath,
        extracted.entryPointName,
      );
    }

    if (existing !== undefined && areEquivalentReports(existing, formatted)) {
      if (isLocalBuild) {
        // Differences in whitespace alone don't replace the committed report
        await restoreReport(report);
      }
      continue;
    }

    const shortPath = relativePath(targetPaths.rootDir, reportPath);
    if (!isLocalBuild) {
      outdatedReports.push(report);
    } else if (existing === undefined) {
      console.warn(
        `Warning: The API report file was missing, so a new file was created. Please add this file to Git: ${shortPath}`,
      );
    } else {
      console.warn(
        `Warning: You have changed the API signature for this project. Updating ${shortPath}`,
      );
    }
  }

  if (outdatedReports.length > 0) {
    logApiReportInstructions();
    for (const { path: reportPath, existing, formatted } of outdatedReports) {
      logReportDiff(
        relativePath(targetPaths.rootDir, reportPath),
        existing,
        formatted,
      );
    }
    logApiReportInstructions();

    throw new Error(
      `The API Report(s) ${outdatedReports
        .map(({ path }) => relativePath(targetPaths.rootDir, path))
        .join(', ')} are out of date`,
    );
  }

  const warnings = new Array<string>();

  for (const [index, extracted] of extractedReports.entries()) {
    const { packageDir, noBail, warningCountBefore } = extracted;
    const warningCountAfter = countReportWarnings(
      formattedReports[index].formatted,
    );

    if (noBail) {
      console.log(`Skipping warnings check for ${packageDir}`);
    }
    if (warningCountAfter > 0 && !noBail) {
      throw new Error(
        `The API Report for ${packageDir} is not allowed to have warnings`,
      );
    }
    if (warningCountAfter === 0 && allowWarningPkg.includes(packageDir)) {
      console.log(
        `No need to allow warnings for ${packageDir}, it does not have any`,
      );
    }
    if (warningCountAfter > warningCountBefore) {
      warnings.push(
        `The API Report for ${packageDir} introduces new warnings. ` +
          'Please fix these warnings in order to keep the API Reports tidy.',
      );
    }
  }

  if (warnings.length > 0) {
    console.warn();
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.warn();
  }
}
