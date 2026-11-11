import{j as e}from"./iframe-C7lYm63e.js";import{L as s}from"./Link-DKhx2tkV.js";import{N as p}from"./useApp-Ds50W7L8.js";import{u as i}from"./useRouteRef-Bh_1Sd7o.js";import{b as a,c as m,a as c}from"./index-FJv8Tr6k.js";import{w as l,c as u}from"./appWrappers-KdCTgzPu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DRQcGEH_.js";import"./lodash-jlhHekdq.js";import"./useAnalytics-QXmmoeIg.js";import"./makeStyles-CNdVE_9m.js";import"./WebStorage-DhNM77SW.js";import"./useAsync-Dlld0t9X.js";import"./useMountedState-Ci8ZHYTe.js";import"./componentData-DUVVu4D4.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CT592Ukx.js";import"./useIsomorphicLayoutEffect-B5WlYeIg.js";import"./BUIProvider-uNuGl61A.js";const n=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},E={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":n}})],tags:["!manifest"]},r=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=i(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:p,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(a,{children:e.jsx(m,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
