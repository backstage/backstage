import Observable from 'zen-observable';
import firebase from 'firebase/app';
import chunk from 'lodash/chunk';
import castArray from 'lodash/castArray';
import FirestoreDocFactory from './FirestoreDocFactory';
import {
  JsonPrimitive,
  DocData,
  DocumentPath,
  CollectionPath,
  Doc,
  FieldPath,
  FirestoreApi,
  Query,
  QueryResult,
} from './types';
import { AppAuth } from 'core/app/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD9lgzKmd9jliPcCH1petc7HiB67jlh1GQ',
  authDomain: 'spotify.com',
  projectId: 'spotify-backstage',
};

type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
type DocumentReference = firebase.firestore.DocumentReference;
type CollectionReference = firebase.firestore.CollectionReference;
type FirestoreQuery = firebase.firestore.Query;

function mkFieldPath(path: FieldPath): string | firebase.firestore.FieldPath {
  if (Array.isArray(path)) {
    return new firebase.firestore.FieldPath(...path);
  }
  return path;
}

export default class FirestoreStorage implements FirestoreApi {
  static create(appAuth: AppAuth): FirestoreStorage {
    const factory = FirestoreDocFactory.createWithAppAuth(appAuth, firebaseConfig, 'default');
    return new FirestoreStorage(factory.getDoc());
  }

  constructor(private readonly rootDoc: Promise<DocumentReference>) {}

  async get<T extends DocData = DocData>(path: DocumentPath): Promise<Doc<T>> {
    const doc = await this.getDocRef(await this.rootDoc, path);
    const snapshot = await doc.get();

    return this.transformSnapshot<T>(snapshot, await this.rootDoc);
  }

  observe<T extends DocData = DocData>(path: DocumentPath): Observable<Doc<T>> {
    const docPromise = this.rootDoc.then(rootDoc => {
      return Promise.all([this.getDocRef(rootDoc, path), this.rootDoc]);
    });

    return new Observable(subscriber => {
      let unsubscribe: () => void;
      let didUnsubscribe = false;

      docPromise.then(
        ([doc, rootDoc]) => {
          if (didUnsubscribe) {
            return;
          }
          unsubscribe = doc.onSnapshot({
            next: snapshot => {
              subscriber.next(this.transformSnapshot<T>(snapshot, rootDoc));
            },
            error(error) {
              subscriber.error(error);
            },
          });
        },
        error => subscriber.error(error),
      );

      return () => {
        didUnsubscribe = true;
        if (unsubscribe) {
          unsubscribe();
        }
      };
    });
  }

  async query<T extends DocData = DocData>(query: Query): Promise<QueryResult<T>> {
    const collectionRef = await this.getColRef(query.path);
    const rootDoc = await this.rootDoc;
    const queryRef = this.prepareQuery(rootDoc, collectionRef, query);

    const result = await queryRef.get();
    const docs = result.docs.map(snapshot => this.transformSnapshot<T>(snapshot, rootDoc));

    return { docs };
  }

  observeQuery<T extends DocData = DocData>(query: Query): Observable<QueryResult<T>> {
    const collectionRefPromise = Promise.all([this.getColRef(query.path), this.rootDoc]);

    return new Observable(subscriber => {
      let unsubscribe: () => void;
      let didUnsubscribe = false;

      collectionRefPromise.then(
        ([collectionRef, rootDoc]) => {
          if (didUnsubscribe) {
            return;
          }
          unsubscribe = this.prepareQuery(rootDoc, collectionRef, query).onSnapshot({
            next: result => {
              const docs = result.docs.map(snapshot => this.transformSnapshot<T>(snapshot, rootDoc));
              subscriber.next({ docs });
            },
            error(error) {
              subscriber.error(error);
            },
          });
        },
        error => subscriber.error(error),
      );

      return () => {
        didUnsubscribe = true;
        if (unsubscribe) {
          unsubscribe();
        }
      };
    });
  }

  async add(path: CollectionPath, data: DocData): Promise<DocumentPath> {
    const colRef = await this.getColRef(path);
    const newDoc = await colRef.add(data);
    const rootDoc = await this.rootDoc;
    return newDoc.path.replace(rootDoc.path, '');
  }

  async set(path: DocumentPath, data: DocData): Promise<void> {
    const doc = await this.getDocRef(await this.rootDoc, path);
    return doc.set(data);
  }

