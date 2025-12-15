import{j as e}from"./iframe-C8uhRVJE.js";import{L as s,N as p}from"./Link-BbMg_ACg.js";import{R as i,a,u as m}from"./index-BYn64cw2.js";import{w as l,c as u}from"./appWrappers-BWLcUcVY.js";import{u as c}from"./useRouteRef-B0Vi5G0u.js";import"./preload-helper-PPVm8Dsz.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-CMB7EDSs.js";import"./useApp-IzIBR1Vv.js";import"./useObservable-BasahIcU.js";import"./useIsomorphicLayoutEffect-B6F3ekP_.js";import"./useAsync-CISCSNua.js";import"./useMountedState-D0BWMouD.js";import"./componentData-COYXa6k6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const n=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},D={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":n}})]},r=()=>{const o=c(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(i,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=c(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:p,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(i,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const I=["Default","PassProps"];export{r as Default,t as PassProps,I as __namedExportsOrder,D as default};
