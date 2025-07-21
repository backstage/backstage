import{j as o}from"./jsx-runtime-Cw0GR0a5.js";import{L as i,N as R}from"./Link-Bp-Lt7-P.js";import{R as u,a as d,u as k}from"./index-w6SBqnNd.js";import{w as f,a as x}from"./appWrappers-MqXYj6i0.js";import{u as h}from"./useRouteRef-DYu9ECtT.js";import"./index-CTjT7uj6.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./makeStyles-3WuthtJ7.js";import"./Typography-CUBppVl0.js";import"./useAnalytics-DVyBXs_0.js";import"./ApiRef-CqkoWjZn.js";import"./ConfigApi-D1qiBdfc.js";import"./MockTranslationApi-BG4T7xVR.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-Cm41Z5uw.js";import"./toArray-QeYAVC82.js";import"./index-CFaqwFgm.js";import"./TranslationApi-DhmNHZQM.js";import"./WebStorage-0NkRnF9s.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-B20g3K9Y.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-DlKBPm-W.js";import"./index-BRV0Se7Z.js";import"./ThemeProvider-HGIy1WSf.js";import"./CssBaseline-B78aEvSr.js";import"./palettes-Bwgvserk.js";const s=x({id:"storybook.test-route"}),j=()=>{const t=k();return o.jsxs("pre",{children:["Current location: ",t.pathname]})},uo={title:"Navigation/Link",component:i,decorators:[t=>f(o.jsxs("div",{children:[o.jsx("div",{children:o.jsx(j,{})}),o.jsx(t,{})]}),{mountedRoutes:{"/hello":s}})]},e=()=>{const t=h(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",o.jsx(u,{children:o.jsx(d,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})},r=()=>{const t=h(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),component:R,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",o.jsx(u,{children:o.jsx(d,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})};r.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"PassProps"};var n,a,p;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...(p=(a=e.parameters)==null?void 0:a.docs)==null?void 0:p.source}}};var m,c,l;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}
    /** react-router-dom related prop */ component={RouterNavLink}
    /** material-ui related prop */ color="secondary">
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...(l=(c=r.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};const ho=["Default","PassProps"];export{e as Default,r as PassProps,ho as __namedExportsOrder,uo as default};
