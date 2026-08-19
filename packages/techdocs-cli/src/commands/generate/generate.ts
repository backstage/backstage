/*
 * Copyright 2020 The Backstage Authors
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

import { join, resolve } from 'node:path';
import { OptionValues } from 'commander';
import fs from 'fs-extra';
import JSON5 from 'json5';
import {
  TechdocsGenerator,
  ParsedLocationAnnotation,
  getMkdocsYml,
} from '@backstage/plugin-techdocs-node';
import { ConfigReader } from '@backstage/config';
import {
  convertTechDocsRefToLocationAnnotation,
  createLogger,
  getLogStream,
} from '../../lib/utility';
import { computeDirectoryEtag } from '../../lib/etag';

const TECHDOCS_METADATA_FILE = 'techdocs_metadata.json';
const GENERATED_SITE_ETAG_EXCLUDED_FILES = [
  TECHDOCS_METADATA_FILE,
  // The compressed sitemap can include gzip metadata that changes between
  // otherwise identical generated sites; sitemap.xml still captures content.
  'sitemap.xml.gz',
  // mkdocs writes build-date lastmod entries into sitemap.xml, so the hash
  // changes daily even when the documentation content is identical.
  'sitemap.xml',
];

export default async function generate(opts: OptionValues) {
  // Use techdocs-node package to generate docs. Keep consistency between Backstage and CI generating docs.
  // Docs can be prepared using actions/checkout or git clone, or similar paradigms on CI. The TechDocs CI workflow
  // will run on the CI pipeline containing the documentation files.

  const logger = createLogger({ verbose: opts.verbose });

  const sourceDir = resolve(opts.sourceDir);
  const outputDir = resolve(opts.outputDir);
  const omitTechdocsCorePlugin = opts.omitTechdocsCoreMkdocsPlugin;
  const dockerImage = opts.dockerImage;
  const pullImage = opts.pull;
  const legacyCopyReadmeMdToIndexMd = opts.legacyCopyReadmeMdToIndexMd;
  const disableExternalFonts = opts.disableExternalFonts;
  const defaultPlugins = opts.defaultPlugin;

  logger.info(`Using source dir ${sourceDir}`);
  logger.info(`Will output generated files in ${outputDir}`);

  logger.verbose('Creating output directory if it does not exist.');

  await fs.ensureDir(outputDir);

  const { path: mkdocsYmlPath, configIsTemporary } = await getMkdocsYml(
    sourceDir,
  );

  const config = new ConfigReader({
    techdocs: {
      generator: {
        runIn: opts.docker ? 'docker' : 'local',
        dockerImage,
        pullImage,
        mkdocs: {
          legacyCopyReadmeMdToIndexMd,
          omitTechdocsCorePlugin,
          disableExternalFonts,
          defaultPlugins,
        },
      },
    },
  });

  let parsedLocationAnnotation = {} as ParsedLocationAnnotation;
  if (opts.techdocsRef) {
    try {
      parsedLocationAnnotation = convertTechDocsRefToLocationAnnotation(
        opts.techdocsRef,
      );
    } catch (err) {
      logger.error(err.message);
    }
  }

  const hasExplicitEtag = opts.etag !== undefined;
  const etag = hasExplicitEtag ? opts.etag : undefined;

  // Generate docs using @backstage/plugin-techdocs-node
  const techdocsGenerator = await TechdocsGenerator.fromConfig(config, {
    logger,
  });

  logger.info('Generating documentation...');

  await techdocsGenerator.run({
    inputDir: sourceDir,
    outputDir,
    ...(opts.techdocsRef
      ? {
          parsedLocationAnnotation,
        }
      : {}),
    logger,
    etag,
    logStream: getLogStream(logger),
    siteOptions: { name: opts.siteName },
    runAsDefaultUser: opts.runAsDefaultUser,
  });

  if (!hasExplicitEtag) {
    const generatedSiteEtag = await computeDirectoryEtag(outputDir, {
      exclude: GENERATED_SITE_ETAG_EXCLUDED_FILES,
    });
    const metadataPath = join(outputDir, TECHDOCS_METADATA_FILE);
    const metadata = JSON5.parse(await fs.readFile(metadataPath, 'utf8'));
    await fs.writeFile(
      metadataPath,
      JSON.stringify({ ...metadata, etag: generatedSiteEtag }, null, 2),
    );
    logger.info(`Computed generated site content hash: ${generatedSiteEtag}`);
  }

  if (configIsTemporary) {
    process.on('exit', async () => {
      fs.rmSync(mkdocsYmlPath, {});
    });
  }

  logger.info('Done!');
}
