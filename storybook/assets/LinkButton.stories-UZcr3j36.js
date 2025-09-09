import{j as t}from"./jsx-runtime-hv06LKfz.js";import{L as e}from"./LinkButton-BQ_gU9WM.js";import{T as a}from"./Typography-BvnmTcFn.js";import{L as p}from"./Link-DATBiw5a.js";import{D as h}from"./Divider-tNHB8jev.js";import{L as u}from"./List-BRD79VOL.js";import{L as o}from"./ListItem-1Gp_c_kg.js";import{L as s}from"./ListItemText-hnjP-Wi1.js";import{B as c}from"./Button-CEmE9XRa.js";import{u as f}from"./index-B7KODvs-.js";import{w as L,c as x}from"./appWrappers-BjFlSQSJ.js";import{u as d}from"./useRouteRef-ZIOUJ-Yz.js";import"./index-D8-PC79C.js";import"./defaultTheme-BZ7Q3aB1.js";import"./capitalize-Cx0lXINv.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./createSvgIcon-968fIvf3.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./makeStyles-DNGcMHuZ.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./ListContext-Brz5ktZ2.js";import"./ButtonBase-C97Mu9vz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./UnifiedThemeProvider-BH4EFam9.js";import"./classCallCheck-MFKM5G8b.js";import"./inherits-DJtd4kF-.js";import"./toArray-DBEVWI-m.js";import"./index-DtdSELz7.js";import"./TranslationApi-CV0OlCW4.js";import"./palettes-EuACyB3O.js";import"./CssBaseline-CAdWyNck.js";import"./ThemeProvider-C3WTbj0u.js";import"./MockErrorApi-xz33VbEd.js";import"./useAsync-7M-9CJJS.js";import"./useMountedState-YD35FCBK.js";import"./componentData-DvKcogcx.js";import"./isSymbol-DB9gu3CF.js";import"./isObject--vsEa_js.js";import"./toString-Ct-j8ZqT.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";const l=x({id:"storybook.test-route"}),g=()=>{const n=f();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},jt={title:"Inputs/Button",component:e,decorators:[n=>L(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(p,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(h,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(g,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":l}})]},i=()=>{const n=d(l);return t.jsxs(u,{children:[t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},r=()=>{const n=d(l),m=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(u,{children:[t.jsxs(o,{children:[t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(o,{children:[t.jsx(e,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(o,{children:[t.jsx(c,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(o,{children:[t.jsx(c,{onClick:m,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const vt=["Default","ButtonLinks"];export{r as ButtonLinks,i as Default,vt as __namedExportsOrder,jt as default};
