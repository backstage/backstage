import { IndexableDocument } from '@backstage/plugin-search-common';

export interface ApiDocument extends IndexableDocument {
  /**
   * Entity kind
   */
  kind: string;

  /**
   * Entity lifecycle
   */
  lifecycle: string;
}
