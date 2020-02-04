import Observable from 'zen-observable';
import get from 'lodash/get';
import chunk from 'lodash/chunk';
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';
import castArray from 'lodash/castArray';
import { DocData, DocumentPath, CollectionPath, Doc, FirestoreApi, Query, QueryResult } from './types';

class MockDocRef {
  exists = false;

  private docData?: DocData;
  private readonly collections = new Map<string, MockCollectionRef>();

  constructor(readonly path: string) {}

  get id() {
    return this.path.replace(/.*\//, '');
  }

  collection(path: string) {
    let col = this.collections.get(path);
    if (!col) {
      col = new MockCollectionRef(`${this.path}/${path}`);
      this.collections.set(path, col);
    }
    return col;
  }

  data(): DocData | undefined {
    return this.docData && JSON.parse(JSON.stringify(this.docData));
  }

  set(data: DocData) {
    this.exists = true;
    this.docData = data;
  }

  delete() {
    this.exists = false;
    this.docData = undefined;
  }
}

class MockCollectionRef {
  private readonly docs = new Map<string, MockDocRef>();

  constructor(private readonly path: string) {}

  doc(path: string) {
    let doc = this.docs.get(path);
    if (!doc) {
      doc = new MockDocRef(`${this.path}/${path}`);
      this.docs.set(path, doc);
    }
    return doc;
  }

  query(query: Query, rootPath: string): MockDocRef[] {
    let entries = Array.from(this.docs.entries()).filter(([, doc]) => doc.exists);

    for (const filter of castArray(query.where || [])) {
      entries = entries.filter(([, doc]) => {
        const value = get(doc.data(), filter.field);
        const notNull = value !== null && filter.value !== null;
        switch (filter.op) {
          case '<':
            return notNull && value < filter.value!;
          case '<=':
            return notNull && value <= filter.value!;
          case '==':
            return value === filter.value;
          case '>':
            return notNull && value > filter.value!;
          case '>=':
            return notNull && value >= filter.value!;
          default:
            throw new Error(`Invalid where filter op '${filter.op}'`);
        }
      });
    }

    const sorters = castArray(query.orderBy || []).slice();
    for (const sorter of sorters.reverse()) {
      entries = orderBy(entries, ([, doc]) => get(doc.data(), sorter.field), [sorter.direction || 'asc']);

      const asc = sorter.direction !== 'desc';
      if (sorter.startAt) {
        entries = entries.filter(([, doc]) => {
          const data = get(doc.data(), sorter.field);
          return asc ? data >= sorter.startAt! : data <= sorter.startAt!;
        });
      }
      if (sorter.startAfter) {
        entries = entries.filter(([, doc]) => {
          const data = get(doc.data(), sorter.field);
          return asc ? data > sorter.startAfter! : data < sorter.startAfter!;
        });
      }
      if (sorter.endAt) {
        entries = entries.filter(([, doc]) => {
          const data = get(doc.data(), sorter.field);
          return asc ? data <= sorter.endAt! : data >= sorter.endAt!;
        });
      }
      if (sorter.endBefore) {
        entries = entries.filter(([, doc]) => {
          const data = get(doc.data(), sorter.field);
          return asc ? data < sorter.endBefore! : data > sorter.endBefore!;
        });
      }
    }

    if (query.startAt) {
      entries = entries.filter(([, { path }]) => path >= rootPath + query.startAt!);
    }
    if (query.startAfter) {
      entries = entries.filter(([, { path }]) => path > rootPath + query.startAfter!);
    }
    if (query.endAt) {
      entries = entries.filter(([, { path }]) => path <= rootPath + query.endAt!);
    }
    if (query.endBefore) {
      entries = entries.filter(([, { path }]) => path < rootPath + query.endBefore!);
    }

    if (query.limit !== undefined) {
      entries = entries.slice(0, query.limit);
    }

    return entries.map(([, doc]) => doc);
  }
}

type Listener = {
  path: string;
  onUpdate: () => void;
};

export default class MockFirestoreStorage implements FirestoreApi {
  private readonly rootDoc = new MockDocRef('users/me');
  private readonly listeners = new Set<Listener>();

  async get<T extends DocData = DocData>(path: DocumentPath): Promise<Doc<T>> {
    return this.transformSnapshot<T>(this.getDocRef(path));
  }

  observe<T extends DocData = DocData>(path: DocumentPath): Observable<Doc<T>> {
    return new Observable(subscriber => {
      const doc = this.getDocRef(path);

      subscriber.next(this.transformSnapshot<T>(doc));

      const listener = {
        path,
        onUpdate: () => subscriber.next(this.transformSnapshot<T>(doc)),
      };

      this.listeners.add(listener);

      return () => {
        this.listeners.delete(listener);
      };
    });
  }

