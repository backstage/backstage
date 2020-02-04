import MockFirestoreStorage from './MockFirestoreStorage';
import FirestoreStorage from './FirestoreStorage';

describe('getFirestoreApi', () => {
  it('should get a mock implementation in tests', () => {
    jest.isolateModules(() => {
      const getFirestoreApi = require('./getFirestoreApi').default;
      const api = getFirestoreApi();
      expect(api).toBeInstanceOf(MockFirestoreStorage);
    });
  });

  it('should return the same instance', () => {
    jest.isolateModules(() => {
      const getFirestoreApi = require('./getFirestoreApi').default;
      const api1 = getFirestoreApi();
      const api2 = getFirestoreApi();
      expect(api1).toBe(api2);
    });
  });

  it('should create a real FirestoreStorage in production', () => {
    jest.isolateModules(() => {
      const mockInstance = {};
      jest.spyOn(FirestoreStorage, 'create').mockReturnValue(mockInstance as any);

      process.env.NODE_ENV = 'production';
      const getFirestoreApi = require('./getFirestoreApi').default;
      const api1 = getFirestoreApi();
      const api2 = getFirestoreApi();
      expect(api1).toBe(mockInstance);
      expect(api2).toBe(mockInstance);
      expect(FirestoreStorage.create).toHaveBeenCalledTimes(1);
    });
  });
});
