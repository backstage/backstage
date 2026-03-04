import{j as e}from"./iframe-DC0HuKGF.js";import{L as s,N as p}from"./Link-DfdNxTky.js";import{R as a,a as i,u}from"./index-B88MtuqO.js";import{w as m,c as l}from"./appWrappers-tP4ySi-x.js";import{u as c}from"./useRouteRef-3mjRGht1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CMG1MCtf.js";import"./lodash-CrNJApB2.js";import"./makeStyles-CdFTekTr.js";import"./useAnalytics-BaWCJwCB.js";import"./useApp-qCrtr9Gq.js";import"./useObservable-CHbz0Rru.js";import"./useIsomorphicLayoutEffect-Btshp-T3.js";import"./useAsync-pX4Qh_w3.js";import"./useMountedState-DsJQXF1h.js";import"./componentData-D6GUiLTG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";const n=l({id:"storybook.test-route"}),d=()=>{const t=u();return e.jsxs("pre",{children:["Current location: ",t.pathname]})},I={title:"Navigation/Link",component:s,decorators:[t=>m(e.jsxs("div",{children:[e.jsx("div",{children:e.jsx(d,{})}),e.jsx(t,{})]}),{mountedRoutes:{"/hello":n}})],tags:["!manifest"]},r=()=>{const t=c(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:t(),children:"This link"})," will utilize the react-router MemoryRouter's navigation",e.jsx(a,{children:e.jsx(i,{path:t(),element:e.jsx("h1",{children:"Hi there!"})})})]})},o=()=>{const t=c(n);return e.jsxs(e.Fragment,{children:[e.jsx(s,{to:t(),component:p,color:"secondary",children:"This link"})," has props for both material-ui's component as well as for react-router-dom's",e.jsx(a,{children:e.jsx(i,{path:t(),element:e.jsx("h1",{children:"Hi there!"})})})]})};o.story={name:"Accepts material-ui Link's and react-router-dom Link's props"};r.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"PassProps"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>
  );
};
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const PassProps = () => {
  const link = useRouteRef(routeRef);

  return (
    <>
      <Link
        to={link()}
        /** react-router-dom related prop */
        component={RouterNavLink}
        /** material-ui related prop */
        color="secondary"
      >
        This link
      </Link>
      &nbsp;has props for both material-ui's component as well as for
      react-router-dom's
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>
  );
};
`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const link = useRouteRef(routeRef);
  return <>
      <Link to={link()}>This link</Link>&nbsp;will utilize the react-router
      MemoryRouter's navigation
      <Routes>
        <Route path={link()} element={<h1>Hi there!</h1>} />
      </Routes>
    </>;
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const M=["Default","PassProps"];export{r as Default,o as PassProps,M as __namedExportsOrder,I as default};
