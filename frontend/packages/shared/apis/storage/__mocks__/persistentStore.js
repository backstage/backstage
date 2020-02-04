export const saveToStore = jest.fn();
export const removeFromStore = jest.fn();
export const getFromStore = jest.fn((id, key, fallback) => fallback);
