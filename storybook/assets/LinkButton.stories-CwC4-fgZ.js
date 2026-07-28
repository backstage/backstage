import{bR as t,aa as a,cP as m}from"./iframe-X5mwL4tp.js";import{L as o}from"./LinkButton-7Lx0JL9Z.js";import{u}from"./useRouteRef-CwEa8AkF.js";import{L as d}from"./List-BY4TlFRU.js";import{L as e}from"./ListItem-DM3el4vg.js";import{B as c}from"./Button-BUMewLQr.js";import{L as s}from"./ListItemText-BVJrYxBd.js";import{O as h,a as f}from"./appWrappers-Cdoe-OPD.js";import{L}from"./Link-Bmr8Hz-w.js";import{D as x}from"./Divider-Di2k_0vY.js";import"./preload-helper-PPVm8Dsz.js";import"./ListContext-DWMy4CLq.js";import"./WebStorage-B0rG59bB.js";import"./useAnalytics-M9bf2v34.js";import"./useAsync-cHnixGLh.js";import"./useMountedState-9MODhG_9.js";import"./componentData-DOpgRNZ3.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CskUFJ-y.js";import"./useIsomorphicLayoutEffect-OSmP2MG9.js";import"./useApp-B4BHpcqM.js";import"./BUIProvider-gHi16S2c.js";import"./openLink-iaf6h5Vg.js";import"./useResolvedHref-v0hr4wbk.js";import"./index-C5TKpozf.js";import"./lodash-DbDoiTXZ.js";import"./makeStyles-CTt1csqa.js";const l=f({id:"storybook.test-route"}),g=()=>{const n=m();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},K={title:"Inputs/Button",component:o,decorators:[n=>h(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(L,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(x,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(g,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":l}})],tags:["!manifest"]},i=()=>{const n=u(l);return t.jsxs(d,{children:[t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(o,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(o,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(o,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},r=()=>{const n=u(l),p=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(d,{children:[t.jsxs(e,{children:[t.jsx(o,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(e,{children:[t.jsx(o,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(e,{children:[t.jsx(c,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(e,{children:[t.jsx(c,{onClick:p,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const Q=["Default","ButtonLinks"];export{r as ButtonLinks,i as Default,Q as __namedExportsOrder,K as default};
