import{j as e,a4 as i,a5 as a,a6 as m}from"./iframe-K1-r__6v.js";import{L as s,N as c}from"./Link-B5LuFRSc.js";import{u as p}from"./useRouteRef-C40w7bUW.js";import{w as l,c as u}from"./appWrappers-BzzSDVYI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DpBtBlP-.js";import"./lodash-DrAHxKI9.js";import"./useAnalytics-BPbkB55A.js";import"./makeStyles-cstAPlYX.js";import"./useApp-qTVc4QMB.js";import"./WebStorage-CXRAncSk.js";import"./useAsync-BgYtvaG8.js";import"./useMountedState-BKHhStKI.js";import"./componentData-BZ_GpIAl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CE15zcTV.js";import"./useIsomorphicLayoutEffect-DUO6YzsE.js";import"./BUIProvider-BXUq6XUb.js";import"./openLink-Buy5e0wx.js";const n=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},E={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":n}})],tags:["!manifest"]},r=()=>{const o=p(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(i,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:c,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(i,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const F=["Default","PassProps"];export{r as Default,t as PassProps,F as __namedExportsOrder,E as default};
