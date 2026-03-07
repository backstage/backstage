import{j as t,c as a}from"./iframe-B0Lf5NUM.js";import{L as r}from"./LinkButton-DH2lszLp.js";import{L as m}from"./Link-wi1rFsNT.js";import{D as h}from"./Divider-CK9FlrKj.js";import{L as u}from"./List-H_vSxU0X.js";import{L as i}from"./ListItem-Cm0Qqfxw.js";import{L as s}from"./ListItemText-by58IRV6.js";import{B as l}from"./Button-BuRlNemE.js";import{u as f}from"./index-DKt6U3gJ.js";import{w as L,c as k}from"./appWrappers-Cb_SdAbw.js";import{u as d}from"./useRouteRef-CBHK3ucf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D2K6ALme.js";import"./lodash-DH4atvbO.js";import"./makeStyles-DeZCCiZz.js";import"./useAnalytics-CH2yDCbJ.js";import"./useApp-CqqROC9U.js";import"./ListContext-71Kb5fnr.js";import"./useObservable-J6JZdQJK.js";import"./useIsomorphicLayoutEffect-D1wuUzNo.js";import"./useAsync-jr_JLJU3.js";import"./useMountedState-DEhMjaJi.js";import"./componentData-t2dFRqgI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const c=k({id:"storybook.test-route"}),g=()=>{const n=f();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},z={title:"Inputs/Button",component:r,decorators:[n=>L(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(m,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(h,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(g,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":c}})],tags:["!manifest"]},e=()=>{const n=d(c);return t.jsxs(u,{children:[t.jsxs(i,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(r,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(i,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(r,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(i,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(r,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},o=()=>{const n=d(c),p=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(u,{children:[t.jsxs(i,{children:[t.jsx(r,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(i,{children:[t.jsx(r,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(i,{children:[t.jsx(l,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(i,{children:[t.jsx(l,{onClick:p,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const link = useRouteRef(routeRef);
  // Design Permutations:
  // color   = default | primary | secondary
  // variant = contained | outlined | text
  return (
    <List>
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
    </List>
  );
};
`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const ButtonLinks = () => {
  const link = useRouteRef(routeRef);

  const handleClick = () => {
    return "Your click worked!";
  };

  return (
    <>
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
          <MaterialButton
            href="https://backstage.io"
            color="default"
            variant="outlined"
          >
            View URL
          </MaterialButton>
          &nbsp; links to a defined URL using Material UI's Button.
        </ListItem>

        <ListItem>
          <MaterialButton
            onClick={handleClick}
            color="default"
            variant="outlined"
          >
            Trigger Event
          </MaterialButton>
          &nbsp; triggers an onClick event using Material UI's Button.
        </ListItem>
      </List>
    </>
  );
};
`,...o.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const H=["Default","ButtonLinks"];export{o as ButtonLinks,e as Default,H as __namedExportsOrder,z as default};
