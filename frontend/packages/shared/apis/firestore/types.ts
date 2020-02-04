import Observable from 'zen-observable';
import Api from 'shared/pluginApi/Api';

export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [x: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type DocData = { [key in string]: JsonValue };

export type CollectionPath = string;
export type DocumentPath = string;

export type FieldPath = string | string[];

export type OrderBy = {
  field: FieldPath;
  // Sort order, defaults to ascending.
  direction?: 'asc' | 'desc';
  startAt?: JsonPrimitive;
  startAfter?: JsonPrimitive;
  endAt?: JsonPrimitive;
  endBefore?: JsonPrimitive;
};

export type WhereFilter = {
  field: FieldPath;
  op: '<' | '<=' | '==' | '>' | '>=';
  value: JsonPrimitive;
};

export type Query = {
  path: CollectionPath;
  startAt?: DocumentPath;
  startAfter?: DocumentPath;
  endAt?: DocumentPath;
  endBefore?: DocumentPath;
  limit?: number;
  orderBy?: OrderBy | OrderBy[];
  where?: WhereFilter | WhereFilter[];
};

// export type Mutation =
//   | {
//       op: 'add';
//       path: CollectionPath;
//       data: DocData;
//     }
//   | {
//       op: 'set' | 'update' | 'merge';
//       path: DocumentPath;
//       data: DocData;
//     }
//   | {
//       op: 'delete';
//       path: DocumentPath;
//     };

export type Doc<T extends DocData = DocData> = {
  id: string;
  path: DocumentPath;
  exists: boolean;
  data: T | undefined;
};

export type QueryResult<T extends DocData = DocData> = {
  docs: Doc<T>[];
};

export type FirestoreApi = {
  get<T extends DocData = DocData>(path: DocumentPath): Promise<Doc<T>>;
  observe<T extends DocData = DocData>(path: DocumentPath): Observable<Doc<T>>;
  query<T extends DocData = DocData>(query: Query): Promise<QueryResult<T>>;
  observeQuery<T extends DocData = DocData>(query: Query): Observable<QueryResult<T>>;
  add(path: CollectionPath, data: DocData): Promise<DocumentPath>;
  set(path: DocumentPath, data: DocData): Promise<void>;
  update(path: DocumentPath, data: DocData): Promise<void>;
  merge(path: DocumentPath, data: DocData): Promise<void>;
  delete(path: DocumentPath): Promise<void>;
  // write(mutation: Mutation | Mutation[]): Promise<void>;
};

export const firestoreApiRef = new Api<FirestoreApi>({
  id: 'firestore',
  title: 'Firestore',
  description: 'Api for talking to user-scoped Firebase database',
});
