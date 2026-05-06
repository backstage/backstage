import{j as e,a7 as n,a8 as a,a9 as m}from"./iframe-CwGYDpYH.js";import{L as s,N as c}from"./Link-CswoIIi-.js";import{u as p}from"./useRouteRef-xXlqYEzJ.js";import{w as l,c as u}from"./appWrappers-ioq0ti9t.js";import"./preload-helper-PPVm8Dsz.js";import"./index-fEpbvEIU.js";import"./lodash-DVkgycFV.js";import"./useAnalytics-Bir4eJYF.js";import"./makeStyles-B-7ejBjc.js";import"./useApp-hwqbTLFx.js";import"./WebStorage-CI04uxRe.js";import"./useAsync-BYRlsE8D.js";import"./useMountedState-DGAu4OuG.js";import"./componentData-DSzXRFfR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-RUz3cz4T.js";import"./useIsomorphicLayoutEffect-GLlfoH7M.js";import"./BUIProvider-BSpClcjO.js";import"./openLink-Ds4I99G_.js";import"./useResolvedHref-ByF3i79N.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},F={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:c,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
