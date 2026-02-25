import{aK as x,aL as b,aM as L,aN as T,Y as k,j as e,e as r,r as u}from"./iframe-DEPu6gb6.js";import{E as f}from"./ExpandMore-f018RETT.js";import{B as s,H as P}from"./Header-BRY0VPam.js";import{M as g}from"./index-Dne3y8qR.js";import{P as j}from"./Page-ZF2EweM5.js";import{L as t}from"./Link-BdV67OKF.js";import{B as v}from"./Box-CRmT1Uep.js";import{P as I}from"./Popover-JW9C08Jz.js";import{L as E}from"./List-6W-tA5Er.js";import{L as d}from"./ListItem-Bp_YBU-O.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-11spcsYM.js";import"./makeStyles-DmiRwbC-.js";import"./Grid-B4jZTMCZ.js";import"./Breadcrumbs-DsqYNbbs.js";import"./index-B9sM2jn7.js";import"./Page-PH8oT19_.js";import"./useMediaQuery-C3_nB813.js";import"./Tooltip-Du9bg8BH.js";import"./Popper-V2uzkjHi.js";import"./Portal-CQdgPEoH.js";import"./index-DYHA3-tG.js";import"./lodash-BpJ5SQhB.js";import"./useAnalytics-tiEgn8GG.js";import"./useApp-B3ERp2df.js";import"./styled-C8JkirxD.js";import"./Modal-CgWsFYOX.js";import"./ListContext-YZAoD3r_.js";var o={},m;function C(){if(m)return o;m=1;var i=x(),l=b();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var p=l(L()),c=i(T()),h=(0,c.default)(p.createElement("path",{d:"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"}),"ExpandLess");return o.default=h,o}var B=C();const M=k(B),oe={title:"Layout/Breadcrumbs",component:s,tags:["!manifest"]},n=()=>e.jsxs(g,{children:[e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(j,{themeId:"other",children:e.jsx(P,{title:"Current Page",type:"General Page",typeLink:"/"})})]}),a=()=>{const[i,l]=u.useState(null),p=y=>{l(y.currentTarget)},c=()=>{l(null)},h=!!i;return e.jsxs(g,{children:[e.jsx(r,{paragraph:!0,children:"It might be the case that you want to keep your breadcrumbs outside of the header. In that case, they should be positioned above the title of the page."}),e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(s,{color:"primaryText"}),e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",children:"Second Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Hidden breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you have more than three breadcrumbs. When user clicks on ellipses, expand the breadcrumbs out."}),e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",children:"Second Page"}),e.jsx(t,{to:"/",children:"Third Page"}),e.jsx(t,{to:"/",children:"Fourth Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Layered breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you want to show alternative breadcrumbs on the same hierarchical level."}),e.jsxs(u.Fragment,{children:[e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",onClick:p,children:e.jsxs(v,{display:"flex",alignItems:"center",children:[e.jsx(r,{component:"span",children:"Second Page"}),h?e.jsx(M,{}):e.jsx(f,{})]})}),e.jsx(r,{children:"Current page"})]}),e.jsx(I,{open:h,onClose:c,anchorEl:i,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},children:e.jsxs(E,{children:[e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Another parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Yet another, parallel second page"})]})})]})]})};n.__docgenInfo={description:"",methods:[],displayName:"InHeader"};a.__docgenInfo={description:"",methods:[],displayName:"OutsideOfHeader"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const InHeader = () => (
  <MemoryRouter>
    <h2>Standard breadcrumbs</h2>
    <Typography paragraph>
      Underlined pages are links. This should show a hierarchical relationship.
    </Typography>

    <Page themeId="other">
      <Header title="Current Page" type="General Page" typeLink="/" />
    </Page>
  </MemoryRouter>
);
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const OutsideOfHeader = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <MemoryRouter>
      <Typography paragraph>
        It might be the case that you want to keep your breadcrumbs outside of
        the header. In that case, they should be positioned above the title of
        the page.
      </Typography>

      <h2>Standard breadcrumbs</h2>
      <Typography paragraph>
        Underlined pages are links. This should show a hierarchical
        relationship.
      </Typography>

      <Breadcrumbs color="primaryText" />

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Hidden breadcrumbs</h2>
      <Typography paragraph>
        Use this when you have more than three breadcrumbs. When user clicks on
        ellipses, expand the breadcrumbs out.
      </Typography>

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Link to="/">Third Page</Link>
        <Link to="/">Fourth Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Layered breadcrumbs</h2>
      <Typography paragraph>
        Use this when you want to show alternative breadcrumbs on the same
        hierarchical level.
      </Typography>

      <Fragment>
        <Breadcrumbs color="primaryText">
          <Link to="/">General Page</Link>
          <Link to="/" onClick={handleClick}>
            <Box display="flex" alignItems="center">
              <Typography component="span">Second Page</Typography>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Link>
          <Typography>Current page</Typography>
        </Breadcrumbs>
        <Popover
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem button style={{ textDecoration: "underline" }}>
              Parallel second page
            </ListItem>
            <ListItem button style={{ textDecoration: "underline" }}>
              Another parallel second page
            </ListItem>
            <ListItem button style={{ textDecoration: "underline" }}>
              Yet another, parallel second page
            </ListItem>
          </List>
        </Popover>
      </Fragment>
    </MemoryRouter>
  );
};
`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <MemoryRouter>
    <h2>Standard breadcrumbs</h2>
    <Typography paragraph>
      Underlined pages are links. This should show a hierarchical relationship.
    </Typography>

    <Page themeId="other">
      <Header title="Current Page" type="General Page" typeLink="/" />
    </Page>
  </MemoryRouter>`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return <MemoryRouter>
      <Typography paragraph>
        It might be the case that you want to keep your breadcrumbs outside of
        the header. In that case, they should be positioned above the title of
        the page.
      </Typography>

      <h2>Standard breadcrumbs</h2>
      <Typography paragraph>
        Underlined pages are links. This should show a hierarchical
        relationship.
      </Typography>

      <Breadcrumbs color="primaryText" />

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Hidden breadcrumbs</h2>
      <Typography paragraph>
        Use this when you have more than three breadcrumbs. When user clicks on
        ellipses, expand the breadcrumbs out.
      </Typography>

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Link to="/">Third Page</Link>
        <Link to="/">Fourth Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Layered breadcrumbs</h2>
      <Typography paragraph>
        Use this when you want to show alternative breadcrumbs on the same
        hierarchical level.
      </Typography>

      <Fragment>
        <Breadcrumbs color="primaryText">
          <Link to="/">General Page</Link>
          <Link to="/" onClick={handleClick}>
            <Box display="flex" alignItems="center">
              <Typography component="span">Second Page</Typography>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Link>
          <Typography>Current page</Typography>
        </Breadcrumbs>
        <Popover open={open} onClose={handleClose} anchorEl={anchorEl} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }} transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}>
          <List>
            <ListItem button style={{
            textDecoration: 'underline'
          }}>
              Parallel second page
            </ListItem>
            <ListItem button style={{
            textDecoration: 'underline'
          }}>
              Another parallel second page
            </ListItem>
            <ListItem button style={{
            textDecoration: 'underline'
          }}>
              Yet another, parallel second page
            </ListItem>
          </List>
        </Popover>
      </Fragment>
    </MemoryRouter>;
}`,...a.parameters?.docs?.source}}};const se=["InHeader","OutsideOfHeader"];export{n as InHeader,a as OutsideOfHeader,se as __namedExportsOrder,oe as default};