  async query<T extends DocData = DocData>(query: Query): Promise<QueryResult<T>> {
    const colRef = this.getColRef(query.path);
    const docs = colRef.query(query, this.rootDoc.path).map(snapshot => this.transformSnapshot<T>(snapshot));
    return { docs };
  }

  observeQuery<T extends DocData = DocData>(query: Query): Observable<QueryResult<T>> {
    return new Observable(subscriber => {
      const colRef = this.getColRef(query.path);

      subscriber.next({
        docs: colRef.query(query, this.rootDoc.path).map(snapshot => this.transformSnapshot<T>(snapshot)),
      });

      const listener = {
        path: query.path,
        onUpdate: () => {
          subscriber.next({
            docs: colRef.query(query, this.rootDoc.path).map(snapshot => this.transformSnapshot<T>(snapshot)),
          });
        },
      };

      this.listeners.add(listener);

      return () => {
        this.listeners.delete(listener);
      };
    });
  }

  async add(path: CollectionPath, data: DocData): Promise<DocumentPath> {
    const id = Math.random()
      .toString(36)
      .slice(2, 10);

    const newDoc = this.getColRef(path).doc(id);
    newDoc.set(data);
    await this.notify(newDoc);
    return newDoc.path.replace(this.rootDoc.path, '');
  }

  async set(path: DocumentPath, data: DocData): Promise<void> {
    const doc = this.getDocRef(path);
    doc.set(data);
    await this.notify(doc);
  }

  async update(path: DocumentPath, data: DocData): Promise<void> {
    const doc = this.getDocRef(path);
    if (!doc.exists) {
      const error = new Error(`Update failed, no document found at ${path}`);
      error.name = 'NotFoundError';
      throw error;
    }
    doc.set(data);
    await this.notify(doc);
  }

  async merge(path: DocumentPath, data: DocData): Promise<void> {
    const doc = this.getDocRef(path);
    const existingData = doc.data();
    if (!existingData) {
      doc.set(data);
    } else {
      doc.set(merge({}, existingData, data));
    }
    await this.notify(doc);
  }

  async delete(path: DocumentPath): Promise<void> {
    const doc = this.getDocRef(path);
    doc.delete();
    await this.notify(doc);
  }

  private async notify(doc: MockDocRef) {
    const notifyPath = doc.path.replace(this.rootDoc.path, '') || '/';
    await Promise.resolve();

    const parentPath = notifyPath.replace(/[^\/]+$/, '');

    this.listeners.forEach(({ path, onUpdate }) => {
      if (path === notifyPath || path === parentPath) {
        onUpdate();
      }
    });
  }

  private transformSnapshot<T extends DocData>(snapshot: MockDocRef): Doc<T> {
    const { id, path, exists } = snapshot;
    return {
      id,
      path: path.replace(this.rootDoc.path, '') || '/',
      exists,
      data: exists ? (snapshot.data() as T) : undefined,
    };
  }

  private getDocRef(path: DocumentPath): MockDocRef {
    if (!path.startsWith('/')) {
      throw new TypeError(`Storage document path must start with '/', got '${path}'`);
    }
    if (path !== '/' && path.endsWith('/')) {
      throw new TypeError(`Storage document path must not end with '/', got '${path}'`);
    }
    const parts = path
      .slice(1)
      .split('/')
      .filter(Boolean);
    if (parts.length % 2 !== 0) {
      throw new TypeError(`Storage document path must have an even number of path components, got '${path}'`);
    }

    return chunk(parts, 2).reduce((doc, [colPath, docPath]) => {
      return doc.collection(colPath).doc(docPath);
    }, this.rootDoc);
  }

  private getColRef(path: CollectionPath): MockCollectionRef {
    if (!path.startsWith('/')) {
      throw new TypeError(`Storage collection path must start with '/', got '${path}'`);
    }
    if (!path.endsWith('/')) {
      throw new TypeError(`Storage collection path must end with '/', got '${path}'`);
    }
    const [rootColPath, ...parts] = path.slice(1, -1).split('/');
    if (parts.length % 2 !== 0 || !rootColPath) {
      throw new TypeError(`Storage collection path must have an odd number of path components, got '${path}'`);
    }
    const rootCol = this.rootDoc.collection(rootColPath);

    return chunk(parts, 2).reduce((col, [docPath, colPath]) => {
      return col.doc(docPath).collection(colPath);
    }, rootCol);
  }
}
