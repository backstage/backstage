import { GeneratorBase, GeneratorRunOptions, GeneratorRunResult } from "./types";
import { runDockerContainer } from './helpers'
import fs from 'fs';
import path from 'path';
import os from 'os';

export class TechdocsGenerator implements GeneratorBase {
    public async run({ directory, logStream, dockerClient }: GeneratorRunOptions): Promise<GeneratorRunResult> {
        const resultDir = fs.mkdtempSync(path.join(os.tmpdir(), `techdocs-tmp-`));

        await runDockerContainer({
            imageName: 'spotify/techdocs',
            args: ['build', '-d', '/result'],
            logStream,
            docsDir: directory,
            resultDir,
            dockerClient
        });

        console.log(`[TechDocs]: Successfully generated docs from ${directory} into ${resultDir}`)
        return { resultDir };
    };
};
