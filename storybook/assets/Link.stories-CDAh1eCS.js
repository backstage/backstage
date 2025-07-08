import{j as o}from"./jsx-runtime-CvpxdxdE.js";import{L as i,N as R}from"./Link-DmlXjQke.js";import{R as u,a as d,u as k}from"./index-CEhUYg2U.js";import{w as f,a as x}from"./appWrappers-CAnj1DEa.js";import{u as h}from"./useRouteRef-clHAB9KK.js";import"./index-DSHF18-l.js";import"./index-jB8bSz_h.js";import"./lodash-D8aMxhkM.js";import"./index-DBvFAGNd.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./capitalize-Bw5a1ocu.js";import"./defaultTheme-DT8oR2d2.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./makeStyles-yUUo8jj4.js";import"./Typography-C4wK928C.js";import"./useAnalytics-BqSe3k6a.js";import"./ApiRef-DDVPwL0h.js";import"./ConfigApi-1QFqvuIK.js";import"./MockTranslationApi-CS6f1cst.js";import"./classCallCheck-BNzALLS0.js";import"./inherits-BaoXGylq.js";import"./toArray-BGA7wbLE.js";import"./index-D9gx4uDp.js";import"./TranslationApi-NYdUF01F.js";import"./WebStorage-BMQO-dXK.js";import"./useAsync-W0CErRou.js";import"./useMountedState-BK0Y35lN.js";import"./componentData-CNQluCuE.js";import"./isSymbol-3Rk0qEEz.js";import"./isObject-CphdALKJ.js";import"./toString-YC_K2EVl.js";import"./ApiProvider-B3DrBnW0.js";import"./index-B0bGgVUV.js";import"./ThemeProvider-BZpfpFrZ.js";import"./CssBaseline-DWDV0Ah6.js";import"./palettes-Bwgvserk.js";const s=x({id:"storybook.test-route"}),j=()=>{const t=k();return o.jsxs("pre",{children:["Current location: ",t.pathname]})},uo={title:"Navigation/Link",component:i,decorators:[t=>f(o.jsxs("div",{children:[o.jsx("div",{children:o.jsx(j,{})}),o.jsx(t,{})]}),{mountedRoutes:{"/hello":s}})]},e=()=>{const t=h(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",o.jsx(u,{children:o.jsx(d,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})},r=()=>{const t=h(s);return o.jsxs(o.Fragment,{children:[o.jsx(i,{to:t(),component:R,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",o.jsx(u,{children:o.jsx(d,{path:t(),element:o.jsx("h1",{children:"Hi there!"})})})]})};r.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"PassProps"};var n,a,p;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
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
