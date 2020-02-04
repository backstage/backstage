import React from 'react';
import { render } from '@testing-library/react';
import { FavoriteButton } from 'shared/components/layout';
import { useFavorite } from 'shared/apis/storage/favorites';
import { MemoryRouter } from 'react-router-dom';

jest.mock('shared/apis/storage/favorites');

const FAVS_KEY = 'favourites';
const ADD_TITLE = 'Add page to the list of your favorites';
const REMOVE_TITLE = 'Remove page from the list of your favorites';

describe('<FavoriteButton />', () => {
  let initialTitle;
  let initialStoreValue;
  let currentFavorite = null;

  useFavorite.mockImplementation(path => {
    const [favorite, setFavorite] = React.useState(null);
    const save = title => {
      currentFavorite = { path, title };
      setFavorite(currentFavorite);
    };
    const remove = () => {
      currentFavorite = null;
      setFavorite(currentFavorite);
    };
    return [favorite, save, remove, false, undefined];
  });

  beforeAll(() => {
    initialTitle = document.title;
    initialStoreValue = localStorage.getItem(FAVS_KEY);
  });

  beforeEach(() => {
    localStorage.setItem(FAVS_KEY, null);
    currentFavorite = null;
  });

  afterEach(() => {
    document.title = initialTitle;
  });

  afterAll(() => {
    document.title = initialTitle;
    localStorage.setItem(FAVS_KEY, initialStoreValue);
  });

  it('should render and toggle on click', () => {
    const rendered = render(
      <MemoryRouter initialEntries={['/']}>
        <FavoriteButton />
      </MemoryRouter>,
    );
    expect(rendered.getByTestId('favorite-button')).toBeInTheDocument();

    expect(rendered.getByTitle(ADD_TITLE)).toBeInTheDocument();

    rendered.getByTestId('favorite-button').click();

    expect(rendered.getByTitle(REMOVE_TITLE)).toBeInTheDocument();
  });

  it('should store favourites in persistent store', () => {
    document.title = 'Foo | Bar | Backstage';

    expect(currentFavorite).toBeNull();
    const rendered = render(
      <MemoryRouter initialEntries={['/foo/bar']}>
        <FavoriteButton />
      </MemoryRouter>,
    );
    expect(currentFavorite).toBeNull();

    rendered.getByTestId('favorite-button').click();
    expect(currentFavorite).toEqual({ path: '/foo/bar', title: 'Foo - Bar' });

    rendered.getByTestId('favorite-button').click();
    expect(currentFavorite).toBeNull();
  });

  [
    {
      path: '/',
      title: '',
      expectedTitle: '',
    },
    {
      path: '/',
      title: 'Single',
      expectedTitle: 'Single',
    },
    {
      path: '/foo',
      title: 'Foo | LastSkipped',
      expectedTitle: 'Foo',
    },
    {
      path: '/foo/bar',
      title: 'Bar | Foo | LastSkipped',
      expectedTitle: 'Bar - Foo',
    },
    {
      path: '/foo/bar/baz',
      title: 'Baz | Bar | Foo | LastSkipped',
      expectedTitle: 'Baz - Bar - Foo',
    },
    {
      path: '/',
      title: 'Baz | Bar | Foo | LastSkipped',
      expectedTitle: 'Baz - Bar - Foo',
    },
    {
      path: '/foo/bar/baz',
      title: '',
      expectedTitle: '',
    },
  ].forEach((test, index) => {
    it(`should work with various paths and titles [${index}]`, () => {
      const rendered = render(
        <MemoryRouter initialEntries={[test.path]}>
          <FavoriteButton />
        </MemoryRouter>,
      );
      const button = rendered.getByTestId('favorite-button');

      document.title = test.title;

      button.click();

      expect(currentFavorite).toEqual({ path: test.path, title: test.expectedTitle });

      button.click();
    });
  });

  it('should be able to override path and title', () => {
    document.title = 'Foo | Bar | Backstage';

    const rendered = render(
      <MemoryRouter initialEntries={['/foo/bar']}>
        <FavoriteButton path="/baz" title="Baz | Backstage" />
      </MemoryRouter>,
    );
    expect(currentFavorite).toBeNull();

    rendered.getByTestId('favorite-button').click();
    expect(currentFavorite).toEqual({ path: '/baz', title: 'Baz' });
  });
});
