import firebase from 'firebase/app';
import FirestoreDocFactory from './FirestoreDocFactory';
import FirestoreStorage from './FirestoreStorage';

type DocumentData = firebase.firestore.DocumentData;
type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
type DocumentReference = firebase.firestore.DocumentReference;
type CollectionReference = firebase.firestore.CollectionReference;

function createQueryMock(result: DocumentSnapshot[]) {
  const calls: any[] = [];

  const pushFn = (name: string) => (...args: any[]) => {
    calls.push([name, ...args]);
    return mock;
  };

  const mock = {
    calls,
    limit: pushFn('limit'),
    limitToLast: pushFn('limitToLast'),
    orderBy: pushFn('orderBy'),
    startAfter: pushFn('startAfter'),
    startAt: pushFn('startAt'),
    endAt: pushFn('endAt'),
    endBefore: pushFn('endBefore'),
    where: pushFn('where'),
    get: jest.fn().mockReturnValue({
      docs: result,
    }),
  };
  return mock;
}

describe('FirestoreStorage', () => {
  it('should be created using doc factory', async () => {
    const mockDoc = {} as any;

    jest.spyOn(FirestoreDocFactory, 'createWithAppAuth').mockReturnValue({ getDoc: async () => mockDoc } as any);
    const storage = FirestoreStorage.create({} as any);

    await expect((storage as any).rootDoc).resolves.toBe(mockDoc);
  });

  it('should get the root doc', async () => {
    const mockDoc = {
      get: async () => mockSnapshot as DocumentSnapshot,
      path: 'users/root',
    } as DocumentReference;
    const mockSnapshot = {
      id: 'root',
      ref: mockDoc,
      exists: true,
      data: () => ({ hello: 'world' } as DocumentData),
    };

    const storage = new FirestoreStorage(Promise.resolve(mockDoc));
    await expect(storage.get('/')).resolves.toEqual({
      data: { hello: 'world' },
      exists: true,
      id: 'root',
      path: '/',
    });
  });

  it('should get a doc in a collection', async () => {
    const mockDoc = {
      get: async () => mockSnapshot as DocumentSnapshot,
      path: 'users/root/col/doc',
    } as DocumentReference;
    const mockCollection = {
      path: 'users/root/col',
      doc: (path: string) => path === 'doc' && mockDoc,
    } as CollectionReference;
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path === 'col' && mockCollection,
    } as DocumentReference;
    const mockSnapshot = {
      id: 'doc',
      ref: mockDoc,
      exists: true,
      data: () => ({ hello: 'world' } as DocumentData),
    };

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.get('/col/doc')).resolves.toEqual({
      data: { hello: 'world' },
      exists: true,
      id: 'doc',
      path: '/col/doc',
    });
  });

  it('should get missing doc', async () => {
    const mockDoc = {
      get: async () => (mockSnapshot as unknown) as DocumentSnapshot,
      path: 'users/root/col/doc',
    } as DocumentReference;
    const mockCollection = {
      path: 'users/root/col',
      doc: (path: string) => path === 'doc' && mockDoc,
    } as CollectionReference;
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path === 'col' && mockCollection,
    } as DocumentReference;
    const mockSnapshot = {
      id: 'doc',
      ref: mockDoc,
      exists: false,
    };

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.get('/col/doc')).resolves.toEqual({
      data: undefined,
      exists: false,
      id: 'doc',
      path: '/col/doc',
    });
  });

  it('should fail to get docs and cols with invalid paths', async () => {
    const storage = new FirestoreStorage(undefined as any);

    await expect(storage.get('')).rejects.toThrow("Storage document path must start with '/', got ''");
    await expect(storage.get('col')).rejects.toThrow("Storage document path must start with '/', got 'col'");
    await expect(storage.get('/col/doc/')).rejects.toThrow(
      "Storage document path must not end with '/', got '/col/doc/'",
    );
    await expect(storage.get('/col')).rejects.toThrow(
      "Storage document path must have an even number of path components, got '/col'",
    );
    await expect(storage.get('/col/doc/col2')).rejects.toThrow(
      "Storage document path must have an even number of path components, got '/col/doc/col2'",
    );

    await expect(storage.query({ path: '' })).rejects.toThrow("Storage collection path must start with '/', got ''");
    await expect(storage.query({ path: 'col/' })).rejects.toThrow(
      "Storage collection path must start with '/', got 'col/'",
    );
    await expect(storage.query({ path: '/col' })).rejects.toThrow(
      "Storage collection path must end with '/', got '/col'",
    );
    await expect(storage.query({ path: '/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/'",
    );
    await expect(storage.query({ path: '/col/doc/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/col/doc/'",
    );
    await expect(storage.query({ path: '/col/doc/col2/doc2/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/col/doc/col2/doc2/'",
    );
  });

  it('should add a doc to a collection', async () => {
    const mockDoc2 = {
      path: 'users/root/col/doc/col2/new-doc',
    } as DocumentReference;
    const mockAdd = jest.fn().mockImplementation(() => mockDoc2);
    const mockCollection2 = {
      path: 'users/root/col/doc/col2',
      add: mockAdd as (data: any) => Promise<DocumentReference>,
    } as CollectionReference;
    const mockDoc = {
      path: 'users/root/col/new-doc',
      collection: (path: string) => path === 'col2' && mockCollection2,
    } as DocumentReference;
    const mockCollection = {
      path: 'users/root/col',
      doc: (path: string) => path === 'doc' && mockDoc,
    } as CollectionReference;
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path === 'col' && mockCollection,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.add('/col/doc/col2/', { hello: 'world' })).resolves.toBe('/col/doc/col2/new-doc');
    expect(mockAdd).toHaveBeenCalledWith({ hello: 'world' });
  });

  it('should set data in a doc', async () => {
    const mockSet = jest.fn();
    const rootDoc = {
      path: 'users/root',
      set: mockSet as any,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.set('/', { foo: 'bar' })).resolves.toBeUndefined();
    expect(mockSet).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should update data in a doc', async () => {
    const mockUpdate = jest.fn();
    const rootDoc = {
      path: 'users/root',
      update: mockUpdate as any,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.update('/', { foo: 'bar' })).resolves.toBeUndefined();
    expect(mockUpdate).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should merge data into a doc', async () => {
    const mockSet = jest.fn();
    const rootDoc = {
      path: 'users/root',
      set: mockSet as any,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.merge('/', { foo: 'bar' })).resolves.toBeUndefined();
    expect(mockSet).toHaveBeenCalledWith({ foo: 'bar' }, { merge: true });
  });

  it('should delete a doc', async () => {
    const mockDelete = jest.fn();
    const rootDoc = {
      path: 'users/root',
      delete: mockDelete as any,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.delete('/')).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledWith();
  });

  it('should query a collection with no params', async () => {
    const queryMock = createQueryMock([
      {
        id: 'doc1',
        ref: { path: 'users/root/col/doc1' } as DocumentReference,
        exists: true,
        data: () => ({ foo: 'bar' } as DocumentData),
      } as DocumentSnapshot,
    ]);
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.query({ path: '/col/' })).resolves.toEqual({
      docs: [
        {
          id: 'doc1',
          path: '/col/doc1',
          exists: true,
          data: { foo: 'bar' },
        },
      ],
    });
    expect(queryMock.calls).toEqual([]);
  });

  it('should query a collection with limit', async () => {
    const queryMock = createQueryMock([]);
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(storage.query({ path: '/col/', limit: 10 })).resolves.toEqual({
      docs: [],
    });
    expect(queryMock.calls).toEqual([['limit', 10]]);
  });

  it('should query a collection with many params', async () => {
    const queryMock = {
      ...createQueryMock([]),
      doc: (path: string) => ({ fakeDoc: path }),
    };
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(
      storage.query({
        path: '/col/',
        limit: 10,
        startAt: '/col/bar',
        startAfter: '/col/bar2',
        endAt: '/col/foo',
        endBefore: '/col/foo2',
        orderBy: { field: 'my.counter', direction: 'desc', startAfter: '2', endBefore: '10' },
        where: { field: 'type', op: '==', value: 'correct' },
      }),
    ).resolves.toEqual({
      docs: [],
    });
    expect(queryMock.calls).toEqual([
      ['startAt', { fakeDoc: 'bar' }],
      ['startAfter', { fakeDoc: 'bar2' }],
      ['endAt', { fakeDoc: 'foo' }],
      ['endBefore', { fakeDoc: 'foo2' }],
      ['where', 'type', '==', 'correct'],
      ['orderBy', 'my.counter', 'desc'],
      ['startAfter', '2'],
      ['endBefore', '10'],
      ['limit', 10],
    ]);
  });

  it('should query with multiple orderBy clauses', async () => {
    const queryMock = createQueryMock([]);
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: ['foo', 'bar'], direction: 'asc', startAt: 'a', endAt: 'z' },
          { field: 'b', startAt: 1, endAt: 10 },
        ],
      }),
    ).resolves.toEqual({ docs: [] });
    expect(queryMock.calls).toEqual([
      ['orderBy', new firebase.firestore.FieldPath('foo', 'bar'), 'asc'],
      ['orderBy', 'b', undefined],
      ['startAt', 'a', 1],
      ['endAt', 'z', 10],
    ]);
  });

  it('should fail query with gap in order delimiters', async () => {
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (createQueryMock([]) as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));
    await expect(
      storage.query({
        path: '/col/',
        orderBy: [{ field: 'a' }, { field: 'b', startAt: 1 }],
      }),
    ).rejects.toThrow('Invalid storage query, startAt option must appear in all previous orderBy clauses');

    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: 'a', endAt: 1 },
          { field: 'b', startAfter: 1 },
        ],
      }),
    ).rejects.toThrow('Invalid storage query, startAfter option must appear in all previous orderBy clauses');

    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: 'a', startAfter: 1 },
          { field: 'b', endAt: 1 },
          { field: 'b', endBefore: 1 },
        ],
      }),
    ).rejects.toThrow('Invalid storage query, endAt option must appear in all previous orderBy clauses');

    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: 'a', startAt: 1 },
          { field: 'b', endBefore: 0 },
        ],
      }),
    ).rejects.toThrow('Invalid storage query, endBefore option must appear in all previous orderBy clauses');

    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: 'a', startAt: 1, startAfter: 2, endBefore: 0 },
          { field: 'b', startAt: null },
        ],
      }),
    ).rejects.toThrow('Invalid storage query, only one of startAt and startAfter can be used in all orderBy clauses');

    await expect(
      storage.query({
        path: '/col/',
        orderBy: [
          { field: 'a', endAt: null, endBefore: null },
          { field: 'b', endBefore: 0 },
        ],
      }),
    ).rejects.toThrow('Invalid storage query, only one of endAt and endBefore can be used in all orderBy clauses');
  });

  it('should observe a document', async () => {
    let resolveListener: any;
    let listenerPromise = new Promise<any>(resolve => {
      resolveListener = resolve;
    });

    const mockDoc = {
      path: 'users/root',
      onSnapshot: ({ next }: any) => {
        resolveListener(next);
      },
    } as DocumentReference;
    const mockSnapshot = {
      id: 'root',
      ref: mockDoc,
      exists: true,
      data: () => ({ foo: 'bar' } as DocumentData),
    };

    const storage = new FirestoreStorage(Promise.resolve(mockDoc));
    const subscriber = {
      next: jest.fn(),
      error: jest.fn(),
      complete: jest.fn(),
    };
    const observable = storage.observe('/');
    observable.subscribe(subscriber);

    const listener = await listenerPromise;

    expect(subscriber.next).not.toHaveBeenCalled();
    listener(mockSnapshot);
    expect(subscriber.next).toHaveBeenCalledWith({ id: 'root', path: '/', exists: true, data: { foo: 'bar' } });
  });

  it('should observe and listen separately for each subscriber', async () => {
    const onSnapshot = jest.fn().mockImplementation(({ next }) => {
      next?.(mockSnapshot);
      return () => {};
    });
    const mockDoc = {
      path: 'users/root',
      onSnapshot: onSnapshot as any,
    } as DocumentReference;
    const mockSnapshot = {
      id: 'root',
      ref: mockDoc,
      exists: true,
      data: () => ({ foo: 'bar' } as DocumentData),
    };

    const storage = new FirestoreStorage(Promise.resolve(mockDoc));

    const out = await new Promise(resolve => {
      const subscription = storage.observe('/').subscribe({});
      storage
        .observe('/')
        .subscribe({})
        .unsubscribe();
      storage.observe('/').subscribe({
        next: val => {
          subscription.unsubscribe();
          resolve(val);
        },
      });
    });

    expect(out).toEqual({ id: 'root', path: '/', exists: true, data: { foo: 'bar' } });
    expect(onSnapshot).toHaveBeenCalledTimes(2);
  });

  it('should forward root doc errors in observe', async () => {
    const storage = new FirestoreStorage(Promise.reject(new Error('NOPE')));

    const out = await new Promise(resolve => {
      storage.observe('/').subscribe({
        error: resolve,
      });
    });

    expect(out).toEqual(new Error('NOPE'));
  });

  it('should forward errors in observe', async () => {
    const onSnapshot = jest.fn().mockImplementation(({ error }) => error(new Error('NOPE')));
    const mockDoc = {
      path: 'users/root',
      onSnapshot: onSnapshot as any,
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(mockDoc));

    const error = await new Promise(resolve => {
      storage.observe('/').subscribe({
        error: resolve,
      });
    });

    expect(error).toEqual(new Error('NOPE'));
  });

  it('should observe a query', async () => {
    const onSnapshot = jest.fn().mockImplementation(({ next }) => {
      next?.({ docs: [mockSnapshot] });
      return () => {};
    });
    const queryMock = { ...createQueryMock([]), onSnapshot };
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;
    const mockSnapshot = {
      id: 'root',
      ref: rootDoc,
      exists: true,
      data: () => ({ foo: 'bar' } as DocumentData),
    };

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));

    const result = await new Promise<any>(resolve => {
      const subscriber = storage.observeQuery({ path: '/col/' }).subscribe({});
      storage
        .observeQuery({ path: '/col/' })
        .subscribe({})
        .unsubscribe();
      storage.observeQuery({ path: '/col/' }).subscribe({
        next: value => {
          resolve(value);
          subscriber.unsubscribe();
        },
      });
    });

    expect(result.docs).toEqual([{ id: 'root', path: '/', exists: true, data: { foo: 'bar' } }]);
    expect(onSnapshot).toHaveBeenCalledTimes(2);
  });

  it('should forward root doc errors in observe query', async () => {
    const storage = new FirestoreStorage(Promise.reject(new Error('NOPE')));

    const out = await new Promise(resolve => {
      storage.observeQuery({ path: '/col/' }).subscribe({
        error: resolve,
      });
    });

    expect(out).toEqual(new Error('NOPE'));
  });

  it('should forward errors in observe query', async () => {
    const onSnapshot = jest.fn().mockImplementation(({ error }) => error(new Error('NOPE')));
    const queryMock = { ...createQueryMock([]), onSnapshot };
    const rootDoc = {
      path: 'users/root',
      collection: (path: string) => path && (queryMock as any),
    } as DocumentReference;

    const storage = new FirestoreStorage(Promise.resolve(rootDoc));

    const error = await new Promise(resolve => {
      storage.observeQuery({ path: '/col/' }).subscribe({
        error: resolve,
      });
    });

    expect(error).toEqual(new Error('NOPE'));
  });
});
