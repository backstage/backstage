import{j as e,a7 as n,a8 as a,a9 as m}from"./iframe-CsCfxPn_.js";import{L as s,N as c}from"./Link-BZkyGUYJ.js";import{u as p}from"./useRouteRef-D_n0iugk.js";import{w as l,c as u}from"./appWrappers-B9IK4atE.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BnA6fLC5.js";import"./lodash-CbHAjvV7.js";import"./useAnalytics-w4gYjMWf.js";import"./makeStyles-Cyq7q47K.js";import"./useApp-C_ncuDBH.js";import"./WebStorage-OFUHyLIx.js";import"./useAsync-BnuMT2jk.js";import"./useMountedState-BfmURTRU.js";import"./componentData-CHkqD8ZG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CQg4fRRq.js";import"./useIsomorphicLayoutEffect-BDGfUn1p.js";import"./BUIProvider-Chhfm5Ik.js";import"./openLink-BrP_7GAS.js";import"./useResolvedHref-QiPi986T.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},F={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:c,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
