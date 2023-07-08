import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { WelcomeTitle } from './WelcomeTitle';

describe('<WelcomeTitle>', () => {
  afterEach(() => jest.resetAllMocks());

  test('should greet user with default greeting', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T23:00:00').valueOf());

    const { getByText } = await renderInTestApp(<WelcomeTitle />);

    expect(getByText(/Get some rest, Guest/)).toBeInTheDocument();
  });

  test('should greet user with provided language', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2023-07-03T09:00:00').valueOf());

    const { getByText } = await renderInTestApp(
      <WelcomeTitle language="English" />,
    );

    expect(getByText(/Good morning, Guest/)).toBeInTheDocument();
  });

  test('should greet user with multiple languages', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2023-07-03T14:00:00').valueOf());

    const languages = ['English', 'Spanish'];
    const { getByText } = await renderInTestApp(
      <WelcomeTitle language={languages} />,
    );

    expect(getByText(/Good afternoon, Guest/)).toBeInTheDocument();
  });
});
