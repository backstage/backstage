import{j as e,a8 as n,a9 as a,aa as m,e as c}from"./iframe-DsaViRt6.js";import{L as s}from"./Link-Ddg_NHNk.js";import{u as p}from"./useRouteRef-BDc5HK_0.js";import{w as l,c as u}from"./appWrappers-4T5Umbw4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-kl08ino_.js";import"./lodash-MieUkT6_.js";import"./useAnalytics-C8e92oTN.js";import"./makeStyles-DomhxC8K.js";import"./useApp-Fb2uCB2O.js";import"./WebStorage-CNdBqC6r.js";import"./useAsync-1_mPOrBB.js";import"./useMountedState-tMdzOAMm.js";import"./componentData-B2aBErUu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D37lPVdM.js";import"./useIsomorphicLayoutEffect-ehheGkQi.js";import"./BUIProvider-CSv_q2aR.js";import"./BUIRoutingProvider-80Q71Qhv.js";import"./openLink-DOqnQA7B.js";import"./useResolvedHref-BnrY4UN4.js";const i=u({id:"storybook.test-route"}),d=()=>{const o=c();return e.jsxs("pre",{children:["Current location: ",o.pathname]})},M={title:"Navigation/Link",component:s,decorators:[o=>l(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(o,{})]}),{mountedRoutes:{"/hello":i}})],tags:["!manifest"]},r=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})},t=()=>{const o=p(i);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:o(),component:m,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(n,{children:e.jsx(a,{path:o(),element:e.jsx("h1",{children:"Hi there!"})})})]})};t.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
