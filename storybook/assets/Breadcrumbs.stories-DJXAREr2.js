import{aQ as x,aR as b,aS as L,aT as j,aE as f,j as e,M as g,O as r,r as u}from"./iframe-D7zjeBit.js";import{E as T}from"./ExpandMore-CHCoKjrA.js";import{B as o,H as k}from"./Header-L79glJ9f.js";import{P}from"./Page-CcBrvD7W.js";import{L as a}from"./Link-43gYvX88.js";import{B as v}from"./Box-eqPq7tDA.js";import{P as E}from"./Popover-BLVU7E1s.js";import{L as I}from"./List-_IcS7A5z.js";import{L as d}from"./ListItem-PR8H70fv.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-CwZMGvXr.js";import"./Grid-BwBMybgh.js";import"./makeStyles-BdLugvEp.js";import"./Breadcrumbs-iK3eEwKd.js";import"./index-B9sM2jn7.js";import"./Page-n6e5XJVR.js";import"./useMediaQuery-C_vpzr4_.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";import"./Portal-B4c0pg-w.js";import"./index-B9TfV-iv.js";import"./lodash-CaiQO1ZN.js";import"./useAnalytics-CJoDpLKX.js";import"./useApp-CAJtRMT4.js";import"./styled-Cto7NXi2.js";import"./Modal-CKF7dnop.js";import"./ListContext-338I8pjt.js";var t={},m;function C(){if(m)return t;m=1;var i=x(),l=b();Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var p=l(L()),c=i(j()),h=(0,c.default)(p.createElement("path",{d:"M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"}),"ExpandLess");return t.default=h,t}var B=C();const S=f(B),oe={title:"Layout/Breadcrumbs",component:o,tags:["!manifest"]},n=()=>e.jsxs(g,{children:[e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(P,{themeId:"other",children:e.jsx(k,{title:"Current Page",type:"General Page",typeLink:"/"})})]}),s=()=>{const[i,l]=u.useState(null),p=y=>{l(y.currentTarget)},c=()=>{l(null)},h=!!i;return e.jsxs(g,{children:[e.jsx(r,{paragraph:!0,children:"It might be the case that you want to keep your breadcrumbs outside of the header. In that case, they should be positioned above the title of the page."}),e.jsx("h2",{children:"Standard breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Underlined pages are links. This should show a hierarchical relationship."}),e.jsx(o,{color:"primaryText"}),e.jsxs(o,{color:"primaryText",children:[e.jsx(a,{to:"/",children:"General Page"}),e.jsx(a,{to:"/",children:"Second Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Hidden breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you have more than three breadcrumbs. When user clicks on ellipses, expand the breadcrumbs out."}),e.jsxs(o,{color:"primaryText",children:[e.jsx(a,{to:"/",children:"General Page"}),e.jsx(a,{to:"/",children:"Second Page"}),e.jsx(a,{to:"/",children:"Third Page"}),e.jsx(a,{to:"/",children:"Fourth Page"}),e.jsx(r,{children:"Current page"})]}),e.jsx("h2",{children:"Layered breadcrumbs"}),e.jsx(r,{paragraph:!0,children:"Use this when you want to show alternative breadcrumbs on the same hierarchical level."}),e.jsxs(u.Fragment,{children:[e.jsxs(o,{color:"primaryText",children:[e.jsx(a,{to:"/",children:"General Page"}),e.jsx(a,{to:"/",onClick:p,children:e.jsxs(v,{display:"flex",alignItems:"center",children:[e.jsx(r,{component:"span",children:"Second Page"}),h?e.jsx(S,{}):e.jsx(T,{})]})}),e.jsx(r,{children:"Current page"})]}),e.jsx(E,{open:h,onClose:c,anchorEl:i,anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},children:e.jsxs(I,{children:[e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Another parallel second page"}),e.jsx(d,{button:!0,style:{textDecoration:"underline"},children:"Yet another, parallel second page"})]})})]})]})};n.__docgenInfo={description:"",methods:[],displayName:"InHeader"};s.__docgenInfo={description:"",methods:[],displayName:"OutsideOfHeader"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <MemoryRouter>
    <h2>Standard breadcrumbs</h2>
    <Typography paragraph>
      Underlined pages are links. This should show a hierarchical relationship.
    </Typography>

    <Page themeId="other">
      <Header title="Current Page" type="General Page" typeLink="/" />
    </Page>
  </MemoryRouter>`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const ne=["InHeader","OutsideOfHeader"];export{n as InHeader,s as OutsideOfHeader,ne as __namedExportsOrder,oe as default};
