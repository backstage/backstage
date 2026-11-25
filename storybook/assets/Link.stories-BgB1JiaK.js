import{j as e}from"./iframe-T196ztmH.js";import{L as s}from"./Link-CM7hnzwh.js";import{N as p}from"./useApp-BYWpjzsK.js";import{u as i}from"./useRouteRef-DCzvXfLN.js";import{b as a,c as m,a as c}from"./index-DQMgTQ6t.js";import{w as l,c as u}from"./appWrappers-DTrP08Rq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CHb-0WlO.js";import"./lodash-CKeCnM0L.js";import"./useAnalytics-hRuUiONW.js";import"./makeStyles-wXls5oBk.js";import"./WebStorage-B8046LOY.js";import"./useAsync-VzOG_5Oq.js";import"./useMountedState-Csk1KXf2.js";import"./componentData-DV5XxZVR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bmztdeu0.js";import"./useIsomorphicLayoutEffect-BvTpWRpR.js";import"./BUIProvider-B84iVJlz.js";const n=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},E={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":n}})],tags:["!manifest"]},r=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:p,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