  async update(path: DocumentPath, data: DocData): Promise<void> {
    const doc = await this.getDocRef(await this.rootDoc, path);
    return doc.update(data);
  }

  async merge(path: DocumentPath, data: DocData): Promise<void> {
    const doc = await this.getDocRef(await this.rootDoc, path);
    return doc.set(data, { merge: true });
  }

  async delete(path: DocumentPath): Promise<void> {
    const doc = await this.getDocRef(await this.rootDoc, path);
    return doc.delete();
  }

  private prepareQuery(rootDoc: DocumentReference, ref: FirestoreQuery, query: Query): FirestoreQuery {
    if (query.startAt) {
      ref = ref.startAt(this.getDocRef(rootDoc, query.startAt));
    }
    if (query.startAfter) {
      ref = ref.startAfter(this.getDocRef(rootDoc, query.startAfter));
    }
    if (query.endAt) {
      ref = ref.endAt(this.getDocRef(rootDoc, query.endAt));
    }
    if (query.endBefore) {
      ref = ref.endBefore(this.getDocRef(rootDoc, query.endBefore));
    }

    if (query.where) {
      for (const where of castArray(query.where)) {
        ref = ref.where(mkFieldPath(where.field), where.op, where.value);
      }
    }

    if (query.orderBy) {
      const startAt: JsonPrimitive[] = [];
      const startAfter: JsonPrimitive[] = [];
      const endAt: JsonPrimitive[] = [];
      const endBefore: JsonPrimitive[] = [];

      castArray(query.orderBy).forEach((orderBy, index) => {
        ref = ref.orderBy(mkFieldPath(orderBy.field), orderBy.direction);

        if (orderBy.startAt !== undefined) {
          if (startAt.length < index) {
            throw new TypeError('Invalid storage query, startAt option must appear in all previous orderBy clauses');
          }
          startAt.push(orderBy.startAt);
        }
        if (orderBy.startAfter !== undefined) {
          if (startAfter.length < index) {
            throw new TypeError('Invalid storage query, startAfter option must appear in all previous orderBy clauses');
          }
          startAfter.push(orderBy.startAfter);
        }
        if (orderBy.endAt !== undefined) {
          if (endAt.length < index) {
            throw new TypeError('Invalid storage query, endAt option must appear in all previous orderBy clauses');
          }
          endAt.push(orderBy.endAt);
        }
        if (orderBy.endBefore !== undefined) {
          if (endBefore.length < index) {
            throw new TypeError('Invalid storage query, endBefore option must appear in all previous orderBy clauses');
          }
          endBefore.push(orderBy.endBefore);
        }
      });

      if (startAt.length && startAfter.length) {
        throw new TypeError(
          'Invalid storage query, only one of startAt and startAfter can be used in all orderBy clauses',
        );
      }
      if (endAt.length && endBefore.length) {
        throw new TypeError(
          'Invalid storage query, only one of endAt and endBefore can be used in all orderBy clauses',
        );
      }
      if (startAt.length) {
        ref = ref.startAt(...startAt);
      }
      if (startAfter.length) {
        ref = ref.startAfter(...startAfter);
      }
      if (endAt.length) {
        ref = ref.endAt(...endAt);
      }
      if (endBefore.length) {
        ref = ref.endBefore(...endBefore);
      }
    }

    if (query.limit && query.limit > 0) {
      ref = ref.limit(query.limit);
    }

    return ref;
  }

  private transformSnapshot<T extends DocData>(snapshot: DocumentSnapshot, rootDoc: DocumentReference): Doc<T> {
    const { id, exists } = snapshot;
    const path = snapshot.ref.path.replace(rootDoc.path, '') || '/';

    if (exists) {
      const data = snapshot.data() as T;
      return { id, path, exists, data };
    }

    return { id, path, exists, data: undefined };
  }

  private getDocRef(rootDoc: DocumentReference, path: DocumentPath): DocumentReference {
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

    const doc = chunk(parts, 2).reduce((doc, [colPath, docPath]) => {
      return doc.collection(colPath).doc(docPath);
    }, rootDoc);

    return doc;
  }

  private async getColRef(path: CollectionPath): Promise<CollectionReference> {
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
    const rootCol = (await this.rootDoc).collection(rootColPath);

    const col = chunk(parts, 2).reduce((col, [docPath, colPath]) => {
      return col.doc(docPath).collection(colPath);
    }, rootCol);

    return col;
  }
}
