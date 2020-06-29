import { Writable } from 'stream';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';

export type Job = {
  id: string;
  metadata: {
    entity: any;
    values: any;
  };
  status: 'PENDING' | 'STARTED' | 'COMPLETE' | 'FAILED';
  stages: Stage[];
  logStream?: Writable;
  logger?: Logger;
  error?: Error;
};

export type Stage = {
  name: string;
  log: string[];
  status: 'PENDING' | 'STARTED' | 'COMPLETE' | 'FAILED';
  startedAt: string;
  finishedAt?: string;
};
