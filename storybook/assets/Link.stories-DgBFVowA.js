import{bR as e,X as n,W as a,cP as m}from"./iframe-B8uJzJnC.js";import{L as s,N as c}from"./Link-p9F1wzce.js";import{u as p}from"./useRouteRef-B7cWRPgM.js";import{O as l,a as u}from"./appWrappers-jqPKU8m4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CrkExXws.js";import"./lodash-D9y7SekR.js";import"./useAnalytics-DmS_ziXv.js";import"./makeStyles-CENq9NVb.js";import"./useApp-Crzm4FAT.js";import"./WebStorage-D83Ek40K.js";import"./useAsync-TaeDQlC6.js";import"./useMountedState-kS2pBaHK.js";import"./componentData-Bvjt-BZH.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DJYSpznI.js";import"./useIsomorphicLayoutEffect-C-N-_QA0.js";import"./BUIProvider-B485Y6HT.js";import"./openLink-BUwh7SN8.js";import"./useResolvedHref-CVch4iPG.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=m();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},F={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:c,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
