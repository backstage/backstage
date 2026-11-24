import{j as e}from"./iframe-4nxqZpQH.js";import{L as s}from"./Link-AWxWmhmT.js";import{N as p}from"./useApp-BXGH6_Hd.js";import{u as i}from"./useRouteRef-D_FKPlJ_.js";import{b as a,c as m,a as c}from"./index-CKs39xo2.js";import{w as l,c as u}from"./appWrappers-BL5tKIQ4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BY3E6cHa.js";import"./lodash-D_m0bAY4.js";import"./useAnalytics-CLQ0SWuB.js";import"./makeStyles-JOYHJdob.js";import"./WebStorage-1RhSaSCX.js";import"./useAsync-_tUJq3XS.js";import"./useMountedState-gxvlKe0J.js";import"./componentData-Coc2t0be.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-ZAIT2VOc.js";import"./useIsomorphicLayoutEffect-ClDuK9_t.js";import"./BUIProvider-uTHUz88Y.js";const n=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},E={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":n}})],tags:["!manifest"]},r=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:p,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
