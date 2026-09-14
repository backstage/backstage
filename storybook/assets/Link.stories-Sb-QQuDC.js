import{bQ as e,W as n,V as a,N as m,cM as c}from"./iframe-DXdR4xPj.js";import{L as s}from"./Link-CECNWZIJ.js";import{u as p}from"./useRouteRef-B6gXfved.js";import{O as l,a as u}from"./appWrappers-CEl3ywVn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CvcAu-rV.js";import"./lodash-CmjgS8yt.js";import"./useAnalytics-Bc97N_iw.js";import"./makeStyles-BSWJde_H.js";import"./useApp-cePut29r.js";import"./WebStorage-DQ8VF5en.js";import"./useAsync-BqpLlOup.js";import"./useMountedState-ONEV228w.js";import"./componentData-CHj3LiZV.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BS8_YX0o.js";import"./useIsomorphicLayoutEffect-Ch41KCBC.js";import"./BUIProvider-3mC0dqi4.js";import"./BUIRoutingProvider-Cv_U09wD.js";import"./openLink-C1Sid2pZ.js";import"./useResolvedHref-CWLs1pfc.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},F={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:m,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const O=["Default","PassProps"];export{r as Default,t as PassProps,O as __namedExportsOrder,F as default};
