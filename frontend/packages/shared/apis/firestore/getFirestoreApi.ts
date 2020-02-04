import FirestoreStorage from './FirestoreStorage';
import appAuth from 'core/app/auth';

// Lazy initialization to avoid side effects on module load in tests
const getFirestoreApi = (() => {
  let storage: FirestoreStorage | undefined;

  return () => {
    if (!storage) {
      if (process.env.NODE_ENV === 'test') {
        storage = new (require('./MockFirestoreStorage').default)();
      } else {
        storage = FirestoreStorage.create(appAuth);
      }
    }
    return storage!;
  };
})();

export default getFirestoreApi;
