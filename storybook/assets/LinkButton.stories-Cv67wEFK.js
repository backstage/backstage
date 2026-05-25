import{j as t,O as a,a9 as m}from"./iframe-COehFrpL.js";import{L as o}from"./LinkButton-C0RAUi7P.js";import{u}from"./useRouteRef-D1L3DfL_.js";import{L as d}from"./List-CiizdJ3F.js";import{L as e}from"./ListItem-KCvGwAe0.js";import{B as c}from"./Button-D7f3kZ7f.js";import{L as s}from"./ListItemText-DrxBjBT1.js";import{w as h,c as f}from"./appWrappers-B1z8Wgg5.js";import{L}from"./Link-B7XO7g3U.js";import{D as x}from"./Divider-e4wJPda_.js";import"./preload-helper-PPVm8Dsz.js";import"./ListContext-BRvGbkkj.js";import"./WebStorage-yF7QnIog.js";import"./useAnalytics-MdDpEXUp.js";import"./useAsync-B4wUCKvR.js";import"./useMountedState-B99v9kbG.js";import"./componentData-Bv-OxL3r.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BsDDQtlz.js";import"./useIsomorphicLayoutEffect-C1ydkRN7.js";import"./useApp-B2bmOZiO.js";import"./BUIProvider-Be41rQEI.js";import"./openLink-Df95N0dK.js";import"./useResolvedHref-B_8OEdp3.js";import"./index-a-YDJ9fl.js";import"./lodash-FtczDCAx.js";import"./makeStyles-D7As8WbR.js";const l=f({id:"storybook.test-route"}),g=()=>{const n=m();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},K={title:"Inputs/Button",component:o,decorators:[n=>h(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(L,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(x,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(g,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":l}})],tags:["!manifest"]},i=()=>{const n=u(l);return t.jsxs(d,{children:[t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(o,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(o,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(e,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(o,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},r=()=>{const n=u(l),p=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(d,{children:[t.jsxs(e,{children:[t.jsx(o,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(e,{children:[t.jsx(o,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(e,{children:[t.jsx(c,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(e,{children:[t.jsx(c,{onClick:p,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
