import{aA as x,aB as b,aC as L,aD as T,V as k,j as e,d as r,r as u}from"./iframe-BWaAozhM.js";import{E as f}from"./ExpandMore-B6NFdm12.js";import{B as s,H as P}from"./Header-mPkv1lID.js";import{M as g}from"./index-Dm-FVvkq.js";import{P as j}from"./Page-Br4yEsYS.js";import{L as t}from"./Link-CLkGqC_d.js";import{B as v}from"./Box-B9d7t8SV.js";import{P as I}from"./Popover-GnSZHMUP.js";import{L as E}from"./List-d_1gDOpt.js";import{L as d}from"./ListItem-CwaI1EQV.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-BNMTjnmn.js";import"./makeStyles-BXQqwRxM.js";import"./Grid-Bpm_oOGo.js";import"./Breadcrumbs-Cu-x-74e.js";import"./index-B9sM2jn7.js";import"./Page-DnN8b5qI.js";import"./useMediaQuery-DxWsq45C.js";import"./Tooltip-f0Mm140e.js";import"./Popper-Bx9nzt2H.js";import"./Portal-CeZ7D8j3.js";import"./index-8XpF7eZo.js";import"./lodash-C-lPDFyh.js";import"./useAnalytics-CGFkzRxT.js";import"./useApp-oTx36hQg.js";import"./styled-BFyqjI4T.js";import"./Modal-DSMNGChR.js";import"./ListContext-KZtCLGQU.js";var o={},m;function C(){if(m)return o;m=1;var i=x(),l=b();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var p=l(L()),c=i(T()),h=(0,c.default)(p.createElement("path",{d:"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"}),"ExpandLess");return o.default=h,o}var B=C();const S=k(B),oe={title:"Layout/Breadcrumbs",component:s,tags:["!manifest"]},n=()=>e.jsxs(g,{children:[e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(j,{themeId:"other",children:e.jsx(P,{title:"Current Page",type:"General Page",typeLink:"/"})})]}),a=()=>{const[i,l]=u.useState(null),p=y=>{l(y.currentTarget)},c=()=>{l(null)},h=!!i;return e.jsxs(g,{children:[e.jsx(r,{paragraph:!0,children:"It might be the case that you want to keep your breadcrumbs outside of the header. In that case, they should be positioned above the title of the page."}),e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(s,{color:"primaryText"}),e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",children:"Second Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Hidden breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you have more than three breadcrumbs. When user clicks on ellipses, expand the breadcrumbs out."}),e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",children:"Second Page"}),e.jsx(t,{to:"/",children:"Third Page"}),e.jsx(t,{to:"/",children:"Fourth Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Layered breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you want to show alternative breadcrumbs on the same hierarchical level."}),e.jsxs(u.Fragment,{children:[e.jsxs(s,{color:"primaryText",children:[e.jsx(t,{to:"/",children:"General Page"}),e.jsx(t,{to:"/",onClick:p,children:e.jsxs(v,{display:"flex",alignItems:"center",children:[e.jsx(r,{component:"span",children:"Second Page"}),h?e.jsx(S,{}):e.jsx(f,{})]})}),e.jsx(r,{children:"Current page"})]}),e.jsx(I,{open:h,onClose:c,anchorEl:i,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},children:e.jsxs(E,{children:[e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Another parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Yet another, parallel second page"})]})})]})]})};n.__docgenInfo={description:"",methods:[],displayName:"InHeader"};a.__docgenInfo={description:"",methods:[],displayName:"OutsideOfHeader"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const InHeader = () => (
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
