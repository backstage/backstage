import { PublisherBase } from './types';
import { Entity } from '@backstage/catalog-model';
import fs from 'fs';
import path from 'path';
import ncp from 'ncp';

export class LocalPublish implements PublisherBase {
    // 3. publish: create catalog in local file tree. Move files from temp catalog to local file tree catalog
    publish({ entity, directory }: {
        entity: Entity;
        directory: string;
    }): Promise<{
        remoteUrl: string;
    }> | { remoteUrl: string; } {
        const publishDir = path.resolve(__dirname, `../../../../static/docs/${entity.metadata.name}`);

        if (!fs.existsSync(publishDir)){
            fs.mkdirSync(publishDir, {recursive: true});
        }
        
        ncp(directory, publishDir, (err) => {
          if (err) {
            throw new Error(`Unable to copy tempdirectory ${directory} to ${publishDir}`)
          }
        });

        return { remoteUrl: `http://localhost:7000/techdocs/static/docs/${entity.metadata.name}` };
    };
};