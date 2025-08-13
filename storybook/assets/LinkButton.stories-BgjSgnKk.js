import{j as t}from"./jsx-runtime-Cw0GR0a5.js";import{L as e}from"./LinkButton-_OE7LV_d.js";import{T as a}from"./Typography-D5Gm01bp.js";import{L as k}from"./Link-CpO8OXNj.js";import{D as j}from"./Divider-BAm-5afo.js";import{L}from"./List-B21WyO9K.js";import{L as o}from"./ListItem-DrBaGnGs.js";import{L as s}from"./ListItemText-BQG6-PBZ.js";import{B as c}from"./Button-Lmh-1zSr.js";import{u as v}from"./index-w6SBqnNd.js";import{w as y,a as B}from"./appWrappers-DGD7X2ct.js";import{u as x}from"./useRouteRef-DYu9ECtT.js";import"./index-CTjT7uj6.js";import"./defaultTheme-DquFOgf8.js";import"./capitalize-BWjKmKKm.js";import"./withStyles-DWaS6n8x.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-C7DOmWEG.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CL6P1I3F.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./makeStyles-CRB_T0k9.js";import"./useAnalytics-DVyBXs_0.js";import"./ApiRef-CqkoWjZn.js";import"./ConfigApi-D1qiBdfc.js";import"./ListContext-DydK1sOh.js";import"./ButtonBase-BGCFQJw7.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./MockTranslationApi-BxEIBj9k.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BBh9Yz5k.js";import"./toArray-n7tUSQe9.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./MockErrorApi-OlaCHx8w.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-B20g3K9Y.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./index-BRV0Se7Z.js";import"./ThemeProvider-iV7LyTO2.js";import"./CssBaseline-0XN_ELQr.js";import"./palettes-Bwgvserk.js";const l=B({id:"storybook.test-route"}),I=()=>{const n=v();return t.jsxs("pre",{children:["Current location: ",n.pathname]})},Rt={title:"Inputs/Button",component:e,decorators:[n=>y(t.jsxs(t.Fragment,{children:[t.jsxs(a,{children:["A collection of buttons that should be used in the Backstage interface. These leverage the properties inherited from"," ",t.jsx(k,{to:"https://material-ui.com/components/buttons/",children:"Material UI Button"}),", but include an opinionated set that align to the Backstage design."]}),t.jsx(j,{}),t.jsxs("div",{children:[t.jsx("div",{children:t.jsx(I,{})}),t.jsx(n,{})]})]}),{mountedRoutes:{"/hello":l}})]},i=()=>{const n=x(l);return t.jsxs(L,{children:[t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Default Button:"}),"This is the default button design which should be used in most cases.",t.jsx("br",{}),t.jsx("pre",{children:'color="primary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"primary",variant:"contained",children:"Register Component"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Secondary Button:"}),"Used for actions that cancel, skip, and in general perform negative functions, etc.",t.jsx("br",{}),t.jsx("pre",{children:'color="secondary" variant="contained"'})]}),t.jsx(e,{to:n(),color:"secondary",variant:"contained",children:"Cancel"})]}),t.jsxs(o,{children:[t.jsxs(s,{children:[t.jsx(a,{variant:"h6",children:"Tertiary Button:"}),"Used commonly in a ButtonGroup and when the button function itself is not a primary function on a page.",t.jsx("br",{}),t.jsx("pre",{children:'color="default" variant="outlined"'})]}),t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"View Details"})]})]})},r=()=>{const n=x(l),g=()=>"Your click worked!";return t.jsx(t.Fragment,{children:t.jsxs(L,{children:[t.jsxs(o,{children:[t.jsx(e,{to:n(),color:"default",variant:"outlined",children:"Route Ref"}),"  has props for both Material UI's component as well as for react-router-dom's Route object."]}),t.jsxs(o,{children:[t.jsx(e,{to:"/staticpath",color:"default",variant:"outlined",children:"Static Path"}),"  links to a statically defined route. In general, this should be avoided."]}),t.jsxs(o,{children:[t.jsx(c,{href:"https://backstage.io",color:"default",variant:"outlined",children:"View URL"}),"  links to a defined URL using Material UI's Button."]}),t.jsxs(o,{children:[t.jsx(c,{onClick:g,color:"default",variant:"outlined",children:"Trigger Event"}),"  triggers an onClick event using Material UI's Button."]})]})})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"ButtonLinks"};var u,d,m;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
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
