import{j as t}from"./jsx-runtime-CvpxdxdE.js";import{L as e}from"./LinkButton-DK-fVnZm.js";import{T as a}from"./Typography-C4wK928C.js";import{L as k}from"./Link-DmlXjQke.js";import{D as j}from"./Divider-CQVpOw77.js";import{L}from"./List-q1Ps7jPn.js";import{L as o}from"./ListItem-DZU9uVXE.js";import{L as s}from"./ListItemText-Bhrk3tXi.js";import{B as c}from"./Button-CCF23O8k.js";import{u as v}from"./index-CEhUYg2U.js";import{w as y,a as B}from"./appWrappers-Ce-h3mhN.js";import{u as x}from"./useRouteRef-clHAB9KK.js";import"./index-DSHF18-l.js";import"./defaultTheme-DT8oR2d2.js";import"./capitalize-Bw5a1ocu.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./makeStyles-yUUo8jj4.js";import"./useAnalytics-BqSe3k6a.js";import"./ApiRef-DDVPwL0h.js";import"./ConfigApi-1QFqvuIK.js";import"./ListContext-u-bsdFbB.js";import"./ButtonBase-CsQ2zz2r.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./MockTranslationApi-CqZA_upk.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BaoXGylq.js";import"./toArray-BGA7wbLE.js";import"./index-D9gx4uDp.js";import"./TranslationApi-NYdUF01F.js";import"./WebStorage-BMQO-dXK.js";import"./useAsync-W0CErRou.js";import"./useMountedState-BK0Y35lN.js";import"./componentData-CNQluCuE.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./index-B0bGgVUV.js";import"./ThemeProvider-BZpfpFrZ.js";import"./CssBaseline-DWDV0Ah6.js";import"./palettes-Bwgvserk.js";const l=B({id:"storybook.test-route"}),I=()=>{const n=v();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},Rt={title:"Inputs/Button",component:e,decorators:[n=>y(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(k,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(j,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(I,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":l}})]},i=()=>{const n=x(l);return t.jsxs(L,{children:[t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},r=()=>{const n=x(l),g=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(L,{children:[t.jsxs(o,{children:[t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(o,{children:[t.jsx(e,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(o,{children:[t.jsx(c,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(o,{children:[t.jsx(c,{onClick:g,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};var u,d,m;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  // Design Permutations:
  // color   = default | primary | secondary
  // variant = contained | outlined | text
  return <List>
      <ListItem>
        <ListItemText>
          <Typography variant="h6">Default Button:</Typography>
          This is the default button design which should be used in most cases.
          <br />
          <pre>color="primary" variant="contained"</pre>
        </ListItemText>

        <LinkButton to={link()} color="primary" variant="contained">
          Register Component
        </LinkButton>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Typography variant="h6">Secondary Button:</Typography>
          Used for actions that cancel, skip, and in general perform negative
          functions, etc.
          <br />
          <pre>color="secondary" variant="contained"</pre>
        </ListItemText>

        <LinkButton to={link()} color="secondary" variant="contained">
          Cancel
        </LinkButton>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Typography variant="h6">Tertiary Button:</Typography>
          Used commonly in a ButtonGroup and when the button function itself is
          not a primary function on a page.
          <br />
          <pre>color="default" variant="outlined"</pre>
        </ListItemText>

        <LinkButton to={link()} color="default" variant="outlined">
          View Details
        </LinkButton>
      </ListItem>
    </List>;
}`,...(m=(d=i.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var p,h,f;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  const handleClick = () => {
    return 'Your click worked!';
  };
  return <>
      <List>
        {
        // TODO: Refactor to use new routing mechanisms
      }
        <ListItem>
          <LinkButton to={link()} color="default" variant="outlined">
            Route Ref
          </LinkButton>
          &nbsp; has props for both Material UI's component as well as for
          react-router-dom's Route object.
        </ListItem>

        <ListItem>
          <LinkButton to="/staticpath" color="default" variant="outlined">
            Static Path
          </LinkButton>
          &nbsp; links to a statically defined route. In general, this should be
          avoided.
        </ListItem>

        <ListItem>
          <MaterialButton href="https://backstage.io" color="default" variant="outlined">
            View URL
          </MaterialButton>
          &nbsp; links to a defined URL using Material UI's Button.
        </ListItem>

        <ListItem>
          <MaterialButton onClick={handleClick} color="default" variant="outlined">
            Trigger Event
          </MaterialButton>
          &nbsp; triggers an onClick event using Material UI's Button.
        </ListItem>
      </List>
    </>;
}`,...(f=(h=r.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};const Tt=["Default","ButtonLinks"];export{r as ButtonLinks,i as Default,Tt as __namedExportsOrder,Rt as default};
