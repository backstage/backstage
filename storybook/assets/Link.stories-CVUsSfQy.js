import{j as e,a8 as n,a9 as a,aa as m,e as c}from"./iframe-VdnJkTLn.js";import{L as s}from"./Link-MVqLQhLF.js";import{u as p}from"./useRouteRef-BCb_4M1S.js";import{w as l,c as u}from"./appWrappers-Dv9BydHr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCaKtv_x.js";import"./lodash-DattC6St.js";import"./useAnalytics-olN0zlPD.js";import"./makeStyles-Cp7Yf1JD.js";import"./useApp-C1mvMRCJ.js";import"./WebStorage-Ck7eL-8V.js";import"./useAsync-CefxiUcS.js";import"./useMountedState-Lohgsq4f.js";import"./componentData-DJVXTqDk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BtTsfyTo.js";import"./useIsomorphicLayoutEffect-Bf4nH5eI.js";import"./BUIProvider-BOKsEIJc.js";import"./BUIRoutingProvider-Bgp8Pk5b.js";import"./openLink-CXHSNm_V.js";import"./useResolvedHref-XC1sUx4v.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},M={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:m,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const S=["Default","PassProps"];export{r as Default,t as PassProps,S as __namedExportsOrder,M as default};
