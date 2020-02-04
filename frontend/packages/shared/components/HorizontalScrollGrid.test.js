import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { renderWithEffects, wrapInThemedTestApp } from 'testUtils';
import HorizontalScrollGrid from 'shared/components/HorizontalScrollGrid';
import { Grid } from '@material-ui/core';

describe('<HorizontalScrollGrid />', () => {
  beforeEach(() => {
    jest.spyOn(window.performance, 'now').mockReturnValue(5);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb(20));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    const rendered = render(
      wrapInThemedTestApp(
        <HorizontalScrollGrid>
          <Grid item>item1</Grid>
          <Grid item>item2</Grid>
        </HorizontalScrollGrid>,
      ),
    );
    rendered.getByText('item1');
    rendered.getByText('item2');
    expect(rendered.queryByLabelText('Scroll Left')).toBeNull();
    expect(rendered.queryByLabelText('Scroll Right')).toBeNull();
  });

  it('should show scroll buttons', async () => {
    Object.defineProperties(HTMLElement.prototype, {
      scrollLeft: {
        configurable: true,
        value: 5,
      },
      offsetWidth: {
        configurable: true,
        value: 10,
      },
      scrollWidth: {
        configurable: true,
        value: 20,
      },
    });

    let lastScroll = 0;
    HTMLElement.prototype.scrollBy = ({ left }) => {
      lastScroll = left;
    };

    const rendered = await renderWithEffects(
      wrapInThemedTestApp(
        <HorizontalScrollGrid style={{ maxWidth: 300 }}>
          <Grid item style={{ minWidth: 200 }}>
            item1
          </Grid>
          <Grid item style={{ minWidth: 200 }}>
            item2
          </Grid>
        </HorizontalScrollGrid>,
      ),
    );

    rendered.getByTitle('Scroll Left');
    rendered.getByTitle('Scroll Right');
    expect(lastScroll).toBe(0);
    fireEvent.click(rendered.getByTitle('Scroll Right'));
    expect(lastScroll).toBeGreaterThan(0);
    fireEvent.click(rendered.getByTitle('Scroll Left'));
    expect(lastScroll).toBeLessThan(0);

    delete HTMLElement.prototype.scrollLeft;
    delete HTMLElement.prototype.offsetWidth;
    delete HTMLElement.prototype.scrollWidth;
    delete HTMLElement.prototype.scrollBy;
  });
});
