import { PreparerBase } from "./types";
import { Entity } from "@backstage/catalog-model";
import path from 'path';
import { parseReferenceAnnotation } from './helpers';

export class DirectoryPreparer implements PreparerBase {

    prepare(entity: Entity): Promise<string> {
        const { location: managedByLocation } = parseReferenceAnnotation('backstage.io/managed-by-location', entity);
        const { location: techdocsLocation } = parseReferenceAnnotation('backstage.io/techdocs-ref', entity);
  
        const managedByLocationDirectory = path.dirname(managedByLocation);

        return new Promise((resolve) => {
            resolve(path.resolve(managedByLocationDirectory, techdocsLocation));
        });
    };
};