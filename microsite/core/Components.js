const React = require('react');
const PropTypes = require('prop-types');
const simpleComponent = (Component, baseClassName = '', mods = []) => {
  const SimpleComponent = props => {
    // Extra BEM modifiers, e.g. `Block__Container--reversed`
    const modClasses = [];
    const otherProps = {};
    for (const prop in props) {
      if (mods.indexOf(prop) !== -1) {
        modClasses.push(`${baseClassName}--${prop}`);
      } else {
        otherProps[prop] = props[prop];
      }
    }

    return (
      <Component
        {...otherProps}
        className={`${baseClassName} ${props.className || ''} ${modClasses}`}
      />
    );
  };
  SimpleComponent.displayName = `SimpleComponent(${Component}, ${baseClassName})`;

  SimpleComponent.propTypes = {};
  for (const mod of mods) {
    SimpleComponent.propTypes[mod] = PropTypes.bool;
  }

  return SimpleComponent;
};

const Block = simpleComponent('section', 'Block', ['small', 'wrapped']);
Block.Container = simpleComponent('div', 'Block__Container', [
  'reversed',
  'wrapped',
  'column',
]);
Block.TitleBox = simpleComponent('h1', 'Block__TitleBox', ['large', 'story']);
Block.TextBox = simpleComponent('div', 'Block__TextBox', ['wide', 'small']);

Block.Title = simpleComponent('h1', 'Block__Title', ['half', 'main']);
Block.Subtitle = simpleComponent('h1', 'Block__Subtitle');

Block.SmallTitle = simpleComponent('h2', 'Block__SmallTitle');
Block.SmallestTitle = simpleComponent('h3', 'Block__SmallestTitle');

const BulletLine = simpleComponent('div', 'BulletLine');

Block.Paragraph = simpleComponent('p', 'Block__Paragraph');
Block.LinkButton = simpleComponent('a', 'Block__LinkButton', ['stretch']);
Block.QuoteContainer = simpleComponent('div', 'Block__QuoteContainer');
Block.Quote = simpleComponent('p', 'Block__Quote');
Block.Divider = simpleComponent('p', 'Block__Divider', ['quote']);
Block.MediaFrame = simpleComponent('div', 'Block__MediaFrame');
Block.Graphics = ({ padding, children }) => {
  const style = {};
  if (padding) {
    style.padding = `${padding}% 0`;
  }
  return (
    <div className="Block__GraphicsContainer" style={style}>
      <div className="Block__Graphics" children={children} />
    </div>
  );
};
Block.Graphic = props => {
  /* Coordinates and size are in % of graphics container size, e.g. width={50} is 50% of parent width */
  const { x = 0, y = 0, width = 0, src, className = '' } = props;
  const style = Object.assign(
    { left: `${x}%`, top: `${y}%`, width: `${width}%` },
    props.style,
  );
  return (
    <img
      src={src}
      alt=""
      {...props}
      style={style}
      className={`Block__Graphic ${className}`}
    />
  );
};

Block.Image = props => {
  /* Coordinates and size are in % of graphics container size, e.g. width={50} is 50% of parent width */
  return (
    <div
      {...props}
      className={`Block__Image${
        props.wide ? '--wide' : props.narrow ? '--narrow' : ''
      }`}
    />
  );
};

const ActionBlock = simpleComponent('section', 'ActionBlock');
ActionBlock.Title = simpleComponent('h1', 'ActionBlock__Title');
ActionBlock.Subtitle = simpleComponent('h2', 'ActionBlock__Subtitle');
ActionBlock.Link = simpleComponent('a', 'ActionBlock__Link');

const Breakpoint = ({ narrow, wide }) => (
  <React.Fragment>
    <div className="Breakpoint--narrow">{narrow}</div>
    <div className="Breakpoint--wide">{wide}</div>
  </React.Fragment>
);

const Banner = simpleComponent('div', 'Banner', ['hidden']);
Banner.Container = simpleComponent('div', 'Banner__Container');

const BannerDismissButton = simpleComponent(
  props => (
    <svg {...props} data-banner-dismiss viewBox="0 0 24 24">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  'Banner__DismissButton',
);

Banner.Dismissable = ({ storageKey, children }) => (
  <Banner hidden data-banner={storageKey}>
    {children}
    <BannerDismissButton />
  </Banner>
);

module.exports = {
  Block,
  ActionBlock,
  Breakpoint,
  BulletLine,
  Banner,
};
