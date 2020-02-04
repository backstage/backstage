import React from 'react';
import { useFirestore, FirestoreProvider } from './FirestoreProvider';
import { render } from '@testing-library/react';
import getFirestoreApi from './getFirestoreApi';

jest.mock('./getFirestoreApi');

const mockedGetFirestoreApi = getFirestoreApi as jest.MockedFunction<typeof getFirestoreApi>;

describe('FirestoreProvider', () => {
  it('should provide a firestore api', () => {
    const mockApi = { text: 'firestore' };

    const MyComponent = () => {
      const api = useFirestore() as any;
      return <div>this is the api: {api.text}</div>;
    };

    const rendered = render(
      <FirestoreProvider api={mockApi as any}>
        <MyComponent />
      </FirestoreProvider>,
    );

    rendered.getByText('this is the api: firestore');
  });

  it('should fall back to fetching default firestore api instance', () => {
    const mockApi = { text: 'default-firestore' };
    mockedGetFirestoreApi.mockReturnValue(mockApi as any);

    const MyComponent = () => {
      const api = useFirestore() as any;
      return <div>this is the api: {api.text}</div>;
    };

    const rendered = render(<MyComponent />);

    rendered.getByText('this is the api: default-firestore');
  });
});
