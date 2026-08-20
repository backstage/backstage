import{bR as e,X as n,W as a,cP as m}from"./iframe-BHoENCVc.js";import{L as s,N as c}from"./Link-DbaMgic8.js";import{u as p}from"./useRouteRef-B9PFWjwA.js";import{O as l,a as u}from"./appWrappers-Bfq9ls44.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CwRuBl_7.js";import"./lodash-C1BWqHDU.js";import"./useAnalytics-Cx5c0pM3.js";import"./makeStyles-DPkHg9n9.js";import"./useApp-D78Q1Dx1.js";import"./WebStorage-DQiA-S4e.js";import"./useAsync-DaAAM54v.js";import"./useMountedState-CS6T7kHD.js";import"./componentData-BFK1FCBi.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-CYkRaHNa.js";import"./useIsomorphicLayoutEffect-BQX4Dz1t.js";import"./BUIProvider-BqojK_vt.js";import"./openLink-DZP0UHC7.js";import"./useResolvedHref-KjDbaJ0G.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},F={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:c,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const M=["Default","PassProps"];export{r as Default,t as PassProps,M as __namedExportsOrder,F as default};
